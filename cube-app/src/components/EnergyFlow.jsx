import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { colorMap } from '../utils/geometryMap';

const SPEED = 0.25;
const SPHERES_PER_PATH = 8;

// Each path tagged with the specific_position from data.json it flows along
const PATHS = [
  // Phase A: Axes
  { from: [0,0,0], to: [0,2,0],    position: 'Above to Below' },
  { from: [0,0,0], to: [0,-2,0],   position: 'Above to Below' },
  { from: [0,0,0], to: [2,0,0],    position: 'East to West' },
  { from: [0,0,0], to: [-2,0,0],   position: 'East to West' },
  { from: [0,0,0], to: [0,0,-2],   position: 'North to South' },
  { from: [0,0,0], to: [0,0,2],    position: 'North to South' },
  // Phase B: Eastern Face Loop
  { from: [2,2,-2], to: [2,-2,-2],   position: 'North-East' },
  { from: [2,-2,-2], to: [2,-2,2],   position: 'East-Below' },
  { from: [2,-2,2], to: [2,2,2],     position: 'South-East' },
  { from: [2,2,2], to: [2,2,-2],     position: 'East-Above' },
  // Upper Face Loop
  { from: [2,2,-2], to: [-2,2,-2],   position: 'North-Above' },
  { from: [-2,2,-2], to: [-2,2,2],   position: 'West-Above' },
  { from: [-2,2,2], to: [2,2,2],     position: 'South-Above' },
  // Singles
  { from: [-2,2,-2], to: [-2,-2,-2], position: 'North-West' },
  { from: [-2,-2,2], to: [-2,2,2],   position: 'South-West' },
  { from: [2,-2,-2], to: [-2,-2,-2], position: 'North-Below' },
  { from: [-2,-2,-2], to: [-2,-2,2], position: 'West-Below' },
  { from: [-2,-2,2], to: [2,-2,2],   position: 'South-Below' },
  // Phase D: Inner Diagonals (Corner to Corner)
  { from: [2,-2,2],  to: [-2,2,-2],  position: 'Lower SE to Upper NW' },
  { from: [2,-2,-2], to: [-2,2,2],   position: 'Lower NE to Upper SW' },
  { from: [-2,-2,2], to: [2,2,-2],   position: 'Lower SW to Upper NE' },
  { from: [-2,-2,-2], to: [2,2,2],    position: 'Lower NW to Upper SE' },
];

const coneGeo = new THREE.ConeGeometry(1, 3, 6);
coneGeo.rotateX(Math.PI / 2);

export default function EnergyFlow({ active, data }) {
  const sphereRef = useRef();
  const arrowRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const totalSpheres = PATHS.length * SPHERES_PER_PATH;
  const totalArrows = PATHS.length;

  // Build a lookup: specific_position → hex color from loaded data
  const posColorMap = useMemo(() => {
    const map = {};
    if (data) {
      data.forEach(item => {
        map[item.specific_position] = colorMap[item.bota_color] || '#ffffff';
      });
    }
    return map;
  }, [data]);

  const vecs = useMemo(() => PATHS.map(p => {
    const from = new THREE.Vector3(...p.from);
    const to = new THREE.Vector3(...p.to);
    const dir = to.clone().sub(from).normalize();
    return { from, to, dir };
  }), []);

  // Build per-instance color arrays from data lookup
  const { sphereColors, arrowColors } = useMemo(() => {
    const sc = new Float32Array(totalSpheres * 3);
    const ac = new Float32Array(totalArrows * 3);
    for (let i = 0; i < PATHS.length; i++) {
      const hex = posColorMap[PATHS[i].position] || '#ffffff';
      const col = new THREE.Color(hex);
      ac[i * 3] = col.r; ac[i * 3 + 1] = col.g; ac[i * 3 + 2] = col.b;
      for (let j = 0; j < SPHERES_PER_PATH; j++) {
        const idx = (i * SPHERES_PER_PATH + j) * 3;
        sc[idx] = col.r; sc[idx + 1] = col.g; sc[idx + 2] = col.b;
      }
    }
    return { sphereColors: sc, arrowColors: ac };
  }, [posColorMap]);

  useEffect(() => {
    if (sphereRef.current)
      sphereRef.current.instanceColor = new THREE.InstancedBufferAttribute(sphereColors, 3);
    if (arrowRef.current)
      arrowRef.current.instanceColor = new THREE.InstancedBufferAttribute(arrowColors, 3);
  }, [active, sphereColors, arrowColors]);

  const sphereProg = useMemo(() => {
    const pr = new Float32Array(totalSpheres);
    for (let i = 0; i < PATHS.length; i++)
      for (let j = 0; j < SPHERES_PER_PATH; j++)
        pr[i * SPHERES_PER_PATH + j] = j / SPHERES_PER_PATH;
    return pr;
  }, []);

  const arrowProg = useMemo(() => {
    const pr = new Float32Array(totalArrows);
    for (let i = 0; i < totalArrows; i++) pr[i] = 0.15;
    return pr;
  }, []);

  useFrame((_, dt) => {
    if (!active) return;
    if (sphereRef.current) {
      for (let i = 0; i < PATHS.length; i++) {
        const { from, to } = vecs[i];
        for (let j = 0; j < SPHERES_PER_PATH; j++) {
          const idx = i * SPHERES_PER_PATH + j;
          sphereProg[idx] = (sphereProg[idx] + dt * SPEED) % 1;
          const t = sphereProg[idx];
          dummy.position.lerpVectors(from, to, t);
          dummy.scale.setScalar(Math.sin(t * Math.PI) * 0.055);
          dummy.updateMatrix();
          sphereRef.current.setMatrixAt(idx, dummy.matrix);
        }
      }
      sphereRef.current.instanceMatrix.needsUpdate = true;
    }
    if (arrowRef.current) {
      for (let i = 0; i < PATHS.length; i++) {
        const { from, to, dir } = vecs[i];
        arrowProg[i] = (arrowProg[i] + dt * SPEED * 0.8) % 1;
        const t = arrowProg[i];
        dummy.position.lerpVectors(from, to, t);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
        dummy.quaternion.copy(q);
        const fade = Math.sin(t * Math.PI);
        dummy.scale.set(fade * 0.12, fade * 0.12, fade * 0.12);
        dummy.updateMatrix();
        arrowRef.current.setMatrixAt(i, dummy.matrix);
      }
      arrowRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <group>
      <instancedMesh ref={sphereRef} args={[undefined, undefined, totalSpheres]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#ffffff" blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </instancedMesh>
      <instancedMesh ref={arrowRef} args={[coneGeo, undefined, totalArrows]}>
        <meshBasicMaterial color="#ffffff" blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </instancedMesh>
    </group>
  );
}
