import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function NeuralBackground({ matrix }: { matrix: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, host.clientWidth / host.clientHeight, 0.1, 1000);
    camera.position.z = 72;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const count = 520;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 180;
      positions[i + 1] = (Math.random() - 0.5) * 120;
      positions[i + 2] = (Math.random() - 0.5) * 90;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: matrix ? '#27ff76' : '#27fff2',
      size: matrix ? 0.82 : 0.64,
      transparent: true,
      opacity: 0.78
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      points.rotation.x += matrix ? 0.0007 : 0.00035;
      points.rotation.y += matrix ? 0.0016 : 0.0009;
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [matrix]);

  return <div ref={ref} className="pointer-events-none fixed inset-0 z-0 opacity-70" />;
}
