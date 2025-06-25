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

        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);

        camera.position.z = 5;

        let animationFrameId;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const toRadians = angle => angle * (Math.PI / 180);

        const onMouseDown = (e) => {
            isDragging = true;
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };

            cube.rotation.y += toRadians(deltaMove.x * 0.5);
            cube.rotation.x += toRadians(deltaMove.y * 0.5);

            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        const onMouseLeave = () => {
            isDragging = false;
        };

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
