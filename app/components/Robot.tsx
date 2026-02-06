"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- CONFIGURAȚIE SCARĂ ---
const S = 10.0;

// --- DEFINIȚII GEOMETRICE (DH Parameters) ---
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
const TCP_LENGTH = DH.d6 + GRIPPER_BASE_LEN + GRIPPER_FINGER_LEN;

// --- SAFE POS (HOME) ---
const SAFE_POS = new THREE.Vector3(
  0,
  (DH.d1 + J1_J2_OFFSET) + DH.a2 + DH.a3 - TCP_LENGTH,
  DH.d4 + DH.a1
);

const SOURCE_XZ = { x: -4, z: 0 };

const lerpAngle = (start: number, end: number, amount: number) => {
  let diff = (end - start) % (2 * Math.PI);
  if (diff < -Math.PI) diff += 2 * Math.PI;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  return start + diff * amount;
};

type AnimationPhase = "IDLE" | "MOVE_TO_SOURCE" | "DESCEND_SOURCE" | "GRAB" | "ASCEND_SOURCE" | "MOVE_TO_TARGET" | "DESCEND_TARGET" | "RELEASE" | "ASCEND_TARGET" | "MOVE_TO_SAFE";

interface RobotProps {
  boxTarget: THREE.Vector3 | null;
  onGrab: () => void;
  onPlace: () => void;
  hasBox: boolean;
  boxSize: [number, number, number];
}

