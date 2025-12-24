import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Optimized animated particles with reduced count and throttled updates
 */
const Particles: React.FC<{ count?: number }> = ({ count = 800 }) => {
    const mesh = useRef<THREE.Points>(null);
    const lastUpdate = useRef(0);
    
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Spread particles across a wider area for better coverage with fewer particles
            positions[i3] = (Math.random() - 0.5) * 30;
            positions[i3 + 1] = (Math.random() - 0.5) * 18;
            positions[i3 + 2] = (Math.random() - 0.5) * 18;
            
            // Enhanced color gradient from cyan to purple to pink
            const t = Math.random();
            colors[i3] = 0.2 + t * 0.5;     // R
            colors[i3 + 1] = 0.3 + t * 0.3; // G
            colors[i3 + 2] = 0.7 + t * 0.3; // B
        }
        
        return { positions, colors };
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;
        
        const time = state.clock.getElapsedTime();
        
        // Throttle updates to every 2 frames for better performance
        const frameCount = Math.floor(time * 60);
        if (frameCount === lastUpdate.current) return;
        lastUpdate.current = frameCount;
        
        const positions = mesh.current.geometry.attributes.position.array as Float32Array;
        
        // Simplified wave calculation - update only every 3rd particle per frame
        const offset = frameCount % 3;
        for (let i = offset; i < count; i += 3) {
            const i3 = i * 3;
            const x = positions[i3];
            const z = positions[i3 + 2];
            
            // Smoother wave motion
            positions[i3 + 1] = Math.sin(x * 0.3 + time * 0.4) * Math.cos(z * 0.3 + time * 0.25) * 2.5;
        }
        
        mesh.current.geometry.attributes.position.needsUpdate = true;
        mesh.current.rotation.y = time * 0.015;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={particles.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                vertexColors
                transparent
                opacity={0.7}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

/**
 * Optimized glowing orbs with reduced render overhead
 */
const GlowingOrbs: React.FC = () => {
    const group = useRef<THREE.Group>(null);
    
    const orbs = useMemo(() => {
        return Array.from({ length: 4 }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * 18,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12 - 5
            ] as [number, number, number],
            scale: 0.8 + Math.random() * 2,
            speed: 0.15 + Math.random() * 0.2,
            color: ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899'][i]
        }));
    }, []);

    useFrame((state) => {
        if (!group.current) return;
        const time = state.clock.getElapsedTime();
        
        group.current.children.forEach((child, i) => {
            const orb = orbs[i];
            child.position.y = orb.position[1] + Math.sin(time * orb.speed) * 2.5;
            child.position.x = orb.position[0] + Math.cos(time * orb.speed * 0.6) * 1.5;
        });
    });

    return (
        <group ref={group}>
            {orbs.map((orb, i) => (
                <mesh key={i} position={orb.position}>
                    <sphereGeometry args={[orb.scale, 24, 24]} />
                    <meshBasicMaterial
                        color={orb.color}
                        transparent
                        opacity={0.12}
                    />
                </mesh>
            ))}
        </group>
    );
};

/**
 * Simplified grid floor without complex shader
 */
const GridFloor: React.FC = () => {
    const mesh = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (!mesh.current) return;
        const material = mesh.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = state.clock.getElapsedTime();
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#6366f1') },
        uColor2: { value: new THREE.Color('#06b6d4') }
    }), []);

    return (
        <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
            <planeGeometry args={[60, 60, 40, 40]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `}
                fragmentShader={`
                    uniform float uTime;
                    uniform vec3 uColor1;
                    uniform vec3 uColor2;
                    varying vec2 vUv;
                    
                    void main() {
                        vec2 grid = abs(fract(vUv * 15.0 - 0.5) - 0.5) / fwidth(vUv * 15.0);
                        float line = min(grid.x, grid.y);
                        float gridIntensity = 1.0 - min(line, 1.0);
                        
                        float wave = sin(vUv.x * 8.0 + uTime * 0.5) * 0.5 + 0.5;
                        vec3 color = mix(uColor1, uColor2, wave);
                        
                        float fade = 1.0 - length(vUv - 0.5) * 1.8;
                        fade = clamp(fade, 0.0, 1.0);
                        
                        gl_FragColor = vec4(color * gridIntensity * fade * 0.25, gridIntensity * fade * 0.25);
                    }
                `}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

/**
 * Main animated background component with performance optimizations
 */
export const AnimatedBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0" style={{ willChange: 'transform' }}>
            <Canvas
                camera={{ position: [0, 0, 12], fov: 55 }}
                dpr={[1, 1.5]} // Limit DPR for performance
                gl={{ 
                    antialias: false, // Disable for performance
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
                frameloop="demand" // Only render when needed
                performance={{ min: 0.5 }} // Allow frame rate to drop gracefully
            >
                <ambientLight intensity={0.4} />
                <Particles count={800} />
                <GlowingOrbs />
                <GridFloor />
            </Canvas>
            
            {/* Gradient overlays - using will-change for GPU acceleration */}
            <div 
                className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background pointer-events-none" 
                style={{ willChange: 'opacity' }}
            />
            <div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-transparent to-cyan-900/30 pointer-events-none" 
                style={{ willChange: 'opacity' }}
            />
        </div>
    );
};

export default AnimatedBackground;
