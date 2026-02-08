"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- CONFIGURAȚIE SCARĂ ---
const S = 10.0;

// --- PARAMETRI GEOMETRICI ---
const DH = {
  d1: 0.335 * S,
  a1: 0.075 * S,
  a2: 0.270 * S,
  a3: 0.150 * S,
  d4: 0.295 * S,
  d6: 0.080 * S,
};

const J1_J2_OFFSET = 0.2;
const GRIPPER_BASE_LEN = 0.05 * S;
const GRIPPER_FINGER_LEN = 0.08 * S;
const TCP_OFFSET = 0.02 + GRIPPER_BASE_LEN + GRIPPER_FINGER_LEN;

const lerpAngle = (start: number, end: number, amount: number) => {
  let diff = (end - start) % (2 * Math.PI);
  if (diff < -Math.PI) diff += 2 * Math.PI;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  return start + diff * amount;
};

interface RobotProps {
  angles: {
    j1: number; j2: number; j3: number; j4: number; j5: number; j6: number;
  };
}

export default function RobotDKinematics({ angles }: RobotProps) {
  const j1Ref = useRef<THREE.Group>(null);
  const j2Ref = useRef<THREE.Group>(null);
  const j3Ref = useRef<THREE.Group>(null);
  const j4Ref = useRef<THREE.Group>(null);
  const j5Ref = useRef<THREE.Group>(null);
  const j6Ref = useRef<THREE.Group>(null);
  
  const debugRef = useRef<THREE.AxesHelper>(null);
  const debugAxesObject = useMemo(() => new THREE.AxesHelper(3.0), []);

  useFrame((state, delta) => {
    if (!j1Ref.current || !j2Ref.current || !j3Ref.current || !j4Ref.current || !j5Ref.current || !j6Ref.current) return;

    const rad = (deg: number) => THREE.MathUtils.degToRad(deg);
    const lerpSpeed = 10 * delta;

    // J1: Normal
    j1Ref.current.rotation.y = lerpAngle(j1Ref.current.rotation.y, rad(angles.j1), lerpSpeed);
    
    // --- MODIFICARE J2 ---
    // User Input: -90. Mesh Target: 0 (Vertical).
    // Calcul: -90 + 90 = 0.
    j2Ref.current.rotation.x = lerpAngle(j2Ref.current.rotation.x, rad(angles.j2 + 90), lerpSpeed);
    
    // J3: Normal
    j3Ref.current.rotation.x = lerpAngle(j3Ref.current.rotation.x, rad(angles.j3), lerpSpeed);
    
    // J4: Normal
    j4Ref.current.rotation.y = lerpAngle(j4Ref.current.rotation.y, rad(angles.j4), lerpSpeed);

    // --- MODIFICARE J5 ---
    // User Input: 90. Mesh Target: -90 (În jos, așa cum era înainte).
    // Calcul: 90 - 180 = -90.
    j5Ref.current.rotation.x = lerpAngle(j5Ref.current.rotation.x, rad(angles.j5 - 180), lerpSpeed);

    // J6: Normal
    j6Ref.current.rotation.y = lerpAngle(j6Ref.current.rotation.y, rad(angles.j6), lerpSpeed);

    // UPDATE DEBUG AXES
    if (debugRef.current) {
        j6Ref.current.updateWorldMatrix(true, false);
        const tcpLocalPos = new THREE.Vector3(0, -TCP_OFFSET, 0);
        const tcpWorldPos = tcpLocalPos.applyMatrix4(j6Ref.current.matrixWorld);
        debugRef.current.position.copy(tcpWorldPos);

        const worldQuat = new THREE.Quaternion();
        j6Ref.current.getWorldQuaternion(worldQuat);
        const rotationFix = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
        worldQuat.multiply(rotationFix);
        debugRef.current.quaternion.copy(worldQuat);
    }
  });

  const materials = useMemo(() => {
    return {
      baseMetal: new THREE.MeshStandardMaterial({ color: "#95a5a6", roughness: 0.5, metalness: 0.8 }),
      bodyPaint: new THREE.MeshStandardMaterial({ color: "#ecf0f1", roughness: 0.3, metalness: 0.2 }),
      jointDark: new THREE.MeshStandardMaterial({ color: "#7f8c8d", roughness: 0.6, metalness: 0.5 }),
      chrome: new THREE.MeshStandardMaterial({ color: "#bdc3c7", roughness: 0.2, metalness: 0.9 }),
      fingers: new THREE.MeshStandardMaterial({ color: "#546e7a", roughness: 0.8 }),
    };
  }, []);

  return (
    <group>
      <primitive object={debugAxesObject} ref={debugRef} />
      {/* ... (RESTUL GEOMETRIEI RĂMÂNE NESCHIMBAT) ... */}
      
      {/* Doar un placeholder rapid pentru structură, conținutul e identic cu ce aveai */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow material={materials.baseMetal}>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 64]} />
      </mesh>
      <mesh position={[0, DH.d1 / 2, 0]} material={materials.bodyPaint} castShadow>
        <cylinderGeometry args={[0.7, 0.9, DH.d1, 32]} />
      </mesh>

      <group ref={j1Ref} position={[0, DH.d1, 0]}>
        <group position={[0, 0.2, 0]}>
             <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.jointDark}>
                <cylinderGeometry args={[0.65, 0.65, 0.8, 32]} />
            </mesh>
            <mesh position={[0, 0, 0.4]} rotation={[Math.PI/2, 0, 0]} material={materials.jointDark}><cylinderGeometry args={[0.3, 0.3, 0.1, 32]} /></mesh>
            <mesh position={[0, 0, -0.4]} rotation={[Math.PI/2, 0, 0]} material={materials.jointDark}><cylinderGeometry args={[0.3, 0.3, 0.1, 32]} /></mesh>
        </group>
        <group ref={j2Ref} position={[0, J1_J2_OFFSET, DH.a1]}>
          <group position={[0, DH.a2 / 2, 0]}>
             <mesh material={materials.bodyPaint} castShadow><boxGeometry args={[0.4, DH.a2 - 0.4, 0.3]} /></mesh>
             <mesh position={[0, -(DH.a2/2) + 0.2, 0]} rotation={[0,0,Math.PI/2]} material={materials.bodyPaint}><cylinderGeometry args={[0.25, 0.25, 0.38, 16]} /></mesh>
             <mesh position={[0, (DH.a2/2) - 0.2, 0]} rotation={[0,0,Math.PI/2]} material={materials.bodyPaint}><cylinderGeometry args={[0.2, 0.2, 0.38, 16]} /></mesh>
          </group>
          <group ref={j3Ref} position={[0, DH.a2, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.jointDark}><cylinderGeometry args={[0.35, 0.35, 0.65, 32]} /></mesh>
            <group position={[0, DH.a3 / 2, 0]}><mesh material={materials.bodyPaint} castShadow><cylinderGeometry args={[0.2, 0.25, DH.a3, 16]} /></mesh></group>
            <group position={[0, DH.a3, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <group ref={j4Ref}>
                <mesh rotation={[0, 0, 0]} material={materials.jointDark}><cylinderGeometry args={[0.28, 0.28, 0.15, 32]} /></mesh>
                <mesh position={[0, DH.d4 / 2, 0]} material={materials.bodyPaint}><cylinderGeometry args={[0.2, 0.22, DH.d4 - 0.1, 32]} /></mesh>
                <group ref={j5Ref} position={[0, DH.d4, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]} material={materials.jointDark}><cylinderGeometry args={[0.18, 0.18, 0.42, 32]} /></mesh>
                  <mesh position={[0, -DH.d6 / 2, 0]} material={materials.bodyPaint}><boxGeometry args={[0.25, DH.d6, 0.25]} /></mesh>
                  <group ref={j6Ref} position={[0, -DH.d6, 0]}>
                    <mesh position={[0, 0, 0]} material={materials.jointDark}><cylinderGeometry args={[0.14, 0.14, 0.04, 32]} /></mesh>
                    <group position={[0, -0.02, 0]}>
                      <mesh position={[0, -GRIPPER_BASE_LEN / 2, 0]} material={materials.baseMetal}><boxGeometry args={[0.4, GRIPPER_BASE_LEN, 0.15]} /></mesh>
                      <group position={[0, -GRIPPER_BASE_LEN, 0]}>
                        <mesh position={[-0.15, -GRIPPER_FINGER_LEN / 2, 0]} material={materials.fingers}><boxGeometry args={[0.04, GRIPPER_FINGER_LEN, 0.08]} /></mesh>
                        <mesh position={[0.15, -GRIPPER_FINGER_LEN / 2, 0]} material={materials.fingers}><boxGeometry args={[0.04, GRIPPER_FINGER_LEN, 0.08]} /></mesh>
                      </group>
                    </group> 
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}