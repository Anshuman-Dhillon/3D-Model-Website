import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import '../component design/ModelViewer.css';

function ModelViewer({ previewUrl, format, onClose }) {
    const mountRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const rendererRef = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        if (!previewUrl || !mountRef.current) return;

        const container = mountRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);

        // Camera
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 10000);
        camera.position.set(3, 2, 5);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = true;
        controls.enableZoom = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.4);
        fillLight.position.set(-5, 3, -5);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xa78bfa, 0.3);
        rimLight.position.set(0, -5, -5);
        scene.add(rimLight);

        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 40, 0x334155, 0x1e293b);
        scene.add(gridHelper);

        // Auto-adjust camera based on model bounding box
        function fitCameraToObject(object) {
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraDistance = maxDim / (2 * Math.tan(fov / 2));
            cameraDistance *= 1.8; // Add padding

            // Ensure minimum distance
            cameraDistance = Math.max(cameraDistance, 2);

            const direction = new THREE.Vector3(0.5, 0.35, 0.8).normalize();
            camera.position.copy(center).add(direction.multiplyScalar(cameraDistance));
            camera.lookAt(center);

            controls.target.copy(center);
            controls.update();

            // Update near/far planes based on model size
            camera.near = cameraDistance * 0.01;
            camera.far = cameraDistance * 100;
            camera.updateProjectionMatrix();

            // Scale grid to model
            gridHelper.scale.set(
                Math.max(1, maxDim / 10),
                1,
                Math.max(1, maxDim / 10)
            );
        }

        // Apply default material to objects without one
        function applyDefaultMaterial(object) {
            object.traverse((child) => {
                if (child.isMesh) {
                    if (!child.material || (Array.isArray(child.material) && child.material.length === 0)) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x60a5fa,
                            metalness: 0.3,
                            roughness: 0.6,
                        });
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }

        // Progress handler
        const onProgress = (event) => {
            if (event.total > 0) {
                setProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        const onError = (err) => {
            console.error('Model load error:', err);
            setError('Failed to load 3D model. The file format may not be supported for preview.');
            setLoading(false);
        };

        // Load model based on format
        const fmt = (format || '').toLowerCase();

        // Fetch the binary data ourselves, then use each loader's .parse()
        // method. This avoids issues with Three.js FileLoader URL handling
        // on non-extension streaming endpoints.
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(previewUrl);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const arrayBuffer = await response.arrayBuffer();
                if (cancelled) return;

                let object;

                if (fmt === 'glb' || fmt === 'gltf') {
                    const loader = new GLTFLoader();
                    const gltf = await new Promise((resolve, reject) => {
                        loader.parse(arrayBuffer, '', resolve, reject);
                    });
                    object = gltf.scene;
                } else if (fmt === 'obj') {
                    const loader = new OBJLoader();
                    const text = new TextDecoder().decode(arrayBuffer);
                    object = loader.parse(text);
                } else if (fmt === 'fbx') {
                    const loader = new FBXLoader();
                    object = loader.parse(arrayBuffer, '');
                } else if (fmt === 'stl') {
                    const loader = new STLLoader();
                    const geometry = loader.parse(arrayBuffer);
                    const material = new THREE.MeshStandardMaterial({
                        color: 0x60a5fa,
                        metalness: 0.4,
                        roughness: 0.5,
                    });
                    object = new THREE.Mesh(geometry, material);
                    object.castShadow = true;
                    object.receiveShadow = true;
                } else {
                    // Try GLTF as fallback
                    const loader = new GLTFLoader();
                    try {
                        const gltf = await new Promise((resolve, reject) => {
                            loader.parse(arrayBuffer, '', resolve, reject);
                        });
                        object = gltf.scene;
                    } catch {
                        setError(`Format "${format}" is not supported for 3D preview. Supported: GLB, GLTF, OBJ, FBX, STL`);
                        setLoading(false);
                        return;
                    }
                }

                if (cancelled) return;
                applyDefaultMaterial(object);
                scene.add(object);
                fitCameraToObject(object);
                setLoading(false);
            } catch (err) {
                if (!cancelled) onError(err);
            }
        })();

        // Animation loop
        function animate() {
            frameRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // Handle resize
        function handleResize() {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelled = true;
            window.removeEventListener('resize', handleResize);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            controls.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.geometry?.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material?.dispose();
                    }
                }
            });
        };
    }, [previewUrl, format]);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="model-viewer-overlay" onClick={onClose}>
            <div className="model-viewer-modal" onClick={e => e.stopPropagation()}>
                <div className="model-viewer-header">
                    <h3>3D Model Viewer</h3>
                    <div className="model-viewer-controls-info">
                        <span>🖱 Rotate</span>
                        <span>⚙ Scroll to Zoom</span>
                        <span>⇧ + 🖱 Pan</span>
                    </div>
                    <button className="model-viewer-close" onClick={onClose}>✕</button>
                </div>
                <div className="model-viewer-canvas" ref={mountRef}>
                    {loading && (
                        <div className="model-viewer-loading">
                            <div className="model-viewer-spinner" />
                            <p>Loading 3D Model...{progress > 0 ? ` ${progress}%` : ''}</p>
                        </div>
                    )}
                    {error && (
                        <div className="model-viewer-error">
                            <span className="model-viewer-error-icon">⚠</span>
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModelViewer;
