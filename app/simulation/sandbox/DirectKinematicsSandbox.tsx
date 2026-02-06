"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Plane, PerspectiveCamera } from '@react-three/drei';
import RobotDKinematics from '../../components/RobotDKinematics';

export default function DirectKinematicsSandbox() {
    // --- STATE PENTRU UNGHIURI ---
    // Definim poziția "Home" (naturală) separat pentru a putea reveni la ea
    const HOME_POSITION = { j1: 0, j2: 0, j3: 0, j4: 0, j5: -90, j6: 0 };
    
    const [joints, setJoints] = useState(HOME_POSITION);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJoints({ ...joints, [e.target.name]: parseFloat(e.target.value) || 0 });
    };

    // Funcția de Reset care folosește stilul cerut
    const handleReset = () => {
        setJoints(HOME_POSITION);
    };

    return (
        <div className="fade-in w-full">
            
            {/* Header Secțiune */}
            <div className="mb-6 border-b border-[#333] pb-4">
                <h3 className="text-[#cca033] font-bold text-3xl tracking-wider font-mono">
                    DIRECT KINEMATICS
                </h3>
                <p className="text-sm text-gray-500 font-mono mt-1">
                    RENDER: THREE.JS FIBER
                </p>
            </div>

            {/* --- LAYOUT PRINCIPAL: 2 COLOANE --- */}
            <div className="dk-grid">
                
                {/* --- STÂNGA: CONTROLS PANEL --- */}
                <div className="tech-panel bg-[#111] border border-[#333] rounded-xl shadow-2xl p-4 flex flex-col gap-4">
                    
                    {/* --- BUTONUL DE RESET (Stil Cyber-Industrial) --- */}
                    <div className="buttons-container mb-2">
                        <button 
                            onClick={handleReset}
                            className="cyber-btn reset w-full flex justify-center items-center" 
                        >
                            <span className="btn-icon text-xl mr-2">↺</span>
                            RESET SYSTEM
                        </button>
                    </div>

                    <div className="border-b border-[#333] mb-2"></div>

                    {/* Generăm controalele vertical */}
                    {Object.keys(joints).map((joint) => (
                        <div key={joint} className="bg-[#1a1a1a] p-3 rounded border border-[#333]">
                            {/* Folosim noul wrapper pentru structură verticală */}
                            <div className="input-wrapper">
                                <label className="text-xs font-bold text-[#cca033] font-mono uppercase">
                                    AXIS {joint.toUpperCase()}
                                </label>
                                
                                <input 
                                    type="number"
                                    name={joint}
                                    value={joints[joint as keyof typeof joints]}
                                    onChange={handleChange}
                                    /* Am înlocuit w-14 cu clasa noastră CSS */
                                    className="full-width-input" 
                                />
                            </div>
                            
                            {/* Slider-ul rămâne dedesubt, este deja configurat cu w-full */}
                            <input
                                type="range" 
                                name={joint} 
                                min="-180" 
                                max="180" 
                                step="1" 
                                value={joints[joint as keyof typeof joints]} 
                                onChange={handleChange} 
                                className="w-full accent-[#cca033] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
                            />
                        </div>
                    ))}
                </div>

                {/* --- DREAPTA: 3D CANVAS --- */}
                <div className="robot-stage relative shadow-2xl border border-[#444] rounded bg-[#151515] overflow-hidden">
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={60} />
                        <color attach="background" args={['#151515']} />
                        
                        {/* Lighting */}
                        <ambientLight intensity={0.4} />
                        <pointLight position={[10, 20, 10]} intensity={1.5} castShadow />
                        <spotLight position={[-10, 15, -5]} angle={0.5} intensity={1} />

                        {/* Environment */}
                        <OrbitControls makeDefault target={[0, 4, 0]} minDistance={5} maxDistance={30} />
                        <Grid infiniteGrid fadeDistance={100} sectionColor={'#444'} cellColor={'#222'} position={[0, -0.01, 0]} />
                        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
                            <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.5} />
                        </Plane>

                        {/* The Robot */}
                        <RobotDKinematics angles={joints} />
                    </Canvas>

                    {/* Overlay UI pe Canvas */}
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
};