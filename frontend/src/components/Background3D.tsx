import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Background3DProps {
  className?: string;
  intensity?: 'subtle' | 'normal' | 'vibrant';
}

export const Background3D: React.FC<Background3DProps> = ({
  className = '',
  intensity = 'normal',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Respect accessibility: prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Viewport and device tiering
    const width = container.clientWidth || window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    const nodeCount = isMobile ? 12 : isTablet ? 20 : 32;
    const packetCount = isMobile ? 6 : 14;
    const particleCount = isMobile ? 50 : isTablet ? 100 : 180;
    const maxLineDistance = isMobile ? 7.5 : 9.5;

    // 1. Scene setup with deep space-grade atmospheric fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a11, 0.022);

    // 2. Camera setup
    const initialAspect = (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight);
    const camera = new THREE.PerspectiveCamera(52, initialAspect, 0.1, 90);
    camera.position.set(0, 0, 22);

    // 3. WebGL Renderer
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // 4. Atmospheric Technology Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, intensity === 'subtle' ? 1.5 : 2.8, 40);
    cyanPointLight.position.set(-12, 10, 8);
    scene.add(cyanPointLight);

    const bluePointLight = new THREE.PointLight(0x3b82f6, intensity === 'subtle' ? 1.5 : 2.5, 45);
    bluePointLight.position.set(14, -8, 6);
    scene.add(bluePointLight);

    const emeraldPointLight = new THREE.PointLight(0x10b981, 1.2, 35);
    emeraldPointLight.position.set(0, 14, 4);
    scene.add(emeraldPointLight);

    // 5. Digital Career Intelligence Nodes
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    interface NetworkNode {
      mesh: THREE.Mesh;
      ringMesh?: THREE.Mesh;
      basePosition: THREE.Vector3;
      velocity: THREE.Vector3;
      floatPhase: number;
      floatSpeed: number;
      isHub: boolean;
      color: number;
    }

    const nodes: NetworkNode[] = [];
    const nodeColors = [0x06b6d4, 0x38bdf8, 0x3b82f6, 0x10b981, 0x818cf8];

    // Shared Geometries for GPU optimization
    const sphereGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const octaGeo = new THREE.OctahedronGeometry(0.48, 0);
    const icosaGeo = new THREE.IcosahedronGeometry(0.36, 0);
    const ringGeo = new THREE.TorusGeometry(0.85, 0.035, 8, 28);

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });

    for (let i = 0; i < nodeCount; i++) {
      const color = nodeColors[i % nodeColors.length];
      const isHub = i % 4 === 0;

      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: isHub ? 0.8 : 0.45,
        roughness: 0.25,
        metalness: 0.75,
        transparent: true,
        opacity: 0.9,
      });

      const mesh = new THREE.Mesh(isHub ? octaGeo : i % 2 === 0 ? icosaGeo : sphereGeo, mat);

      const spreadX = isMobile ? 16 : 28;
      const spreadY = isMobile ? 14 : 18;
      const spreadZ = 14;

      const basePos = new THREE.Vector3(
        (Math.random() - 0.5) * spreadX,
        (Math.random() - 0.5) * spreadY,
        (Math.random() - 0.5) * spreadZ - 2
      );
      mesh.position.copy(basePos);

      let ringMesh: THREE.Mesh | undefined;
      if (isHub) {
        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        mesh.add(ringMesh);
      }

      nodeGroup.add(mesh);

      nodes.push({
        mesh,
        ringMesh,
        basePosition: basePos.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.002
        ),
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.4 + Math.random() * 0.6,
        isHub,
        color,
      });
    }

    // 6. Dynamic Connection Pathways (Constellation Lines)
    const maxLines = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // 7. Active Data Packets Traveling Along Connections
    interface DataPacket {
      mesh: THREE.Mesh;
      startNode: number;
      endNode: number;
      progress: number;
      speed: number;
    }

    const packets: DataPacket[] = [];
    const packetGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.9,
    });

    for (let i = 0; i < packetCount; i++) {
      const pMesh = new THREE.Mesh(packetGeo, packetMat);
      scene.add(pMesh);
      packets.push({
        mesh: pMesh,
        startNode: Math.floor(Math.random() * nodes.length),
        endNode: Math.floor(Math.random() * nodes.length),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
      });
    }

    // 8. Abstract 3D Geometric Structures (Skills Matrix, Corporate Hubs)
    const structuresGroup = new THREE.Group();
    scene.add(structuresGroup);

    interface GeometricStructure {
      mesh: THREE.Group;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      baseY: number;
      floatSpeed: number;
      floatPhase: number;
    }

    const structures: GeometricStructure[] = [];

    const structureConfigs = [
      { type: 'nested-cube', x: -12, y: 5, z: -4, size: 1.8, color: 0x06b6d4 },
      { type: 'gyro-ring', x: 13, y: 6, z: -3, size: 2.0, color: 0x3b82f6 },
      { type: 'octa-shield', x: -9, y: -6, z: -5, size: 1.9, color: 0x10b981 },
      { type: 'dodeca-hub', x: 11, y: -5, z: -6, size: 1.6, color: 0x818cf8 },
    ];

    for (let i = 0; i < (isMobile ? 2 : structureConfigs.length); i++) {
      const cfg = structureConfigs[i];
      const group = new THREE.Group();
      group.position.set(cfg.x, cfg.y, cfg.z);

      const wireframeMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });

      const coreMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: 0.7,
      });

      if (cfg.type === 'nested-cube') {
        const outer = new THREE.Mesh(new THREE.BoxGeometry(cfg.size, cfg.size, cfg.size), wireframeMat);
        const inner = new THREE.Mesh(new THREE.BoxGeometry(cfg.size * 0.55, cfg.size * 0.55, cfg.size * 0.55), coreMat);
        group.add(outer);
        group.add(inner);
      } else if (cfg.type === 'gyro-ring') {
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(cfg.size, 0.06, 8, 28), wireframeMat);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(cfg.size * 0.75, 0.05, 8, 24), wireframeMat);
        ring2.rotation.x = Math.PI / 2;
        const center = new THREE.Mesh(new THREE.SphereGeometry(cfg.size * 0.28, 12, 12), coreMat);
        group.add(ring1);
        group.add(ring2);
        group.add(center);
      } else if (cfg.type === 'octa-shield') {
        const outer = new THREE.Mesh(new THREE.OctahedronGeometry(cfg.size, 0), wireframeMat);
        const inner = new THREE.Mesh(new THREE.OctahedronGeometry(cfg.size * 0.5, 0), coreMat);
        group.add(outer);
        group.add(inner);
      } else {
        const dodeca = new THREE.Mesh(new THREE.DodecahedronGeometry(cfg.size, 0), wireframeMat);
        const innerSphere = new THREE.Mesh(new THREE.SphereGeometry(cfg.size * 0.4, 10, 10), coreMat);
        group.add(dodeca);
        group.add(innerSphere);
      }

      structuresGroup.add(group);
      structures.push({
        mesh: group,
        rotSpeedX: (Math.random() - 0.5) * 0.005,
        rotSpeedY: (Math.random() - 0.5) * 0.008,
        rotSpeedZ: (Math.random() - 0.5) * 0.004,
        baseY: cfg.y,
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatPhase: Math.random() * Math.PI * 2,
      });
    }

    // 9. Floating Career Starfield / Opportunity Particles
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 36;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
      particleSpeeds.push(0.004 + Math.random() * 0.008);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: isMobile ? 0.12 : 0.18,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 10. Interactive Mouse Parallax (desktop)
    let targetCameraX = 0;
    let targetCameraY = 0;
    let currentCameraX = 0;
    let currentCameraY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile || prefersReducedMotion) return;
      const normX = (event.clientX / window.innerWidth) * 2 - 1;
      const normY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = normX * 1.8;
      targetCameraY = normY * 1.2;
    };

    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // 11. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const renderScene = () => {
      if (!renderer) return;
      const elapsed = clock.getElapsedTime();

      // Camera parallax interpolation
      if (!prefersReducedMotion && !isMobile) {
        currentCameraX += (targetCameraX - currentCameraX) * 0.04;
        currentCameraY += (targetCameraY - currentCameraY) * 0.04;
        camera.position.x = currentCameraX;
        camera.position.y = currentCameraY;
        camera.lookAt(0, 0, 0);
      }

      if (!prefersReducedMotion) {
        // Dynamic living lights sweeping slowly
        cyanPointLight.position.x = Math.sin(elapsed * 0.35) * 14;
        cyanPointLight.position.y = 8 + Math.cos(elapsed * 0.3) * 5;

        bluePointLight.position.x = Math.cos(elapsed * 0.4) * 16;
        bluePointLight.position.y = -7 + Math.sin(elapsed * 0.25) * 4;

        // Animate nodes
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const mesh = node.mesh;

          mesh.position.y = node.basePosition.y + Math.sin(elapsed * node.floatSpeed + node.floatPhase) * 0.55;
          mesh.position.x = node.basePosition.x + Math.cos(elapsed * (node.floatSpeed * 0.7) + node.floatPhase) * 0.35;

          mesh.rotation.y += 0.007;
          mesh.rotation.x += 0.004;

          if (node.ringMesh) {
            node.ringMesh.rotation.x += 0.012;
            node.ringMesh.rotation.y += 0.009;
          }
        }

        // Build active connection lines between nearby nodes
        let lineIndex = 0;
        let colorIndex = 0;
        const positions = lineGeometry.attributes.position.array as Float32Array;
        const colors = lineGeometry.attributes.color.array as Float32Array;

        const activePairs: [THREE.Vector3, THREE.Vector3][] = [];

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const p1 = nodes[i].mesh.position;
            const p2 = nodes[j].mesh.position;
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dz = p1.z - p2.z;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < maxLineDistance * maxLineDistance) {
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / maxLineDistance) * 0.6;

              positions[lineIndex++] = p1.x;
              positions[lineIndex++] = p1.y;
              positions[lineIndex++] = p1.z;
              positions[lineIndex++] = p2.x;
              positions[lineIndex++] = p2.y;
              positions[lineIndex++] = p2.z;

              const r = 0.03 + alpha * 0.15;
              const g = 0.55 + alpha * 0.35;
              const b = 0.9 + alpha * 0.1;

              colors[colorIndex++] = r;
              colors[colorIndex++] = g;
              colors[colorIndex++] = b;
              colors[colorIndex++] = r;
              colors[colorIndex++] = g;
              colors[colorIndex++] = b;

              activePairs.push([p1, p2]);
            }
          }
        }

        lineGeometry.setDrawRange(0, lineIndex / 3);
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;

        // Animate traveling data packets
        for (let i = 0; i < packets.length; i++) {
          const packet = packets[i];
          packet.progress += packet.speed;

          if (packet.progress >= 1.0) {
            packet.progress = 0;
            packet.startNode = Math.floor(Math.random() * nodes.length);
            packet.endNode = (packet.startNode + 1 + Math.floor(Math.random() * (nodes.length - 1))) % nodes.length;
          }

          const startPos = nodes[packet.startNode]?.mesh.position;
          const endPos = nodes[packet.endNode]?.mesh.position;

          if (startPos && endPos) {
            packet.mesh.position.lerpVectors(startPos, endPos, packet.progress);
            packet.mesh.visible = true;
          } else {
            packet.mesh.visible = false;
          }
        }

        // Animate geometric structures
        for (let i = 0; i < structures.length; i++) {
          const s = structures[i];
          s.mesh.rotation.x += s.rotSpeedX;
          s.mesh.rotation.y += s.rotSpeedY;
          s.mesh.rotation.z += s.rotSpeedZ;
          s.mesh.position.y = s.baseY + Math.sin(elapsed * s.floatSpeed + s.floatPhase) * 0.45;
        }

        // Animate floating starfield particles
        const particlePos = particleGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          particlePos[i * 3 + 1] += particleSpeeds[i];
          if (particlePos[i * 3 + 1] > 14) {
            particlePos[i * 3 + 1] = -14;
            particlePos[i * 3] = (Math.random() - 0.5) * 36;
          }
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderScene);
      }
    };

    renderScene();

    // 12. Resize Observer
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // 13. Complete cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Points) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });

      sphereGeo.dispose();
      octaGeo.dispose();
      icosaGeo.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};
