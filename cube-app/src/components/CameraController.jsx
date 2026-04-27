import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Western View: Camera on negative X axis, looking East toward origin
const RITUAL_POS = new THREE.Vector3(-10, 1.5, 0);
const RITUAL_TARGET = new THREE.Vector3(0, 0, 0);

export default function CameraController({ resetTrigger }) {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const isAnimating = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  // Get OrbitControls from the drei "makeDefault" store
  const controls = useThree((s) => s.controls);

  useEffect(() => {
    if (resetTrigger > 0 && controls) {
      targetPos.current.copy(RITUAL_POS);
      targetLookAt.current.copy(RITUAL_TARGET);
      isAnimating.current = true;
    }
  }, [resetTrigger, controls]);

  useFrame(() => {
    if (!isAnimating.current || !controls) return;

    // Lerp camera position toward ritual view
    camera.position.lerp(targetPos.current, 0.04);
    controls.target.lerp(targetLookAt.current, 0.04);
    controls.update();

    // Stop when close enough
    if (camera.position.distanceTo(targetPos.current) < 0.05) {
      camera.position.copy(targetPos.current);
      controls.target.copy(targetLookAt.current);
      controls.update();
      isAnimating.current = false;
    }
  });

  return null;
}
