"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- CONFIGURAȚIE SCARĂ ---
const S = 10.0;

// --- DEFINIȚII GEOMETRICE ---
const DH = {
  d1: 0.335 * S,
  a1: 0.075 * S,
  a2: 0.270 * S,
  a3: 0.150 * S,
  d4: 0.295 * S,
  d6: 0.080 * S,
};

// Offset vizual fix între J1 și J2 (definit în JSX ca 0.2)
const J1_J2_OFFSET = 0.2; 

// --- DIMENSIUNI GRIPPER ---
const GRIPPER_BASE_LEN = 0.05 * S;
const GRIPPER_FINGER_LEN = 0.08 * S;
const TCP_LENGTH = DH.d6 + GRIPPER_BASE_LEN + GRIPPER_FINGER_LEN;

// --- SAFE POS (HOME) ---
// Configurație "Stâlp" cu gripper-ul în jos:
// X: Offset bază (a1)
// Y: Înălțime Umăr + Braț + Antebraț - Lungime Tool (atârnă în jos)
// Z: Extensie în față (d4)
const SAFE_POS = new THREE.Vector3(
  DH.a1,                     
  (DH.d1 + J1_J2_OFFSET) + DH.a2 + DH.a3 - TCP_LENGTH,     
  DH.d4        
);

const SOURCE_XZ = { x: -4, z: 0 };

const lerpAngle = (start: number, end: number, amount: number) => {
  let diff = (end - start) % (2 * Math.PI);
  if (diff < -Math.PI) diff += 2 * Math.PI;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  return start + diff * amount;
};

