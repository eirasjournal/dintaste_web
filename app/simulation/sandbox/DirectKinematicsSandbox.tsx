"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Plane, PerspectiveCamera } from '@react-three/drei';
import RobotDKinematics from '../../components/RobotDKinematics';

// --- CONFIGURARE LIMITE AXE (Limitele Fizice ale Motoarelor) ---
const JOINT_LIMITS: Record<string, { min: number; max: number }> = {
    j1: { min: -170, max: 170 },
    j2: { min: -190, max: 45 },  // Motorul poate merge pana la 45
    j3: { min: -160, max: 70 },
    j4: { min: -190, max: 190 },
    j5: { min: -120, max: 120 },
    j6: { min: -360, max: 360 },
};

export default function DirectKinematicsSandbox() {
    // --- STATE PENTRU UNGHIURI ---
    const HOME_POSITION = { j1: 0, j2: -90, j3: 0, j4: 0, j5: 90, j6: 0 };
    
    const [joints, setJoints] = useState(HOME_POSITION);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const limits = JOINT_LIMITS[name];
        
        let newValue = parseFloat(value);

        if (isNaN(newValue)) {
             newValue = 0; 
        } else {
            // Clamp value within physical limits
            if (newValue < limits.min) newValue = limits.min;
            if (newValue > limits.max) newValue = limits.max;
        }

        setJoints({ ...joints, [name]: newValue });
    };

    const handleReset = () => {
        setJoints(HOME_POSITION);
    };

    // --- LOGICA DE PROTECȚIE PODEA ---
    // Calculăm o variantă "sigură" a unghiurilor doar pentru vizualizare.
    // Slider-ul rămâne la valoarea reală setată de user (ex: 45), 
    // dar robotul primește maxim 5 grade (aproape orizontal).
    const visualJoints = {
        ...joints,
        // Math.min alege valoarea cea mai mică dintre inputul tău și limita sigură (5 grade)
        j2: Math.min(joints.j2, 5) 
    };

    return (
        <div className="flex flex-col gap-6 relative animate-fade-in">
            <div className="mb-6 border-b border-[#333] pb-4">
                <p className="text-sm text-gray-500 font-mono mt-1">
                    RENDER: THREE.JS FIBER
                </p>
            </div>

            <div className="dk-grid">
                {/* --- STÂNGA: CONTROLS PANEL --- */}
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
                        
                        // Calculăm dacă valoarea curentă depășește limita vizuală (doar pentru styling)
                        const isHitFloor = joint === 'j2' && joints.j2 > 5;

                        return (
                            <div key={joint} className={`bg-[#1a1a1a] rounded border transition-colors duration-300 ${isHitFloor ? 'border-red-500' : 'border-[#333]'}`}>
                                <div className="input-wrapper flex justify-between items-end">
                                    <div>
                                        <label className={`text-xs font-bold font-mono uppercase block ${isHitFloor ? 'text-red-500' : 'text-[#cca033]'}`}>
                                            AXIS {joint.toUpperCase()} [{limits.min}° : {limits.max}°]
                                            {isHitFloor && <span className="ml-2 text-[9px] animate-pulse">⚠ FLOOR LIMIT</span>}
                                        </label>
                                    </div>
                                    <input 
                                        type="number"
                                        name={joint}
                                        value={joints[joint as keyof typeof joints]}
                                        onChange={handleChange}
                                        min={limits.min}
                                        max={limits.max}
                                        className={`full-width-input w-20 text-right ${isHitFloor ? 'text-red-500' : ''}`} 
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
                                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-colors ${isHitFloor ? 'accent-red-500 bg-red-900' : 'accent-[#cca033] bg-gray-700 hover:bg-gray-600'}`}
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
                        
                        {/* MODIFICARE MAJORĂ:
                            Trimitem `visualJoints` în loc de `joints`.
                            Canvas-ul randează varianta "safe", dar UI-ul păstrează inputul tău.
                        */}
                        <RobotDKinematics angles={visualJoints} />
                        
                    </Canvas>
                </div>
            </div>
        </div>
    );
}