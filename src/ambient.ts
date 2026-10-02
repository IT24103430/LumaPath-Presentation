import * as THREE from 'three';

export type AmbientScene = {
  setProgress: (progress: number) => void;
  destroy: () => void;
};

export function createAmbientScene(canvas: HTMLCanvasElement, reducedMotion: boolean): AmbientScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    canvas.hidden = true;
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 760 ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 18);

  const group = new THREE.Group();
  scene.add(group);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-8, -3.4, -2),
    new THREE.Vector3(-4.6, -1.7, 0),
    new THREE.Vector3(-1.4, 1.7, -1),
    new THREE.Vector3(2.3, 0.2, 0),
    new THREE.Vector3(5.8, -1.8, -2),
    new THREE.Vector3(9, 2.1, -4),
  ]);
  const path = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 180, 0.025, 8, false),
    new THREE.MeshBasicMaterial({ color: 0x6ae8ff, transparent: true, opacity: 0.46 })
  );
  group.add(path);

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(2.85, 0.013, 5, 120),
    new THREE.MeshBasicMaterial({ color: 0x74dfff, transparent: true, opacity: 0.18 })
  );
  halo.rotation.set(0.22, 0.8, 0.25);
  halo.position.set(1.9, 0.3, -3);
  group.add(halo);

  const points = [0.09, 0.31, 0.55, 0.77, 0.94].map((at, index) => {
    const node = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(index === 2 ? 0.14 : 0.095, 16, 16),
      new THREE.MeshBasicMaterial({ color: index === 2 ? 0xffc590 : 0xa4f1ff })
    );
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(index === 2 ? 0.34 : 0.23, 0.009, 5, 40),
      new THREE.MeshBasicMaterial({ color: index === 2 ? 0xffbd83 : 0xa1efff, transparent: true, opacity: 0.4 })
    );
    node.add(core, ring);
    node.position.copy(curve.getPoint(at));
    group.add(node);
    return node;
  });

  const traveler = new THREE.Group();
  traveler.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xe9ffff })
    ),
    new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x83eeff, transparent: true, opacity: 0.17, blending: THREE.AdditiveBlending, depthWrite: false })
    ),
    new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.012, 5, 40),
      new THREE.MeshBasicMaterial({ color: 0x9af2ff, transparent: true, opacity: 0.7 })
    )
  );
  traveler.position.copy(curve.getPoint(0.02));
  group.add(traveler);

  const particleCount = 130;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = -2 - Math.random() * 8;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xa9c9ff, size: 0.025, transparent: true, opacity: 0.45 }));
  scene.add(stars);

  let progress = 0;
  let targetProgress = 0;
  let frame = 0;
  let visible = true;
  const startTime = performance.now();
  let lastFrame = startTime;
  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  }
  function render() {
    renderer.render(scene, camera);
  }
  function tick() {
    if (!visible) return;
    const now = performance.now();
    const delta = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    const time = (now - startTime) / 1000;
    progress += (targetProgress - progress) * (1 - Math.exp(-delta * 6));
    group.rotation.y = Math.sin(time * 0.11) * 0.09 + progress * 0.42;
    group.rotation.z = Math.sin(time * 0.08) * 0.035 - progress * 0.14;
    group.position.x = -progress * 1.8;
    group.position.y = Math.sin(progress * Math.PI * 2) * 0.4;
    camera.position.z = 18 - progress * 1.7;
    camera.position.x = Math.sin(progress * Math.PI * 2) * 0.35;
    camera.lookAt(0, 0, 0);
    traveler.position.copy(curve.getPoint(0.02 + progress * 0.96));
    traveler.rotation.z = time * 0.45;
    traveler.scale.setScalar(1 + Math.sin(time * 2.6) * 0.1);
    stars.rotation.z = time * 0.002 + progress * 0.05;
    points.forEach((node, index) => {
      node.scale.setScalar(1 + Math.sin(time * 1.5 + index * 1.8) * 0.12);
    });
    render();
    frame = requestAnimationFrame(tick);
  }
  function onVisibility() {
    visible = !document.hidden;
    if (visible && !reducedMotion) { lastFrame = performance.now(); tick(); }
    else cancelAnimationFrame(frame);
  }
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  if (!reducedMotion) tick();

  return {
    setProgress(next) {
      if (reducedMotion) return;
      targetProgress = Math.max(0, Math.min(1, next));
    },
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
    },
  };
}
