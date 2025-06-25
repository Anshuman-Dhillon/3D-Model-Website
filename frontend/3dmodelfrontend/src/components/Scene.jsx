import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MyScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        while (mount.firstChild) {
            mount.removeChild(mount.firstChild);
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x070b1a);

        const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        for (let i = 0; i < 200; i++) {
            const star = new THREE.Mesh(starGeometry, starMaterial.clone());
            star.position.x = (Math.random() - 0.5) * 100;
            star.position.y = (Math.random() - 0.5) * 100;
            star.position.z = (Math.random() - 0.5) * 100;
            scene.add(star);
        }

        
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );

        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);

        // Cube with shadows
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.4, metalness: 0.2 });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = false;
        scene.add(cube);

        // Ground plane to receive shadow
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        // Use a shadow-only material for the plane
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.4 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -2;
        plane.receiveShadow = true;
        scene.add(plane);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 10, 7.5);

        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 30;
        dirLight.shadow.camera.left = -10;
        dirLight.shadow.camera.right = 10;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -10;

        scene.add(dirLight);

        let animationFrameId;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        // Mouse drag rotation (same as before)
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const toRadians = angle => angle * (Math.PI / 180);
        const onMouseDown = (e) => { isDragging = true; };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };

            cube.rotation.y += toRadians(deltaMove.x * 0.5);
            cube.rotation.x += toRadians(deltaMove.y * 0.5);

            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => { isDragging = false; };
        const onMouseLeave = () => { isDragging = false; };

        mount.addEventListener('mousedown', onMouseDown);
        mount.addEventListener('mousemove', onMouseMove);
        mount.addEventListener('mouseup', onMouseUp);
        mount.addEventListener('mouseleave', onMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }

            mount.removeEventListener('mousedown', onMouseDown);
            mount.removeEventListener('mousemove', onMouseMove);
            mount.removeEventListener('mouseup', onMouseUp);
            mount.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return <div
        ref={mountRef}
        style={{
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
        }}
    />;
};

export default MyScene;