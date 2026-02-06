"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Plane, PerspectiveCamera } from '@react-three/drei';
import RobotDKinematics from '../../components/RobotDKinematics';

// --- CONFIGURARE LIMITE AXE ---
const JOINT_LIMITS: Record<string, { min: number; max: number }> = {
    j1: { min: -170, max: 170 },
    j2: { min: -190, max: 45 },
    j3: { min: -29,  max: 256 },
    j4: { min: -190, max: 190 },
    j5: { min: -120, max: 120 },
    j6: { min: -360, max: 360 },
};

export default function DirectKinematicsSandbox() {
    // --- STATE PENTRU UNGHIURI ---
    const HOME_POSITION = { j1: 0, j2: 0, j3: 0, j4: 0, j5: -90, j6: 0 };
    
    const [joints, setJoints] = useState(HOME_POSITION);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const limits = JOINT_LIMITS[name];
        
        let newValue = parseFloat(value);

        // Dacă inputul este gol sau nu e număr (ex: userul șterge tot), setăm pe 0 temporar sau lăsăm gol
        if (isNaN(newValue)) {
             // Putem alege să nu actualizăm dacă e NaN, sau să setăm 0. 
             // Aici alegem 0 pentru siguranță, dar UX-ul ideal ar permite string gol.
             newValue = 0; 
        } else {
            // --- STRICT CLAMPING ---
            // Nu permitem valori în afara range-ului definit
            if (newValue < limits.min) newValue = limits.min;
            if (newValue > limits.max) newValue = limits.max;
        }

        setJoints({ ...joints, [name]: newValue });
    };

    const handleReset = () => {
        setJoints(HOME_POSITION);
    };

    return (
        <div className="flex flex-col gap-6 relative animate-fade-in">
            
            {/* Header Secțiune */}
            <div className="mb-6 border-b border-[#333] pb-4">
                <p className="text-sm text-gray-500 font-mono mt-1">
                    RENDER: THREE.JS FIBER
                </p>
            </div>

            {/* --- LAYOUT PRINCIPAL: 2 COLOANE --- */}
            <div className="dk-grid">
                
                {/* --- STÂNGA: CONTROLS PANEL --- */}
                <div className="tech-panel bg-[#111] border border-[#333] rounded-xl shadow-2xl flex flex-col">
                    
                    {/* --- BUTONUL DE RESET --- */}
                    <div className="buttons-container">
                        <button 
                            onClick={handleReset}
                            className="cyber-btn reset w-full flex justify-center items-center" 
                        >
                            <span className="btn-icon text-xl mr-2">↺</span>
                            RESET SYSTEM
                        </button>
                    </div>

                    <div className="border-b border-[#333]"></div>

                    {/* Generăm controalele vertical */}
                    {Object.keys(joints).map((joint) => {
                        const limits = JOINT_LIMITS[joint];
                        
                        return (
                            <div key={joint} className="bg-[#1a1a1a] rounded border border-[#333]">
                                <div className="input-wrapper flex justify-between items-end">
                                    <div>
                                        <label className="text-xs font-bold text-[#cca033] font-mono uppercase block">
                                            AXIS {joint.toUpperCase()} [{limits.min}° : {limits.max}°]
                                        </label>
                                    </div>
                                    
                                    <input 
                                        type="number"
                                        name={joint}
                                        value={joints[joint as keyof typeof joints]}
                                        onChange={handleChange}
                                        min={limits.min}
                                        max={limits.max}
                                        className="full-width-input w-20 text-right" 
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
                                    className="w-full accent-[#cca033] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* --- DREAPTA: 3D CANVAS --- */}
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

                        <RobotDKinematics angles={joints} />
                    </Canvas>

                    <div className="absolute top-4 right-4 text-right pointer-events-none">
                        <div className="text-[#cca033] text-xs font-mono font-bold border border-[#cca033] px-2 py-1 rounded bg-black/50 backdrop-blur-sm inline-block shadow-[0_0_10px_rgba(204,160,51,0.3)]">
                            LIVE PREVIEW
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-[10px] text-gray-600 font-mono pointer-events-none select-none">
                          [MOUSE] ORBIT / PAN / ZOOM <br/>
                          [GRID] 1 UNIT = 10 CM
                    </div>
                </div>

            </div>
        </div>
    );
}