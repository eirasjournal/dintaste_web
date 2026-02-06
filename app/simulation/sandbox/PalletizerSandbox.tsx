"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Plane } from '@react-three/drei';
import * as math from 'mathjs';
import * as THREE from 'three';
import Robot from '../../components/Robot'; // Asigură-te că Robot.tsx e importat corect

// Componenta locală Box
const Box = ({ position, size, color }: { position: [number, number, number], size: [number, number, number], color?: string }) => {
  return (
    <group position={position}>
        <mesh>
            <boxGeometry args={[size[0] * 0.95, size[2] * 0.95, size[1] * 0.95]} />
            <meshStandardMaterial color={color || "#cca033"} roughness={0.6} metalness={0.1} />
        </mesh>
        <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(size[0]*0.95, size[2]*0.95, size[1]*0.95)]} />
            <lineBasicMaterial color="#3e2e00" linewidth={1} />
        </lineSegments>
    </group>
  );
};

interface PlacedBoxData {
    id: string;
    position: [number, number, number];
}

export default function PalletizerSandbox() {
    // --- STATE ROBOT & LOGICĂ ---
    const [params, setParams] = useState({
        dx: 1.0, dy: 1.0, h: 0.6, 
        c: 3, r: 3, n: 2, total: 18 
    });
  
    const [formulas, setFormulas] = useState({
        x: 'dx * (i % c)',
        y: 'dy * (floor(i / c) % r)',
        z: 'h * floor(i / (c * r))'
    });
  
    const [placedBoxes, setPlacedBoxes] = useState<PlacedBoxData[]>([]); 
    const [currentBoxIndex, setCurrentBoxIndex] = useState(0); 
    const [robotHasBox, setRobotHasBox] = useState(false); 
    const [isSimulating, setIsSimulating] = useState(false); 

    const handleReset = useCallback(() => {
        setIsSimulating(false);
        setPlacedBoxes([]); 
        setCurrentBoxIndex(0);
        setRobotHasBox(false);
    }, []);

    const generatedBoxes = useMemo(() => {
        try {
            const newBoxes = [];
            const { dx, dy, h, c, r, n, total } = params;
            for (let i = 0; i < total; i++) {
                const scope = { i, dx, dy, h, c, r, n, floor: Math.floor };
                const xVal = math.evaluate(formulas.x, scope);
                const yVal = math.evaluate(formulas.y, scope);
                const zVal = math.evaluate(formulas.z, scope);

                const finalX = xVal + 2.0;       
                const finalZ = yVal - 1.5;       
                const finalY = zVal + h / 2;     

                if(!isNaN(finalX)) newBoxes.push([finalX, finalY, finalZ]);
            }
            return newBoxes;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            return [];
        }
    }, [params, formulas]);

    useEffect(() => {
        const t = setTimeout(() => handleReset(), 100);
        return () => clearTimeout(t);
    }, [params, formulas, handleReset]);

    const handleGrab = () => setRobotHasBox(true);

    const handlePlace = () => {
        setRobotHasBox(false);
        const boxPosition = generatedBoxes[currentBoxIndex] as [number, number, number];
        if (boxPosition) {
            const newBox: PlacedBoxData = {
                id: `box-${currentBoxIndex}-${Date.now()}`,
                position: boxPosition
            };
            setPlacedBoxes(prev => [...prev, newBox]);
        }
        if (currentBoxIndex < generatedBoxes.length - 1) {
            setCurrentBoxIndex(prev => prev + 1);
        } else {
            setIsSimulating(false);
        }
    };

    const currentTargetVector = useMemo(() => {
        if (!isSimulating || currentBoxIndex >= generatedBoxes.length) return null;
        const coords = generatedBoxes[currentBoxIndex];
        return new THREE.Vector3(coords[0], coords[1], coords[2]);
    }, [isSimulating, currentBoxIndex, generatedBoxes]);

    const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams({ ...params, [e.target.name]: parseFloat(e.target.value) || 0 });
    };
    const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormulas({ ...formulas, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col gap-6 relative animate-fade-in">
             <p style={{lineHeight: '1.8', fontSize: '1.15rem', color: '#dcdcdc', letterSpacing: '0.02em', marginBottom: '2%', textIndent: '40px' }}> 
                This interactive sandbox bridges the gap between math and motion. By defining custom formulas, you directly control the robot&apos;s palletizing logic, visualizing how algorithmic patterns translate into precise spatial coordinates in real-time.
            </p>

            {/* --- INPUTS PANEL --- */}
            <div className="tech-panel">
                <div className="inputs-layout">
                    {/* CONFIGURATION */}
                    <div className="inputs-column">
                        <h3 className="section-title">Configuration</h3>
                        <div className="config-grid">
                            <div className="control-group">
                                <label>DX (Width)</label>
                                <input name="dx" type="number" step="0.1" value={params.dx} onChange={handleParamChange} className="tech-input" />
                            </div>
                            <div className="control-group">
                                <label>DY (Depth)</label>
                                <input name="dy" type="number" step="0.1" value={params.dy} onChange={handleParamChange} className="tech-input" />
                            </div>
                            <div className="control-group">
                                <label>H (Height)</label>
                                <input name="h" type="number" step="0.1" value={params.h} onChange={handleParamChange} className="tech-input" />
                            </div>
                            <div className="control-group">
                                <label style={{color: '#cca033'}}>TOTAL ITEMS</label>
                                <input name="total" type="number" value={params.total} onChange={handleParamChange} className="tech-input" style={{borderColor: '#cca033'}} />
                            </div>
                            <div className="control-group">
                                <label>COLUMNS (C)</label>
                                <input name="c" type="number" value={params.c} onChange={handleParamChange} className="tech-input" />
                            </div>
                            <div className="control-group">
                                <label>ROWS (R)</label>
                                <input name="r" type="number" value={params.r} onChange={handleParamChange} className="tech-input" />
                            </div>
                        </div>
                    </div>

                    {/* FORMULAS */}
                    <div className="inputs-column">
                        <h3 className="section-title">Coordinate Logic</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div className="control-group">
                                <label style={{color: '#4ade80'}}>X AXIS FORMULA</label>
                                <input name="x" value={formulas.x} onChange={handleFormulaChange} type="text" className="tech-input formula" />
                            </div>
                            <div className="control-group">
                                <label style={{color: '#4ade80'}}>Y AXIS FORMULA</label>
                                <input name="y" value={formulas.y} onChange={handleFormulaChange} type="text" className="tech-input formula" />
                            </div>
                            <div className="control-group">
                                <label style={{color: '#4ade80'}}>Z AXIS FORMULA</label>
                                <input name="z" value={formulas.z} onChange={handleFormulaChange} type="text" className="tech-input formula" />
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-auto pt-4">
                                <div className="flex justify-between text-[#555] mb-2 text-xs font-mono uppercase tracking-widest">
                                    <span>Batch Status</span>
                                    <span>{placedBoxes.length}/{params.total}</span>
                                </div>
                                <div className="w-full bg-[#000] h-3 rounded-sm border border-[#333] relative">
                                    <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(90deg, transparent 95%, #222 95%)', backgroundSize: '10% 100%'}}></div>
                                    <div 
                                        className="h-full transition-all duration-300 relative" 
                                        style={{ 
                                            width: `${(placedBoxes.length / params.total) * 100}%`,
                                            backgroundColor: '#99c2ff',
                                            boxShadow: '0 0 10px rgba(153, 194, 255, 0.4)'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3D CANVAS & BUTTONS --- */}
            <div className="w-full flex flex-col gap-3">
                <div className="buttons-container">
                    <button 
                        onClick={() => setIsSimulating(!isSimulating)}
                        className={`cyber-btn flex-1 ${isSimulating ? 'pause' : 'start'}`}
                    >
                        <span className="btn-icon">{isSimulating ? "❚❚" : "▶"}</span>
                        {isSimulating ? "HALT SYSTEM" : "START SYSTEM"}
                    </button>
                    <button 
                        onClick={handleReset}
                        className="cyber-btn reset px-8" 
                    >
                        <span className="btn-icon">↺</span>
                        RESET
                    </button>
                </div>

                <div className="h-[500px] border border-[#444] bg-[#151515] rounded relative overflow-hidden shadow-2xl">
                    <div className="robot-stage">
                    <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
                        <color attach="background" args={['#151515']} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[5, 10, 5]} intensity={1} castShadow />
                        <spotLight position={[-5, 15, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />

                        <OrbitControls makeDefault target={[0, 2, 0]} />
                        <Grid infiniteGrid fadeDistance={40} sectionColor={'#444'} cellColor={'#222'} position={[0, -0.01, 0]} />
                        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}><meshBasicMaterial color="#0a0a0a" /></Plane>

                        <Robot 
                            boxTarget={currentTargetVector} 
                            onGrab={handleGrab} 
                            onPlace={handlePlace}
                            hasBox={robotHasBox}
                            boxSize={[params.dx, params.dy, params.h]}
                        />
                        
                        <group position={[-4, 0, 0]}>
                            <mesh position={[0, 0.05, 0]}><boxGeometry args={[1.5, 0.1, 1.5]} /><meshStandardMaterial color="#444" /></mesh>
                            {isSimulating && !robotHasBox && currentBoxIndex < generatedBoxes.length && (
                                <Box 
                                    position={[0, params.h / 2, 0]} 
                                    size={[params.dx, params.dy, params.h]} 
                                    color="#886622" 
                                />
                            )}
                        </group>

                        {placedBoxes.map((boxData) => {
                            return <Box key={boxData.id} position={boxData.position} size={[params.dx, params.dy, params.h]} />;
                        })}
                    </Canvas>
                    </div>
                    <div className="absolute bottom-2 left-2 text-[8px] text-gray-600 font-mono pointer-events-none">
                        RENDER: THREE.JS FIBER
                    </div>
                </div>
            </div>
            
            <div className="sticky-note yellow mt-4 transform rotate-1 w-full max-w-md mx-auto">
                📝 <strong>Operator Manual:</strong><br/>
                <ul style={{listStyleType: 'circle', paddingLeft: '20px', marginTop: '5px'}}>
                    <li><strong>Left Click + Drag:</strong> Rotate Camera 🔄</li>
                    <li><strong>Right Click + Drag:</strong> Pan View ↔️</li>
                    <li><strong>Scroll:</strong> Zoom In/Out 🔍</li>
                </ul>
                <span style={{fontSize: '0.8em', color: '#555'}}>(Double click to reset view)</span>
            </div>
        </div>
    );
};