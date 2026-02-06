"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Plane, PerspectiveCamera } from '@react-three/drei';
import RobotDKinematics from '../../components/RobotDKinematics';

// --- CONFIGURARE LIMITE AXE ---
const JOINT_LIMITS: Record<string, { min: number; max: number }> = {
    j1: { min: -170, max: 170 },
    j2: { min: -190, max: 45 },
    j3: { min: -160, max: 70 },
    j4: { min: -190, max: 190 },
    j5: { min: -120, max: 120 },
    j6: { min: -360, max: 360 },
};

export default function DirectKinematicsSandbox() {
    const HOME_POSITION = { j1: 0, j2: -90, j3: 0, j4: 0, j5: 90, j6: 0 };
    const [joints, setJoints] = useState(HOME_POSITION);

    // --- CONFIGURARE SAFETY ---
    const FRONT_FLOOR_LIMIT = 5;    // J2 nu coboară sub orizontala din față
    
    // Suma limită (J2 + J3). Dacă suma e mai mică de atât (mai negativă), atingem podeaua în spate.
    // Testat: -116 + (-144) = -260 (Valid). Deci limita e pe la -275.
    const BACK_FLOOR_SUM_LIMIT = -275; 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const limits = JOINT_LIMITS[name];
        let newValue = parseFloat(value);

        if (isNaN(newValue)) newValue = 0;
        else {
            if (newValue < limits.min) newValue = limits.min;
            if (newValue > limits.max) newValue = limits.max;
        }

        setJoints({ ...joints, [name]: newValue });
    };

    const handleReset = () => {
        setJoints(HOME_POSITION);
    };

    // --- LOGICA DE CALCUL VIZUAL (SAFETY) ---
    const visualJoints = { ...joints };
    let safetyMessage = "";
    let isSafetyHit = false;

    // 1. FRONT LIMIT (Simplu: J2 > 5)
    if (visualJoints.j2 > FRONT_FLOOR_LIMIT) {
        visualJoints.j2 = FRONT_FLOOR_LIMIT;
        isSafetyHit = true;
        safetyMessage = "⚠ FRONT COLLISION";
    }

    // 2. BACK LIMIT (Dinamic: Suma Unghiurilor)
    // Verificăm dacă robotul e pe spate (J2 < -90)
    if (joints.j2 < -90) {
        const currentSum = joints.j2 + joints.j3;
        
        // Dacă suma lor e prea mică (prea negativă), înseamnă coliziune
        if (currentSum < BACK_FLOOR_SUM_LIMIT) {
            // Recalculăm J3 vizual ca să respecte limita: J3 = Limita - J2
            visualJoints.j3 = BACK_FLOOR_SUM_LIMIT - joints.j2;
            
            // Verificăm să nu depășim totuși limitele fizice ale motorului J3 în timp ce corectăm
            if (visualJoints.j3 < JOINT_LIMITS.j3.min) visualJoints.j3 = JOINT_LIMITS.j3.min;

            // Activăm doar dacă diferența e vizibilă (pentru a evita flicker la limita exactă)
            if (Math.abs(visualJoints.j3 - joints.j3) > 0.1) {
                isSafetyHit = true;
                safetyMessage = "⚠ BACK COLLISION";
            }
        }
    }

    return (
        <div className="flex flex-col gap-6 relative animate-fade-in">
            <div className="mb-6 border-b border-[#333] pb-4">
                <p className="text-sm text-gray-500 font-mono mt-1">
                    RENDER: THREE.JS FIBER
                </p>
            </div>

            <div className="dk-grid">
                <div className="tech-panel bg-[#111] border border-[#333] rounded-xl shadow-2xl flex flex-col">
                    <div className="buttons-container">
                        <button 
                            onClick={handleReset}
                            className="cyber-btn reset w-full flex justify-center items-center" 
                        >
                            <span className="btn-icon text-xl mr-2">↺</span>
                            RESET TO HOME
                        </button>
                    </div>

                    <div className="border-b border-[#333]"></div>

                    {Object.keys(joints).map((joint) => {
                        const limits = JOINT_LIMITS[joint];
                        
                        // Detectăm care slider trebuie să fie roșu
                        let showWarning = false;
                        
                        // J2 e roșu dacă lovește în față SAU contribuie la lovirea în spate
                        if (joint === 'j2' && (joints.j2 > FRONT_FLOOR_LIMIT || (isSafetyHit && safetyMessage.includes("BACK")))) {
                            showWarning = true;
                        }
                        // J3 e roșu doar la lovirea în spate
                        if (joint === 'j3' && isSafetyHit && safetyMessage.includes("BACK")) {
                            showWarning = true;
                        }

                        return (
                            <div key={joint} className={`bg-[#1a1a1a] rounded border transition-colors duration-300 ${showWarning ? 'border-red-500' : 'border-[#333]'}`}>
                                <div className="input-wrapper flex justify-between items-end">
                                    <div>
                                        <label className={`text-xs font-bold font-mono uppercase block ${showWarning ? 'text-red-500' : 'text-[#cca033]'}`}>
                                            AXIS {joint.toUpperCase()} [{limits.min}° : {limits.max}°]
                                            {showWarning && <span className="ml-2 text-[9px] animate-pulse">{safetyMessage}</span>}
                                        </label>
                                    </div>
                                    <input 
                                        type="number"
                                        name={joint}
                                        value={joints[joint as keyof typeof joints]}
                                        onChange={handleChange}
                                        min={limits.min}
                                        max={limits.max}
                                        className={`full-width-input w-20 text-right ${showWarning ? 'text-red-500' : ''}`} 
                                    />
                                </div>
                                <input
                                    type="range" 
                                    name={joint} 
                                    min={limits.min} 
                                    max={limits.max} 
                                    step="1" 
                                    value={joints[joint as keyof typeof joints]} 
                                    onChange={handleChange} 
                                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-colors ${showWarning ? 'accent-red-500 bg-red-900' : 'accent-[#cca033] bg-gray-700 hover:bg-gray-600'}`}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="robot-stage relative shadow-2xl border border-[#444] rounded bg-[#151515] overflow-hidden">
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={60} />
                        <color attach="background" args={['#151515']} />
                        <ambientLight intensity={0.4} />
                        <pointLight position={[10, 20, 10]} intensity={1.5} castShadow />
                        <spotLight position={[-10, 15, -5]} angle={0.5} intensity={1} />
                        <OrbitControls makeDefault target={[0, 4, 0]} minDistance={5} maxDistance={30} />
                        <Grid infiniteGrid fadeDistance={100} sectionColor={'#444'} cellColor={'#222'} position={[0, -0.01, 0]} />
                        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
                            <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.5} />
                        </Plane>
                        <RobotDKinematics angles={visualJoints} />
                    </Canvas>
                </div>
            </div>
        </div>
    );
}