type AnimationPhase =
  | "IDLE" | "MOVE_TO_SOURCE" | "DESCEND_SOURCE" | "GRAB"
  | "ASCEND_SOURCE" | "MOVE_TO_TARGET" | "DESCEND_TARGET"
  | "RELEASE" | "ASCEND_TARGET" | "MOVE_TO_SAFE";

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
  const j1Ref = useRef<THREE.Group>(null);
  const j2Ref = useRef<THREE.Group>(null);
  const j3Ref = useRef<THREE.Group>(null);
  const j5Ref = useRef<THREE.Group>(null);
  const meshDebugRef = useRef<THREE.Mesh | null>(null);

  const [phase, setPhase] = useState<AnimationPhase>("IDLE");
  const toolRef = useRef<THREE.Group>(null);

  const ikTarget = useRef(new THREE.Vector3().copy(SAFE_POS));
  const waypoint = useRef(new THREE.Vector3().copy(SAFE_POS));
  const placeLock = useRef(false);

  // --- SEQUENCER ---
  useEffect(() => {
    const t = setTimeout(() => {
      if (boxTarget) setPhase("MOVE_TO_SOURCE");
      else setPhase("MOVE_TO_SAFE");
    }, 0);
    return () => clearTimeout(t);
  }, [boxTarget]);

 useEffect(() => {
    if (phase === "IDLE") return;
    let t: NodeJS.Timeout;
    const next = (ms: number, p: AnimationPhase) => t = setTimeout(() => setPhase(p), ms);

    // 1. CONFIGURARE ÎNĂLȚIMI
    const HOVER_OFFSET = 3.0;
    // PICK_Y este exact înălțimea cutiei, deci vârful degetelor va atinge capacul cutiei
    const PICK_Y = boxSize[2]; 
    // PLACE_Y calculează unde va fi capacul cutiei la destinație
    const PLACE_Y = (boxTarget?.y || 0) + boxSize[2]; 

    // 2. DEFINIREA ȚINTELOR (EXACT PE CENTRU)
    // Sursa este hardcodată, deci trebuie să ne asigurăm că si cutia vizuală e tot acolo.
    // Dacă SOURCE_XZ e centrul zonei de pick-up:
    const pickTarget = new THREE.Vector3(SOURCE_XZ.x, PICK_Y, SOURCE_XZ.z);
    
    // Pentru drop, folosim direct coordonatele calculate în părinte
    const dropTarget = boxTarget 
        ? new THREE.Vector3(boxTarget.x, PLACE_Y, boxTarget.z) 
        : new THREE.Vector3();

    // Hover target-uri (același X/Z, dar mai sus)
    const pickHover = pickTarget.clone().add(new THREE.Vector3(0, HOVER_OFFSET, 0));
    const dropHover = dropTarget.clone().add(new THREE.Vector3(0, HOVER_OFFSET, 0));

    switch (phase) {
      case "MOVE_TO_SAFE": 
        waypoint.current.copy(SAFE_POS); 
        next(2000, "IDLE"); 
        break;

      case "MOVE_TO_SOURCE":
        placeLock.current = false;
        waypoint.current.copy(pickHover); // Mergem deasupra
        next(1500, "DESCEND_SOURCE"); 
        break;

      case "DESCEND_SOURCE": 
        waypoint.current.copy(pickTarget); // Coborâm pe centru
        next(800, "GRAB"); 
        break;

      case "GRAB": 
        onGrab(); 
        next(400, "ASCEND_SOURCE"); 
        break;

      case "ASCEND_SOURCE": 
        waypoint.current.copy(pickHover); // Urcăm înapoi
        next(800, "MOVE_TO_TARGET"); 
        break;

      case "MOVE_TO_TARGET":
        if (boxTarget) waypoint.current.copy(dropHover);
        next(1500, "DESCEND_TARGET"); 
        break;

      case "DESCEND_TARGET":
        if (boxTarget) waypoint.current.copy(dropTarget);
        next(800, "RELEASE"); 
        break;

      case "RELEASE": 
        if (!placeLock.current) { placeLock.current = true; onPlace(); } 
        next(400, "ASCEND_TARGET"); 
        break;

      case "ASCEND_TARGET":
        if (boxTarget) waypoint.current.copy(dropHover);
        next(800, "MOVE_TO_SAFE"); 
        break;

      default: break;
    }
    return () => clearTimeout(t);
  }, [phase, boxTarget, onGrab, onPlace, boxSize]);

  // --- KINEMATICS LOOP ---
  useFrame((state, delta) => {
    if (!j1Ref.current || !j2Ref.current || !j3Ref.current || !j5Ref.current) return;

    ikTarget.current.lerp(waypoint.current, 6.0 * delta);
    const tcpWorld = ikTarget.current.clone();

    // 1. Calculăm poziția Wrist (J5)
    // Presupunem că gripper-ul este PERFECT vertical pentru calculul brațului.
    const wristWorld = tcpWorld.clone().add(new THREE.Vector3(0, TCP_LENGTH, 0));

    const pwx = wristWorld.x;
    const pwy = wristWorld.y;
    const pwz = wristWorld.z;

    // 1. Calculăm distanța plană până la țintă
    const distToTargetSq = pwx * pwx + pwz * pwz;
    const distToTarget = Math.sqrt(distToTargetSq);

    // 2. PROTECȚIE: Dacă ținta e prea aproape (înăuntrul umărului), o limităm
    // Acest lucru previne radicalul negativ.
    const safeDist = Math.max(distToTarget, DH.a1 + 0.001); 

    // 3. Calcul unghi bază
    const baseAngle = Math.atan2(pwx, pwz);

    // 4. Calcul Offset Umăr (Corecția triunghiulară)
    // Folosim safeDist în loc de distToTarget pentru a fi siguri că asin primește <= 1
    const offsetCorrection = Math.asin(Math.min(1.0, DH.a1 / safeDist));

    // 5. Aplicăm corecția
    // NOTĂ: Dacă robotul se rotește pe partea greșită, schimbă '-' în '+'
    const q1_ik = baseAngle - offsetCorrection;

    // 6. Calculăm raza brațului (r) cu protecție
    // Folosim safeDist, deci paranteza nu poate fi negativă
    const r = Math.sqrt(safeDist * safeDist - DH.a1 * DH.a1);

    const z = pwy - (DH.d1 + J1_J2_OFFSET);

    const L2 = DH.a2;
    const L3_hyp = Math.sqrt(DH.a3 * DH.a3 + DH.d4 * DH.d4);

    // Calcul IK pentru braț (teorema cosinusului)
    const D_sq = r * r + z * z;
    let c_phi = (D_sq - L2 * L2 - L3_hyp * L3_hyp) / (2 * L2 * L3_hyp);
    c_phi = THREE.MathUtils.clamp(c_phi, -1, 1);
    
    const s_phi = Math.sqrt(1 - c_phi * c_phi);
    const phi = Math.atan2(s_phi, c_phi);

    const beta = Math.atan2(z, r);
    const psi = Math.atan2(L3_hyp * s_phi, L2 + L3_hyp * c_phi);

    const q2_math = beta + psi;

    const alpha_offset = Math.atan2(DH.d4, DH.a3);
    const q3_math = phi - alpha_offset;

    // --- CONVERSIE LA ROBOT ---
    const q2_ik = Math.PI / 2 - q2_math;
    const q3_ik = q3_math;

    const isParking = phase === "IDLE" || phase === "MOVE_TO_SAFE";
    let targetJ1, targetJ2, targetJ3, targetJ5;

    if (isParking) {
      targetJ1 = 0; 
      targetJ2 = 0; 
      targetJ3 = 0; 
      targetJ5 = -Math.PI / 2;
    } else {
      targetJ1 = q1_ik; 
      targetJ2 = q2_ik;
      targetJ3 = q3_ik;
      
      // Menținem gripper-ul vertical folosind unghiurile matematice (fără lag)
      targetJ5 = -Math.PI/2 - (q2_ik + q3_ik);
    }

    // Apply Rotations
    const lerpSpeed = 15 * delta;
    j1Ref.current.rotation.y = lerpAngle(j1Ref.current.rotation.y, targetJ1, lerpSpeed);
    j2Ref.current.rotation.x = lerpAngle(j2Ref.current.rotation.x, targetJ2, lerpSpeed);
    j3Ref.current.rotation.x = lerpAngle(j3Ref.current.rotation.x, targetJ3, lerpSpeed);
    j5Ref.current.rotation.x = lerpAngle(j5Ref.current.rotation.x, targetJ5, lerpSpeed);

    // Contra-rotație pentru a ține cutia aliniată cu pereții camerei (fixul de la pasul anterior)
    if (toolRef.current) {
        toolRef.current.rotation.y = -j1Ref.current.rotation.y;
    }

    if (meshDebugRef.current) meshDebugRef.current.position.copy(tcpWorld);
  });

  // Materiale
  const matBase = new THREE.MeshStandardMaterial({ color: "#222" });
  const matLink = new THREE.MeshStandardMaterial({ color: "#ffab00" });
  const matGray = new THREE.MeshStandardMaterial({ color: "#777" });
  const matJoint = new THREE.MeshStandardMaterial({ color: "#555" });
  const matGripper = new THREE.MeshStandardMaterial({ color: "#888" });
  const matFingers = new THREE.MeshStandardMaterial({ color: "#333" });

  return (
    <group>
      <mesh ref={meshDebugRef}><sphereGeometry args={[0.1, 5, 5]} /><meshBasicMaterial color="red" wireframe /></mesh>

      {/* BASE */}
      <mesh position={[0, DH.d1 / 2, 0]}>
        <cylinderGeometry args={[0.7, 0.9, DH.d1, 32]} />
        <primitive object={matBase} />
      </mesh>

      {/* J1 */}
      <group ref={j1Ref} position={[0, DH.d1, 0]}>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.7, 0.7, 0.2, 32]} /><primitive object={matJoint} /></mesh>
        
        {/* Link 1: Offset vizual */}
        <group position={[DH.a1 / 2, J1_J2_OFFSET, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, DH.a1, 16]} /><primitive object={matJoint} /></mesh>
        </group>

        {/* J2 (Umăr) */}
        <group ref={j2Ref} position={[DH.a1, J1_J2_OFFSET, 0]}>
          <mesh position={[0, DH.a2 / 2, 0]}><boxGeometry args={[0.4, DH.a2, 0.4]} /><primitive object={matLink} /></mesh>

          {/* J3 (Cot) */}
          <group ref={j3Ref} position={[0, DH.a2, 0]}>
             <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 0.6, 16]} /><primitive object={matJoint} /></mesh>

            {/* a3 (Vertical) */}
            <mesh position={[0, DH.a3 / 2, 0]}>
               <boxGeometry args={[0.35, DH.a3, 0.35]} />
               <primitive object={matLink} />
            </mesh>

            {/* --- LINK d4 (Gri) --- */}
            <group position={[0, DH.a3, 0]}>
               <group rotation={[Math.PI / 2, 0, 0]}> 
                  <mesh position={[0, DH.d4 / 2, 0]}>
                    <boxGeometry args={[0.3, DH.d4, 0.3]} />
                    <primitive object={matGray} />
                  </mesh>

                  {/* J5 (Wrist) */}
                  <group ref={j5Ref} position={[0, DH.d4, 0]}>
                    <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.12, 0.12, 0.3, 16]} /><primitive object={matJoint} /></mesh>
                    
                    {/* Tool */}
                    <group ref={toolRef}>
                        {/* CALCUL DINAMIC PENTRU LĂȚIME */}
                        {(() => {
                            // Cât de groase sunt degetele
                            const fingerThickness = 0.05; 
                            // Spațiu de siguranță ca să nu intre degetele în cutie (marjă)
                            const clearance = 0.04; 
                            
                            // Calculăm poziția: Jumătate din cutie + marjă + jumătate din grosimea degetului
                            const fingerOffset = (boxSize[0] / 2) + clearance + (fingerThickness / 2);
                            
                            // Calculăm cât de lată trebuie să fie bara care ține degetele
                            const baseWidth = (fingerOffset * 2) + fingerThickness + 0.1;

                            return (
                                <group rotation={[0, 0, 0]}>
                                    {/* Tija verticală principală a tool-ului */}
                                    <mesh position={[0, -DH.d6 / 2, 0]}>
                                        <cylinderGeometry args={[0.08, 0.08, DH.d6, 16]} />
                                        <primitive object={matGripper} />
                                    </mesh>

                                    <group position={[0, -DH.d6, 0]}>
                                        {/* BAZA ORIZONTALĂ (Acum se lățește dinamic) */}
                                        <mesh position={[0, -GRIPPER_BASE_LEN / 2, 0]}>
                                            {/* Aici folosim baseWidth calculat mai sus */}
                                            <boxGeometry args={[baseWidth, GRIPPER_BASE_LEN, 0.15]} />
                                            <primitive object={matJoint} />
                                        </mesh>

                                        <group position={[0, -GRIPPER_BASE_LEN, 0]}>
                                            {/* DEGET STÂNGA (Calculat dinamic) */}
                                            <mesh position={[-fingerOffset, -GRIPPER_FINGER_LEN / 2, 0]}>
                                                <boxGeometry args={[fingerThickness, GRIPPER_FINGER_LEN, 0.1]} />
                                                <primitive object={matFingers} />
                                            </mesh>

                                            {/* DEGET DREAPTA (Calculat dinamic) */}
                                            <mesh position={[fingerOffset, -GRIPPER_FINGER_LEN / 2, 0]}>
                                                <boxGeometry args={[fingerThickness, GRIPPER_FINGER_LEN, 0.1]} />
                                                <primitive object={matFingers} />
                                            </mesh>

                                            {/* CUTIA PRINSĂ (Vizibilă doar când hasBox e true) */}
                                            {hasBox && (
                                                <mesh position={[0, -GRIPPER_FINGER_LEN, 0]}>
                                                    <boxGeometry args={[boxSize[0] * 0.98, boxSize[2] * 0.98, boxSize[1] * 0.98]} />
                                                    <meshStandardMaterial color="#ffea00" />
                                                </mesh>
                                            )}
                                        </group>
                                    </group>
                                </group>
                            );
                        })()}
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