import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Billboard } from '@react-three/drei';
import * as THREE from 'three';

const HologramImage = ({ imagePath }) => {
  const texture = useTexture(imagePath);
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing glow
      const pulse = 0.65 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.material.opacity = pulse;
    }
  });

  return (
    <Billboard>
      <mesh ref={meshRef}>
        <planeGeometry args={[1.8, 2.8]} />
        <meshBasicMaterial 
          map={texture}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Billboard>
  );
};

const PulsingSphere = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      meshRef.current.scale.setScalar(scale);
      meshRef.current.material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.12, 32, 32]} />
      <meshStandardMaterial 
        color="#4b0082"
        emissive="#4b0082"
        emissiveIntensity={1.5}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

export default function CentralHologram({ selectedItem }) {
  return (
    <group position={[0, 0, 0]}>
      <PulsingSphere />
      {selectedItem && (
        <React.Suspense fallback={null}>
          <HologramImage imagePath={'/' + selectedItem.tarot_image_filename} />
        </React.Suspense>
      )}
    </group>
  );
}
