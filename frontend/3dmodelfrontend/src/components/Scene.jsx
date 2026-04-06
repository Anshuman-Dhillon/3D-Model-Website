import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MyScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        while (mount.firstChild) mount.removeChild(mount.firstChild);

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x070b1a);
        scene.fog = new THREE.FogExp2(0x070b1a, 0.035);

        const camera = new THREE.PerspectiveCamera(
            75, mount.clientWidth / mount.clientHeight, 0.1, 1000
        );
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // ── Starfield ──
        const starCount = 600;
        const starPositions = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);
        for (let i = 0; i < starCount; i++) {
            starPositions[i * 3] = (Math.random() - 0.5) * 80;
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
            starSizes[i] = Math.random() * 2 + 0.5;
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff, size: 0.12, transparent: true, opacity: 0.8, sizeAttenuation: true,
        });
        scene.add(new THREE.Points(starGeometry, starMaterial));

        // ── Central wireframe icosahedron ──
        const icoGeo = new THREE.IcosahedronGeometry(1.8, 1);
        const wireframe = new THREE.WireframeGeometry(icoGeo);
        const icoMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.6 });
        const icoLines = new THREE.LineSegments(wireframe, icoMat);
        scene.add(icoLines);

        // ── Solid inner icosahedron (glassy) ──
        const innerMat = new THREE.MeshPhysicalMaterial({
            color: 0x3b82f6, transparent: true, opacity: 0.15, roughness: 0.1,
            metalness: 0.9, clearcoat: 1.0, clearcoatRoughness: 0.1,
        });
        const innerMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 2), innerMat);
        scene.add(innerMesh);

        // ── Floating particles ring ──
        const particleCount = 200;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 3 + Math.random() * 1.5;
            const y = (Math.random() - 0.5) * 1.5;
            particlePositions[i * 3] = Math.cos(angle) * radius;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0xa78bfa, size: 0.06, transparent: true, opacity: 0.9, sizeAttenuation: true,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // ── Outer ring ──
        const ringGeo = new THREE.TorusGeometry(3.5, 0.02, 8, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        // Second ring at angle
        const ring2 = new THREE.Mesh(
            new THREE.TorusGeometry(4, 0.015, 8, 100),
            new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.2 })
        );
        ring2.rotation.x = Math.PI / 3;
        ring2.rotation.y = Math.PI / 6;
        scene.add(ring2);

        // ── Lighting ──
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const pointLight = new THREE.PointLight(0x60a5fa, 2, 20);
        pointLight.position.set(3, 3, 5);
        scene.add(pointLight);
        const pointLight2 = new THREE.PointLight(0xa78bfa, 1.5, 15);
        pointLight2.position.set(-4, -2, 3);
        scene.add(pointLight2);

        // ── Mouse tracking ──
        const mouse = { x: 0, y: 0 };
        const onMouseMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // ── Animation ──
        let animationFrameId;
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Rotate main shape
            icoLines.rotation.x = elapsed * 0.15 + mouse.y * 0.3;
            icoLines.rotation.y = elapsed * 0.2 + mouse.x * 0.3;
            innerMesh.rotation.x = elapsed * 0.12;
            innerMesh.rotation.y = elapsed * 0.18;

            // Rotate particle ring
            particles.rotation.y = elapsed * 0.1;

            // Slowly rotate rings
            ring.rotation.z = elapsed * 0.05;
            ring2.rotation.z = -elapsed * 0.03;

            // Pulse wireframe opacity
            icoMat.opacity = 0.4 + Math.sin(elapsed * 2) * 0.2;

            // Gentle camera sway
            camera.position.x = Math.sin(elapsed * 0.1) * 0.3 + mouse.x * 0.5;
            camera.position.y = Math.cos(elapsed * 0.15) * 0.2 + mouse.y * 0.3;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };
        animate();

        // ── Resize ──
        const handleResize = () => {
            if (!mount) return;
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // ── Cleanup ──
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            if (mount && renderer.domElement) {
                mount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div
        ref={mountRef}
        style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative',
        }}
    />;
};

export default MyScene;