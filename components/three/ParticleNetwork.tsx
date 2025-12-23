import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleNetwork: React.FC = () => {
  const count = 70; // Number of nodes
  const connectionDistance = 3.5;
  const speed = 0.2;

  // Use refs for animation to avoid re-renders
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  
  // Initialize particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 10;
      const vx = (Math.random() - 0.5) * speed;
      const vy = (Math.random() - 0.5) * speed;
      const vz = (Math.random() - 0.5) * speed;
      temp.push({ x, y, z, vx, vy, vz });
    }
    return temp;
  }, []);

  // Prepare geometry buffers
  const positions = useMemo(() => new Float32Array(count * 3), []);
  const linePositions = useMemo(() => new Float32Array(count * count * 3 * 2), []); // Max potential lines
  const lineColors = useMemo(() => new Float32Array(count * count * 3 * 2), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    let lineIndex = 0;

    // Update particles
    particles.forEach((particle, i) => {
      // Move
      particle.x += particle.vx * 0.05;
      particle.y += particle.vy * 0.05;
      particle.z += particle.vz * 0.05;

      // Bounce off imaginary walls
      if (particle.x > 10 || particle.x < -10) particle.vx *= -1;
      if (particle.y > 6 || particle.y < -6) particle.vy *= -1;
      if (particle.z > 5 || particle.z < -5) particle.vz *= -1;

      // Subtle float
      particle.y += Math.sin(time * 0.5 + i) * 0.002;

      // Update buffer
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;
    });

    // Update lines
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectionDistance) {
          // Add line segment
          linePositions[lineIndex * 3] = p1.x;
          linePositions[lineIndex * 3 + 1] = p1.y;
          linePositions[lineIndex * 3 + 2] = p1.z;

          linePositions[lineIndex * 3 + 3] = p2.x;
          linePositions[lineIndex * 3 + 4] = p2.y;
          linePositions[lineIndex * 3 + 5] = p2.z;

          // Alpha based on distance
          const alpha = 1.0 - dist / connectionDistance;
          const color = new THREE.Color(0x06b6d4); // Cyan
          
          // Set colors for both vertices of the line
          for (let k = 0; k < 6; k++) {
             lineColors[lineIndex * 3 + k] = color.r * (k < 3 ? 1 : 0.8); // slight gradient illusion
          }

          lineIndex += 2;
        }
      }
    }

    // Update points geometry
    if (pointsRef.current) {
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Update lines geometry
    if (linesRef.current) {
        linesRef.current.geometry.setDrawRange(0, lineIndex);
        linesRef.current.geometry.attributes.position.needsUpdate = true;
        // Ideally we would update colors too if we want dynamic fading, 
        // but for performance in this demo, let's keep simple static color or update if needed.
    }
  });

  // Create buffers only once
  const pointGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  return (
    <>
      <points ref={pointsRef} geometry={pointGeometry}>
        <pointsMaterial
          size={0.15}
          color="#06b6d4"
          transparent
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
};

export default ParticleNetwork;