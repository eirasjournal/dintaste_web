"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- CONFIGURAȚIE SCARĂ ---
const S = 10.0;

// --- PARAMETRI GEOMETRICI (Pentru desenare) ---
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

// Calculăm distanța de la centrul J6 (flanșă) până la vârful degetelor (TCP)
// -0.02 este offset-ul de prindere definit în JSX
const TCP_OFFSET = 0.02 + GRIPPER_BASE_LEN + GRIPPER_FINGER_LEN;

// Funcție pentru interpolare fină (smooth movement)
const lerpAngle = (start: number, end: number, amount: number) => {
  let diff = (end - start) % (2 * Math.PI);
  if (diff < -Math.PI) diff += 2 * Math.PI;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  return start + diff * amount;
};

interface RobotProps {
  // Primim direct unghiurile (în grade) de la părinte
  angles: {
    j1: number;
    j2: number;
    j3: number;
    j4: number;
    j5: number;
    j6: number;
  };
}

export default function RobotDKinematics({ angles }: RobotProps) {
  // REFS PENTRU ARTICULAȚII
  const j1Ref = useRef<THREE.Group>(null);
  const j2Ref = useRef<THREE.Group>(null);
  const j3Ref = useRef<THREE.Group>(null);
  const j4Ref = useRef<THREE.Group>(null);
  const j5Ref = useRef<THREE.Group>(null);
  const j6Ref = useRef<THREE.Group>(null);
  
  // Ref pentru sistemul de coordonate debug de la vârf
  const debugRef = useRef<THREE.AxesHelper>(null);
  const debugAxesObject = useMemo(() => new THREE.AxesHelper(3.0), []);

  // --- LOOP DE RANDARE (Aplicăm rotațiile) ---
  useFrame((state, delta) => {
    if (!j1Ref.current || !j2Ref.current || !j3Ref.current || !j4Ref.current || !j5Ref.current || !j6Ref.current) return;

    // 1. Conversie Grade -> Radiani
    const rad = (deg: number) => THREE.MathUtils.degToRad(deg);

    // 2. Interpolare pentru mișcare fluidă
    const lerpSpeed = 10 * delta;

    j1Ref.current.rotation.y = lerpAngle(j1Ref.current.rotation.y, rad(angles.j1), lerpSpeed);
    j2Ref.current.rotation.x = lerpAngle(j2Ref.current.rotation.x, rad(angles.j2), lerpSpeed);
    j3Ref.current.rotation.x = lerpAngle(j3Ref.current.rotation.x, rad(angles.j3), lerpSpeed);
    j4Ref.current.rotation.y = lerpAngle(j4Ref.current.rotation.y, rad(angles.j4), lerpSpeed);
    j5Ref.current.rotation.x = lerpAngle(j5Ref.current.rotation.x, rad(angles.j5), lerpSpeed);
    j6Ref.current.rotation.y = lerpAngle(j6Ref.current.rotation.y, rad(angles.j6), lerpSpeed);

    // 3. Actualizare Debug Axes la TCP (Vârful robotului)
    if (debugRef.current) {
        // Forțăm actualizarea matricelor pentru a avea poziția corectă după rotațiile de mai sus
        j6Ref.current.updateWorldMatrix(true, false);

        // A. Calculăm Poziția TCP
        // Definim vectorul TCP în spațiul local al lui J6. 
        // Deoarece robotul e construit pe -Y în jos, TCP-ul este la (0, -TCP_OFFSET, 0)
        const tcpLocalPos = new THREE.Vector3(0, -TCP_OFFSET, 0);
        
        // Transformăm coordonata locală în coordonată globală (World)
        const tcpWorldPos = tcpLocalPos.applyMatrix4(j6Ref.current.matrixWorld);
        debugRef.current.position.copy(tcpWorldPos);

        // B. Calculăm Rotația
        // Luăm rotația lumii a lui J6
        const worldQuat = new THREE.Quaternion();
        j6Ref.current.getWorldQuaternion(worldQuat);

        // AxesHelper are Y (Verde) în sus implicit. Robotul are "fața" în jos (-Y).
        // Rotim AxesHelper cu 180 grade (PI) pe axa X pentru a inversa Y-ul (Verdele să fie jos)
        const rotationFix = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
        worldQuat.multiply(rotationFix);

        debugRef.current.quaternion.copy(worldQuat);
    }
  });

  // --- MATERIALE ---
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
      {/* Axele de coordonate mutate la TCP */}
      <primitive object={debugAxesObject} ref={debugRef} />

      {/* --- BASE --- */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow material={materials.baseMetal}>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 64]} />
      </mesh>
      
      <mesh position={[0, DH.d1 / 2, 0]} material={materials.bodyPaint} castShadow>
        <cylinderGeometry args={[0.7, 0.9, DH.d1, 32]} />
      </mesh>

      {/* --- J1 GROUP (Rotate Y) --- */}
      <group ref={j1Ref} position={[0, DH.d1, 0]}>
        
        {/* Motor J2 Housing */}
        <group position={[0, 0.2, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.jointDark}>
                <cylinderGeometry args={[0.65, 0.65, 0.8, 32]} />
            </mesh>
            <mesh position={[0, 0, 0.4]} rotation={[Math.PI/2, 0, 0]} material={materials.jointDark}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
            </mesh>
            <mesh position={[0, 0, -0.4]} rotation={[Math.PI/2, 0, 0]} material={materials.jointDark}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
            </mesh>
        </group>

        {/* --- J2 GROUP (Rotate X) --- */}
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
          </group>

          {/* --- J3 GROUP (Rotate X) --- */}
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
              
              {/* --- J4 GROUP (Rotate Y - Roll) --- */}
              <group ref={j4Ref}>
                <mesh rotation={[0, 0, 0]} material={materials.jointDark}>
                  <cylinderGeometry args={[0.28, 0.28, 0.15, 32]} />
                </mesh>
                
                <mesh position={[0, DH.d4 / 2, 0]} material={materials.bodyPaint}>
                  <cylinderGeometry args={[0.2, 0.22, DH.d4 - 0.1, 32]} />
                </mesh>

                {/* --- J5 GROUP (Rotate X - Pitch) --- */}
                <group ref={j5Ref} position={[0, DH.d4, 0]}>
                  <mesh rotation={[0, 0, Math.PI / 2]} material={materials.jointDark}>
                    <cylinderGeometry args={[0.18, 0.18, 0.42, 32]} />
                  </mesh>
                  
                  <mesh position={[0, -DH.d6 / 2, 0]} material={materials.bodyPaint}>
                      <boxGeometry args={[0.25, DH.d6, 0.25]} />
                  </mesh>

                  {/* --- J6 GROUP (Rotate Y - Roll/Flange) --- */}
                  <group ref={j6Ref} position={[0, -DH.d6, 0]}>
                    <mesh position={[0, 0, 0]} material={materials.jointDark}>
                      <cylinderGeometry args={[0.14, 0.14, 0.04, 32]} />
                    </mesh>

                    {/* --- GRIPPER --- */}
                    <group position={[0, -0.02, 0]}>
                      <mesh position={[0, -GRIPPER_BASE_LEN / 2, 0]} material={materials.baseMetal}>
                        <boxGeometry args={[0.4, GRIPPER_BASE_LEN, 0.15]} />
                      </mesh>

                      <group position={[0, -GRIPPER_BASE_LEN, 0]}>
                        <mesh position={[-0.15, -GRIPPER_FINGER_LEN / 2, 0]} material={materials.fingers}>
                          <boxGeometry args={[0.04, GRIPPER_FINGER_LEN, 0.08]} />
                        </mesh>
                        <mesh position={[0.15, -GRIPPER_FINGER_LEN / 2, 0]} material={materials.fingers}>
                           <boxGeometry args={[0.04, GRIPPER_FINGER_LEN, 0.08]} />
                        </mesh>
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