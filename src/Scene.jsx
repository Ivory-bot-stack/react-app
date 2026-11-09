import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* Escena 3D: globo de líneas (guiño al logo) + anillo dorado + partículas.
   Se adapta al dispositivo, reacciona al scroll y al puntero, y se pausa si la pestaña está oculta. */
export default function Scene() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const weak = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const mobile = innerWidth < 700;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !weak, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, weak ? 1 : 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.z = 6;

    // Globo
    const globe = new THREE.Mesh(new THREE.IcosahedronGeometry(1.9, weak ? 1 : 2),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.16 }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.006, 8, weak ? 80 : 160),
      new THREE.MeshBasicMaterial({ color: 0xd4b36a, transparent: true, opacity: 0.5 }));
    ring.rotation.x = 1.2;
    const group = new THREE.Group(); group.add(globe, ring); scene.add(group);

    // Partículas con textura circular suave
    const n = reduce ? 0 : weak ? 250 : mobile ? 600 : 1200;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    const gold = new THREE.Color(0xd4b36a), vio = new THREE.Color(0xb79cff);
    for (let i = 0; i < n; i++) {
      pos.set([(Math.random() - .5) * 18, (Math.random() - .5) * 14, (Math.random() - .5) * 12 - 2], i * 3);
      (Math.random() < .2 ? gold : vio).toArray(col, i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const c2 = document.createElement('canvas'); c2.width = c2.height = 32;
    const x = c2.getContext('2d'), gr = x.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, '#fff'); gr.addColorStop(1, 'transparent'); x.fillStyle = gr; x.fillRect(0, 0, 32, 32);
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.06, map: new THREE.CanvasTexture(c2), vertexColors: true,
      transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(pts);

    const resize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      group.position.x = innerWidth > 900 ? 2.4 : 0; group.scale.setScalar(innerWidth > 900 ? 1 : 0.8); };
    resize(); addEventListener('resize', resize);

    let mx = 0, my = 0, speed = 1, run = true, raf;
    const onMove = e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; };
    addEventListener('pointermove', onMove, { passive: true });
    const vis = () => { run = !document.hidden; if (run) loop(); };
    document.addEventListener('visibilitychange', vis);
    // Al llegar a la conclusión, el movimiento se calma
    const io = new IntersectionObserver(([e]) => { speed = e.isIntersecting ? 0.25 : 1; }, { threshold: .4 });
    const end = document.getElementById('conclusion'); end && io.observe(end);

    let t = 0;
    const loop = () => {
      if (!run) return;
      t += 0.004 * speed;
      const sp = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
      globe.rotation.y = t + sp * 4; globe.rotation.x = Math.sin(t) * .15 + my * .3;
      ring.rotation.z = t * 1.5;
      group.position.y += ((sp * 2.5 - 1.2) - group.position.y) * 0.04;  // sigue el scroll con suavidad
      camera.position.x += (mx * 0.6 - camera.position.x) * 0.03;
      pts.rotation.y = t * .3; pts.position.y = sp * 1.5;
      renderer.render(scene, camera);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    loop();

    return () => { cancelAnimationFrame(raf); run = false; removeEventListener('resize', resize); removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', vis); io.disconnect(); renderer.dispose(); g.dispose(); };
  }, []);
  return <canvas id="fx" ref={ref} />;
}
