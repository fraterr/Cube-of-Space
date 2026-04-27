import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, useTexture, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { positionMap, colorMap } from '../utils/geometryMap';

/* ── Sigil: tiny tarot card stamp ── */
const Sigil = ({ item, geomData, isSelected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(`${import.meta.env.BASE_URL}res/${item.tarot_image_filename}`);
  
  // Maximize texture quality
  useMemo(() => {
    if (texture) {
      texture.anisotropy = 16; // Standard max for modern GPUs
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    }
  }, [texture]);

  const { type, pos } = geomData;

  const { sigilPos, rotation } = useMemo(() => {
    const p = new THREE.Vector3(...pos);
    let target;

    if (type === 'axis' || type === 'diagonal') {
      const offsets = {
        'Above to Below': [0, 0.8, 0],
        'East to West':   [0.8, 0, 0],
        'North to South': [0, 0, -0.8],
        // Inner Diagonals
        'Lower SE to Upper NW': [0.6, -0.6, 0.6],
        'Lower NE to Upper SW': [0.6, -0.6, -0.6],
        'Lower SW to Upper NE': [-0.6, -0.6, 0.6],
        'Lower NW to Upper SE': [-0.6, -0.6, -0.6],
      };
      target = new THREE.Vector3(...(offsets[item.specific_position] || [0, 0, 0]));
    } else if (type === 'center') {
      target = new THREE.Vector3(0, 0, 0);
    } else {
      // Face / Edge: push well outside cube surface to avoid z-fighting
      const dir = p.clone().normalize();
      const offset = type === 'face' ? 0.15 : 0.25;
      target = p.clone().add(dir.multiplyScalar(offset));
    }

    // Compute rotation so plane faces outward from center
    const obj = new THREE.Object3D();
    obj.position.copy(target);
    if (target.lengthSq() > 0.01) {
      obj.lookAt(0, 0, 0);
      obj.rotateY(Math.PI);
    }
    return { sigilPos: target, rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z] };
  }, [pos, type, item.specific_position]);

  const ev = {
    onPointerOver: (e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; },
    onPointerOut:  (e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; },
    onClick:       (e) => { e.stopPropagation(); onClick(item); },
  };

  const size = type === 'face' ? [0.55, 0.85] : [0.3, 0.47];

  const plane = (
    <mesh {...ev} renderOrder={10}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );

  if (type === 'axis' || type === 'center' || type === 'diagonal') {
    return <Billboard position={sigilPos}>{plane}</Billboard>;
  }
  return <group position={sigilPos} rotation={rotation}>{plane}</group>;
};

/* ── Pulsing center sphere ── */
const PulsingSphere = () => {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.15);
    ref.current.material.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.5;
  });
  return (
    <mesh ref={ref} renderOrder={1}>
      <sphereGeometry args={[0.06, 32, 32]} />
      <meshStandardMaterial color="#4b0082" emissive="#4b0082" emissiveIntensity={1.5} roughness={0.1} metalness={0.9} />
    </mesh>
  );
};

/* ── Cube geometry (faces, edges, axes) ── */
const CubeGeometry = ({ item, geomData, isSelected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const { type, pos, rot } = geomData;
  const c = colorMap[item.bota_color] || '#fff';
  const em = (hovered || isSelected) ? c : '#000';
  const ei = isSelected ? 3 : hovered ? 1.5 : 0.5;

  const ev = {
    onPointerOver: (e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; },
    onPointerOut:  (e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; },
    onClick:       (e) => { e.stopPropagation(); onClick(item); },
  };

  if (type === 'face') {
    return (
      <mesh position={pos} rotation={rot} {...ev} renderOrder={0}>
        <planeGeometry args={[4, 4]} />
        <meshPhysicalMaterial
          color={c}
          transparent
          opacity={isSelected ? 0.08 : 0.03}
          roughness={0.05}
          metalness={0.2}
          depthWrite={false}
          emissive={em}
          emissiveIntensity={ei * 0.2}
          side={THREE.DoubleSide}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
        <Edges threshold={15} color={c} transparent opacity={hovered || isSelected ? 0.8 : 0.3} />
      </mesh>
    );
  }
  if (type === 'edge') {
    return (
      <mesh position={pos} rotation={rot} {...ev} renderOrder={2}>
        <cylinderGeometry args={[0.025, 0.025, 4, 12]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={ei} roughness={0.2} metalness={0.9} />
      </mesh>
    );
  }
  if (type === 'axis') {
    return (
      <mesh position={pos} rotation={rot} renderOrder={2}>
        <cylinderGeometry args={[0.015, 0.015, 4, 8]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={ei * 0.8} roughness={0.3} metalness={0.7} transparent opacity={0.6} />
      </mesh>
    );
  }
  if (type === 'diagonal') {
    const targetVec = new THREE.Vector3(...geomData.target);
    const mid = new THREE.Vector3(...pos);
    const length = targetVec.length() * 2; // Full diagonal length
    
    // Create a dummy to get the rotation
    const dummy = new THREE.Object3D();
    dummy.position.copy(mid);
    dummy.lookAt(targetVec);
    dummy.rotateX(Math.PI / 2); // Cylinder is Y-up, orient to Z-forward

    return (
      <mesh position={pos} rotation={dummy.rotation} renderOrder={2}>
        <cylinderGeometry args={[0.012, 0.012, length, 8]} />
        <meshStandardMaterial 
          color={c} 
          emissive={c} 
          emissiveIntensity={ei * 0.7} 
          roughness={0.3} 
          metalness={0.7} 
          transparent 
          opacity={0.5} 
        />
      </mesh>
    );
  }
  return null;
};

/* ── Main component ── */
export default function CubeOfSpace({ data, selectedId, onSelect }) {
  const labels = useMemo(() => [
    { text: "A", pos: [0, 3.2, 0] },
    { text: "B", pos: [0, -3.2, 0] },
    { text: "N", pos: [0, 0, -3.2] },
    { text: "S", pos: [0, 0, 3.2] },
    { text: "E", pos: [3.2, 0, 0] },
    { text: "W", pos: [-3.2, 0, 0] },
  ], []);

  return (
    <group>
      <PulsingSphere />
      {data.map((item) => {
        const gd = positionMap[item.specific_position];
        if (!gd || gd.type === 'center') return null;
        return <CubeGeometry key={`geo-${item.id}`} item={item} geomData={gd} isSelected={selectedId === item.id} onClick={onSelect} />;
      })}
      {data.map((item) => {
        const gd = positionMap[item.specific_position];
        if (!gd) return null;
        return <Sigil key={`sig-${item.id}`} item={item} geomData={gd} isSelected={selectedId === item.id} onClick={onSelect} />;
      })}

      {/* Cardinal direction labels */}
      {labels.map((lbl, i) => (
        <Text
          key={`lbl-${i}`}
          position={lbl.pos}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="center"
          fillOpacity={0.25}
          raycast={() => null}
          font={`${import.meta.env.BASE_URL}res/hebrew.ttf`}
        >
          {lbl.text}
        </Text>
      ))}
    </group>
  );
}
