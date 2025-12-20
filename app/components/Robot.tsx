"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const R_PARAMS = {
  baseH: 1.2,
  arm1: 3.5,
  arm2: 3.0
};

const SOURCE_POS = new THREE.Vector3(-4, 1, 0);

// 1. Definim poziția de "Safe" / "Home" (ex: sus și central)
// Aceasta este poziția în care robotul se retrage când termină treaba.

const SAFE_POS = new THREE.Vector3(0, 5, 0); 

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

// 2. Adăugăm 'MOVE_TO_SAFE' în lista de faze
type AnimationPhase =
  | 'IDLE'
  | 'MOVE_TO_SOURCE'
  | 'DESCEND_SOURCE'
  | 'GRAB'
  | 'ASCEND_SOURCE'
  | 'MOVE_TO_TARGET'
  | 'DESCEND_TARGET'
  | 'RELEASE'
  | 'ASCEND_TARGET'
  | 'MOVE_TO_SAFE'; 

interface RobotProps {
  boxTarget: THREE.Vector3 | null;
  onGrab: () => void;
  onPlace: () => void;
  hasBox: boolean;
  boxSize: [number, number, number];
}

export default function Robot({
  boxTarget,
  onGrab,
  onPlace,
  hasBox,
  boxSize
}: RobotProps) {
  const baseRef = useRef<THREE.Group>(null);
  const arm1Ref = useRef<THREE.Group>(null);
  const arm2Ref = useRef<THREE.Group>(null);

  const [phase, setPhase] = useState<AnimationPhase>('IDLE');

  // Poziția inițială a robotului este tot SAFE_POS
  const ikTarget = useRef(new THREE.Vector3(SAFE_POS.x, SAFE_POS.y, SAFE_POS.z));
  const waypoint = useRef(new THREE.Vector3(SAFE_POS.x, SAFE_POS.y, SAFE_POS.z));

  // 🔒 LOCK — previne plasări multiple
  const placeLock = useRef(false);

  /* ================= TRIGGER ================= */
  useEffect(() => {
    let t: NodeJS.Timeout;

    if (boxTarget) {
      // Dacă avem o țintă, începem ciclul de lucru
      t = setTimeout(() => setPhase('MOVE_TO_SOURCE'), 10);
    } else {
      // 3. Dacă NU mai avem țintă (s-a terminat lista sau e stop), mergem în SAFE
      t = setTimeout(() => setPhase('MOVE_TO_SAFE'), 10);
    }

    return () => clearTimeout(t);
  }, [boxTarget]);

  /* ================= SEQUENCER ================= */
  useEffect(() => {
    if (phase === 'IDLE') return;

    let timeout: NodeJS.Timeout;
    const next = (ms: number, p: AnimationPhase) => {
      timeout = setTimeout(() => setPhase(p), ms);
    };

    const HOVER_H = 4.0;

    switch (phase) {
      // --- FAZA NOUĂ: RETRAGERE ---
      case 'MOVE_TO_SAFE':
        waypoint.current.set(SAFE_POS.x, SAFE_POS.y, SAFE_POS.z);
        // După ce ajunge în Safe, intră în starea IDLE (așteptare)
        next(1000, 'IDLE'); 
        break;

      case 'MOVE_TO_SOURCE':
        placeLock.current = false; // 🔓 reset ciclu
        waypoint.current.set(
          SOURCE_POS.x,
          SOURCE_POS.y + HOVER_H,
          SOURCE_POS.z
        );
        next(800, 'DESCEND_SOURCE');
        break;

      case 'DESCEND_SOURCE':
        waypoint.current.set(
          SOURCE_POS.x,
          SOURCE_POS.y + 0.5,
          SOURCE_POS.z
        );
        next(500, 'GRAB');
        break;

      case 'GRAB':
        onGrab();
        next(200, 'ASCEND_SOURCE');
        break;

      case 'ASCEND_SOURCE':
        waypoint.current.set(
          SOURCE_POS.x,
          SOURCE_POS.y + HOVER_H,
          SOURCE_POS.z
        );
        next(500, 'MOVE_TO_TARGET');
        break;

      case 'MOVE_TO_TARGET':
        if (boxTarget) {
          waypoint.current.set(
            boxTarget.x,
            boxTarget.y + HOVER_H,
            boxTarget.z
          );
        }
        next(800, 'DESCEND_TARGET');
        break;

      case 'DESCEND_TARGET':
        if (boxTarget) {
          waypoint.current.set(
            boxTarget.x,
            boxTarget.y + 0.5,
            boxTarget.z
          );
        }
        next(500, 'RELEASE');
        break;

      case 'RELEASE':
        if (!placeLock.current) {
          placeLock.current = true; // 🔒 lock
          onPlace();
        }
        next(200, 'ASCEND_TARGET');
        break;

      case 'ASCEND_TARGET':
        if (boxTarget) {
          waypoint.current.set(
            boxTarget.x,
            boxTarget.y + HOVER_H,
            boxTarget.z
          );
        }
        // Aici nu setăm IDLE. 
        // Lăsăm primul useEffect să detecteze dacă boxTarget s-a schimbat (următoarea cutie)
        // sau dacă a devenit null (sfârșit de listă -> trigger MOVE_TO_SAFE).
        // Punem un mic delay ca să aibă timp parent-ul să actualizeze prop-ul.
        // Însă, pentru siguranță, putem rămâne pe poziția curentă până se schimbă prop-ul.
        break;
    }

    return () => clearTimeout(timeout);
  }, [phase, boxTarget, onGrab, onPlace]);

  /* ================= IK LOOP ================= */
  useFrame((_, delta) => {
    if (!baseRef.current || !arm1Ref.current || !arm2Ref.current) return;

    // Interpolare lină către waypoint
    ikTarget.current.lerp(waypoint.current, 5 * delta);

    const x = ikTarget.current.x;
    const y = ikTarget.current.y;
    const z = ikTarget.current.z;

    const thetaBase = Math.atan2(x, z);

    const horizontalDist = Math.sqrt(x * x + z * z);
    const dy = y - R_PARAMS.baseH;
    const dx = horizontalDist;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const a = R_PARAMS.arm1;
    const b = R_PARAMS.arm2;
    const c = clamp(dist, 0.1, a + b - 0.01);

    const angleToTarget = Math.atan2(dy, dx);
    const alpha = Math.acos(clamp((a * a + c * c - b * b) / (2 * a * c), -1, 1));
    const beta = Math.acos(clamp((a * a + b * b - c * c) / (2 * a * b), -1, 1));

    baseRef.current.rotation.y = thetaBase;
    arm1Ref.current.rotation.x = Math.PI / 2 - (angleToTarget + alpha);
    arm2Ref.current.rotation.x = Math.PI - beta;
  });

  /* ================= MESH ================= */
  return (
    <group>
      <mesh position={[0, R_PARAMS.baseH / 2, 0]}>
        <cylinderGeometry args={[0.8, 1.0, R_PARAMS.baseH, 32]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.2} />
      </mesh>

      <group ref={baseRef} position={[0, R_PARAMS.baseH, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.2, 0.4, 1.2]} />
          <meshStandardMaterial color="#ffbd2e" />
        </mesh>

        <group ref={arm1Ref} position={[0, 0.4, 0]}>
          <mesh position={[0, R_PARAMS.arm1 / 2, 0]}>
            <boxGeometry args={[0.5, R_PARAMS.arm1, 0.5]} />
            <meshStandardMaterial color="#ffbd2e" />
          </mesh>

          <group ref={arm2Ref} position={[0, R_PARAMS.arm1, 0]}>
            <mesh position={[0, R_PARAMS.arm2 / 2, 0]}>
              <boxGeometry args={[0.4, R_PARAMS.arm2, 0.4]} />
              <meshStandardMaterial color="#ffbd2e" />
            </mesh>

            <group position={[0, R_PARAMS.arm2, 0]}>
              <mesh>
                <boxGeometry args={[0.6, 0.2, 0.3]} />
                <meshStandardMaterial color="#333" />
              </mesh>

              {hasBox && (
                <mesh position={[0, 0.2 + boxSize[2] / 2, 0]}>
                  <boxGeometry
                    args={[
                      boxSize[0] * 0.95,
                      boxSize[2] * 0.95,
                      boxSize[1] * 0.95
                    ]}
                  />
                  <meshStandardMaterial color="#ffea00" />
                </mesh>
              )}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}