export default function Robot({
  boxTarget, onGrab, onPlace, hasBox, boxSize,
}: RobotProps) {
  // REFS
  const j1Ref = useRef<THREE.Group>(null);
  const j2Ref = useRef<THREE.Group>(null);
  const j3Ref = useRef<THREE.Group>(null);
  const j4Ref = useRef<THREE.Group>(null);
  const j5Ref = useRef<THREE.Group>(null);
  const j6Ref = useRef<THREE.Group>(null);
  const toolRef = useRef<THREE.Group>(null);
  const debugRef = useRef<THREE.AxesHelper>(null);

  // STATE
  const [phase, setPhase] = useState<AnimationPhase>("IDLE");
  const ikTarget = useRef(new THREE.Vector3().copy(SAFE_POS));
  const waypoint = useRef(new THREE.Vector3().copy(SAFE_POS));
  const placeLock = useRef(false);

  const debugAxesObject = useMemo(() => new THREE.AxesHelper(2.0), []);

  const { fingerOffset, baseWidth } = useMemo(() => {
    const fingerThickness = 0.05;
    const clearance = 0.04;
    const offset = (boxSize[0] / 2) + clearance + (fingerThickness / 2);
    const width = (offset * 2) + fingerThickness + 0.1;
    return { fingerOffset: offset, baseWidth: width };
  }, [boxSize]);

  // --- LOGICĂ ANIMATIE ---
  useEffect(() => {
    const t = setTimeout(() => {
      if (boxTarget) setPhase("MOVE_TO_SOURCE");
      else setPhase("MOVE_TO_SAFE");
    }, 10);
    return () => clearTimeout(t);
  }, [boxTarget]);

  useEffect(() => {
    if (phase === "IDLE") return;
    let t: NodeJS.Timeout;
    const next = (ms: number, p: AnimationPhase) => t = setTimeout(() => setPhase(p), ms);

    const HOVER_OFFSET = 3.0;
    const PICK_Y = boxSize[2];
    const PLACE_Y = (boxTarget?.y || 0) + boxSize[2];

    const pickTarget = new THREE.Vector3(SOURCE_XZ.x, PICK_Y, SOURCE_XZ.z);
    const dropTarget = boxTarget ? new THREE.Vector3(boxTarget.x, PLACE_Y, boxTarget.z) : new THREE.Vector3();
    const pickHover = pickTarget.clone().add(new THREE.Vector3(0, HOVER_OFFSET, 0));
    const dropHover = dropTarget.clone().add(new THREE.Vector3(0, HOVER_OFFSET, 0));

    switch (phase) {
      case "MOVE_TO_SAFE": waypoint.current.copy(SAFE_POS); next(2000, "IDLE"); break;
      case "MOVE_TO_SOURCE": placeLock.current = false; waypoint.current.copy(pickHover); next(1500, "DESCEND_SOURCE"); break;
      case "DESCEND_SOURCE": waypoint.current.copy(pickTarget); next(800, "GRAB"); break;
      case "GRAB": onGrab(); next(400, "ASCEND_SOURCE"); break;
      case "ASCEND_SOURCE": waypoint.current.copy(pickHover); next(800, "MOVE_TO_TARGET"); break;
      case "MOVE_TO_TARGET": if (boxTarget) waypoint.current.copy(dropHover); next(1500, "DESCEND_TARGET"); break;
      case "DESCEND_TARGET": if (boxTarget) waypoint.current.copy(dropTarget); next(800, "RELEASE"); break;
      case "RELEASE": if (!placeLock.current) { placeLock.current = true; onPlace(); } next(400, "ASCEND_TARGET"); break;
      case "ASCEND_TARGET": if (boxTarget) waypoint.current.copy(dropHover); next(800, "MOVE_TO_SAFE"); break;
    }
    return () => clearTimeout(t);
  }, [phase, boxTarget, onGrab, onPlace, boxSize]);

  // --- KINEMATICS LOOP ---
  useFrame((state, delta) => {
    if (!j1Ref.current || !j2Ref.current || !j3Ref.current || !j4Ref.current || !j5Ref.current || !j6Ref.current) return;

    // 1. IK Target Interpolation
    ikTarget.current.lerp(waypoint.current, 6.0 * delta);
    const tcpWorld = ikTarget.current.clone();

    // 2. Inverse Kinematics Math
    const wristWorld = tcpWorld.clone().add(new THREE.Vector3(0, TCP_LENGTH, 0));
    const pwx = wristWorld.x;
    const pwy = wristWorld.y;
    const pwz = wristWorld.z;
    const distToTarget = Math.sqrt(pwx * pwx + pwz * pwz);

    const q1_ik = Math.atan2(pwx, pwz);
    const r = Math.max(distToTarget - DH.a1, 0.01);
    const z = pwy - (DH.d1 + J1_J2_OFFSET);

    const L2 = DH.a2;
    const L3_hyp = Math.sqrt(DH.a3 * DH.a3 + DH.d4 * DH.d4);
    const D_sq = r * r + z * z;
    const c_phi = THREE.MathUtils.clamp((D_sq - L2 * L2 - L3_hyp * L3_hyp) / (2 * L2 * L3_hyp), -1, 1);
    const s_phi = Math.sqrt(1 - c_phi * c_phi);
    const phi = Math.atan2(s_phi, c_phi);
    const beta = Math.atan2(z, r);
    const psi = Math.atan2(L3_hyp * s_phi, L2 + L3_hyp * c_phi);
    const q2_math = beta + psi;
    const alpha_offset = Math.atan2(DH.d4, DH.a3);
    const q3_math = phi - alpha_offset;

    const q2_ik = Math.PI / 2 - q2_math;
    const q3_ik = q3_math;

    const isParking = phase === "IDLE" || phase === "MOVE_TO_SAFE";

    // 3. Setare Unghiuri
    const targetJ1 = isParking ? 0 : q1_ik;
    const targetJ2 = isParking ? 0 : q2_ik;
    const targetJ3 = isParking ? 0 : q3_ik;
    const targetJ4 = 0;
    const targetJ5 = isParking ? -Math.PI / 2 : -Math.PI / 2 - (q2_ik + q3_ik);

    // --- LOGICA PENTRU J6 (ORIENTARE CUTIE) ---
    let targetJ6 = 0;
    const isAtDropLocation = ["MOVE_TO_TARGET", "DESCEND_TARGET", "RELEASE", "ASCEND_TARGET"].includes(phase);

    if (isAtDropLocation) {
        // Aliniat cu axa X
        const desiredGlobalOrientation = Math.PI / 2; 
        const correctionOffset = desiredGlobalOrientation - targetJ1;
        targetJ6 = correctionOffset;
    }

    const lerpSpeed = 15 * delta;

    j1Ref.current.rotation.y = lerpAngle(j1Ref.current.rotation.y, targetJ1, lerpSpeed);
    j2Ref.current.rotation.x = lerpAngle(j2Ref.current.rotation.x, targetJ2, lerpSpeed);
    j3Ref.current.rotation.x = lerpAngle(j3Ref.current.rotation.x, targetJ3, lerpSpeed);
    j4Ref.current.rotation.y = lerpAngle(j4Ref.current.rotation.y, targetJ4, lerpSpeed);
    j5Ref.current.rotation.x = lerpAngle(j5Ref.current.rotation.x, targetJ5, lerpSpeed);
    j6Ref.current.rotation.y = lerpAngle(j6Ref.current.rotation.y, targetJ6, lerpSpeed);

    if (debugRef.current) {
      debugRef.current.position.copy(tcpWorld);
      debugRef.current.rotation.set(0, 0, 0);
      debugRef.current.rotateY(j1Ref.current.rotation.y);
      debugRef.current.rotateX(j2Ref.current.rotation.x);
      debugRef.current.rotateX(j3Ref.current.rotation.x);
      debugRef.current.rotateX(Math.PI / 2);
      debugRef.current.rotateY(j4Ref.current.rotation.y);
      debugRef.current.rotateX(j5Ref.current.rotation.x);
      debugRef.current.rotateY(j6Ref.current.rotation.y);
      debugRef.current.rotateX(Math.PI);
    }
  });

  // --- MATERIALE (Fără Portocaliu) ---
  const materials = useMemo(() => {
    const mainColor = "#ecf0f1"; // Alb pur / Gri foarte deschis
    const jointColor = "#7f8c8d"; // Gri Mediu (Beton/Metal mat)
    const chromeColor = "#bdc3c7"; // Argintiu deschis

    return {
      baseMetal: new THREE.MeshStandardMaterial({ 
        color: "#95a5a6", 
        roughness: 0.5, 
        metalness: 0.8 
      }),
      bodyPaint: new THREE.MeshStandardMaterial({ 
        color: mainColor, 
        roughness: 0.3, 
        metalness: 0.2 
      }),
      jointDark: new THREE.MeshStandardMaterial({ 
        color: jointColor, 
        roughness: 0.6, 
        metalness: 0.5 
      }),
      // Materialul "accent" portocaliu a fost eliminat
      chrome: new THREE.MeshStandardMaterial({ 
        color: chromeColor, 
        roughness: 0.2, 
        metalness: 0.9 
      }),
      fingers: new THREE.MeshStandardMaterial({ 
        color: "#546e7a", 
        roughness: 0.8 
      }),
      box: new THREE.MeshStandardMaterial({ 
        color: "#f1c40f", 
        roughness: 0.5 
      }),
    };
  }, []);

  return (
    <group>
      <primitive object={debugAxesObject} ref={debugRef} />

      {/* --- BASE --- */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow material={materials.baseMetal}>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 64]} />
      </mesh>
      
      <mesh position={[0, DH.d1 / 2, 0]} material={materials.bodyPaint} castShadow>
        <cylinderGeometry args={[0.7, 0.9, DH.d1, 32]} />
      </mesh>
      
      {/* Inelul decorativ de la bază a fost eliminat */}

      {/* --- J1 GROUP --- */}
      <group ref={j1Ref} position={[0, DH.d1, 0]}>
        
        {/* Motor J2 Housing */}
        <group position={[0, 0.2, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.jointDark}>
                <cylinderGeometry args={[0.65, 0.65, 0.8, 32]} />
            </mesh>
            {/* Capacele laterale sunt acum gri (jointDark) în loc de portocaliu */}
            <mesh position={[0, 0, 0.4]} rotation={[Math.PI/2, 0, 0]} material={materials.jointDark}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
            </mesh>
            <mesh position={[0, 0, -0.4]} rotation={[Math.PI/2, 0, 0]} material={materials.jointDark}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
            </mesh>
        </group>

        {/* --- J2 GROUP --- */}
        <group ref={j2Ref} position={[0, J1_J2_OFFSET, DH.a1]}>
          
          <group position={[0, DH.a2 / 2, 0]}>
            <mesh material={materials.bodyPaint} castShadow>
                <boxGeometry args={[0.4, DH.a2 - 0.4, 0.3]} />
            </mesh>
            <mesh position={[0, -(DH.a2/2) + 0.2, 0]} rotation={[0,0,Math.PI/2]} material={materials.bodyPaint}>
                <cylinderGeometry args={[0.25, 0.25, 0.38, 16]} />
            </mesh>
            <mesh position={[0, (DH.a2/2) - 0.2, 0]} rotation={[0,0,Math.PI/2]} material={materials.bodyPaint}>
                <cylinderGeometry args={[0.2, 0.2, 0.38, 16]} />
            </mesh>
            {/* Dunga decorativă laterală a fost eliminată */}
          </group>

          {/* --- J3 GROUP --- */}
          <group ref={j3Ref} position={[0, DH.a2, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={materials.jointDark}>
                <cylinderGeometry args={[0.35, 0.35, 0.65, 32]} />
            </mesh>

            <group position={[0, DH.a3 / 2, 0]}>
               <mesh material={materials.bodyPaint} castShadow>
                   <cylinderGeometry args={[0.2, 0.25, DH.a3, 16]} />
               </mesh>
            </group>

            <group position={[0, DH.a3, 0]} rotation={[Math.PI / 2, 0, 0]}>
              
              {/* --- J4 GROUP --- */}
              <group ref={j4Ref}>
                <mesh rotation={[0, 0, 0]} material={materials.jointDark}>
                  <cylinderGeometry args={[0.28, 0.28, 0.15, 32]} />
                </mesh>
                
                <mesh position={[0, DH.d4 / 2, 0]} material={materials.bodyPaint}>
                  <cylinderGeometry args={[0.2, 0.22, DH.d4 - 0.1, 32]} />
                </mesh>

                {/* --- J5 GROUP --- */}
                <group ref={j5Ref} position={[0, DH.d4, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]} material={materials.jointDark}>
                    <cylinderGeometry args={[0.18, 0.18, 0.42, 32]} />
                  </mesh>
                  
                  <mesh position={[0, -DH.d6 / 2, 0]} material={materials.bodyPaint}>
                     <boxGeometry args={[0.25, DH.d6, 0.25]} />
                  </mesh>

                  {/* --- J6 GROUP --- */}
                  <group ref={j6Ref} position={[0, -DH.d6, 0]}>
                    {/* Flanșa este acum gri (jointDark) în loc de portocaliu */}
                    <mesh position={[0, 0, 0]} material={materials.jointDark}>
                      <cylinderGeometry args={[0.14, 0.14, 0.04, 32]} />
                    </mesh>

                    {/* --- GRIPPER --- */}
                    <group ref={toolRef} position={[0, -0.02, 0]}>
                      <mesh position={[0, -GRIPPER_BASE_LEN / 2, 0]} material={materials.baseMetal}>
                        <boxGeometry args={[baseWidth, GRIPPER_BASE_LEN, 0.15]} />
                      </mesh>

                       <mesh position={[0, -GRIPPER_BASE_LEN/2, 0]} rotation={[0,0,Math.PI/2]} material={materials.chrome}>
                           <cylinderGeometry args={[0.02, 0.02, baseWidth-0.1, 8]} />
                       </mesh>

                      <group position={[0, -GRIPPER_BASE_LEN, 0]}>
                        <mesh position={[-fingerOffset, -GRIPPER_FINGER_LEN / 2, 0]} material={materials.fingers}>
                          <boxGeometry args={[0.04, GRIPPER_FINGER_LEN, 0.08]} />
                        </mesh>
                        <mesh position={[fingerOffset, -GRIPPER_FINGER_LEN / 2, 0]} material={materials.fingers}>
                           <boxGeometry args={[0.04, GRIPPER_FINGER_LEN, 0.08]} />
                        </mesh>

                        {hasBox && (
                          <mesh position={[0, -GRIPPER_FINGER_LEN, 0]} material={materials.box}>
                            <boxGeometry args={[boxSize[0] * 0.98, boxSize[2] * 0.98, boxSize[1] * 0.98]} />
                          </mesh>
                        )}
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