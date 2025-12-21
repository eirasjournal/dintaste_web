"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import SparkleManager from '../components/SparkleManager'; 
import PageTurn from '../components/PageTurn'; 

// --- IMPORTS PENTRU ROBOT ---
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Plane } from '@react-three/drei';
import * as math from 'mathjs';
import * as THREE from 'three';
import Robot from '../components/Robot'; 

// Componenta locală Box pentru vizualizare
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

// Definim tipul pentru o cutie plasată
interface PlacedBoxData {
    id: string;
    position: [number, number, number];
}

export default function Home() {
  // --- STATE LAYOUT ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const decorCount = 4; 

  // --- STATE ROBOT & LOGICĂ ---
  const [params, setParams] = useState({
    dx: 1.0, dy: 1.0, h: 0.6, 
    c: 3, r: 3, n: 2, total: 18 // c = coloane, r = rânduri
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

  // --- LOGICĂ ROBOT ---
  
  // 1. Reset Handler
  const handleReset = useCallback(() => {
    setIsSimulating(false);
    setPlacedBoxes([]); 
    setCurrentBoxIndex(0);
    setRobotHasBox(false);
  }, []);

  // 2. Calcul Coordonate (Memoized)
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

  // 3. Reset Trigger
  useEffect(() => {
     const t = setTimeout(() => handleReset(), 100);
     return () => clearTimeout(t);
  }, [params, formulas, handleReset]);

  // 4. Callbacks Robot
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
    <main className="min-h-screen bg-[#050505]">
      <SparkleManager />
      {/* HEADER */}
      <div className="header">
        <div className="header-sparkles"></div>
        <h1 className="typewriter-title">d i n<span className="word-space"></span>t a s t e</h1> 
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          <Image src="/catpixeled.png" className="image" alt="Logo AZAX" width={150} height={150} priority />
          <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
            <li className="list-item"><Link href="/" onClick={() => setIsMenuOpen(false)} scroll={false}>Home</Link></li>
            <li className="list-item"><Link href="/palletizer" onClick={() => setIsMenuOpen(false)} scroll={false}>Robotics</Link></li>
            <li className="list-item"><Link href="/articles" onClick={() => setIsMenuOpen(false)} scroll={false}>Journal Entries</Link></li>
            <li className="list-item"><Link href="/contact" onClick={() => setIsMenuOpen(false)} scroll={false}>Contact</Link></li>
          </ul>
        </div>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">☰</button>
      </nav>

      <div className="row">
        {/* COLOANA STANGA */}
        <div className="column1">
          <div id="d-wrapper">
              <div className="zig-zag-bottom2"></div>
              <div className="sep1"></div>
              {[...Array(decorCount)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p></p></div>
                <div className="sep2"><p style={{ marginTop: '20%' }}></p></div>
              </React.Fragment>
            ))}
            <div className="zig-zag-top"></div>
          </div>
        </div>

        {/* COLOANA CENTRALA */}
        <div className="column2" ref={centerRef} style={{ perspective: '2000px' }}>
          <div className="spiral-binding"></div>
          
          <PageTurn>
            <div className="fade-in">
              <h2 style={{ paddingLeft: '40px', marginBottom: '20px', borderBottom: '2px solid #99c2ff', paddingBottom: '10px', color: '#dcdcdc'}}> 
                Industrial Simulation 
              </h2> 
                
                {/* --- ROBOT CONTROLS & CANVAS UI --- */}
                <div className="flex flex-col gap-6 relative">

                    <p style={{lineHeight: '1.8', fontSize: '1.15rem', color: '#dcdcdc', letterSpacing: '0.02em', marginBottom: '2%', textIndent: '40px' }}> 
                        This interactive sandbox bridges the gap between abstract math and mechanical motion. By defining custom formulas for the X, Y, and Z axes, you directly control the robot&apos;s palletizing logic, visualizing how algorithmic patterns translate into precise spatial coordinates in real-time.
                    </p>

                    {/* --- INPUTS PANEL (RE-DESIGNED) --- */}
                    <div className="tech-panel">
                        
                        <div className="inputs-layout">
                            
                            {/* --- COLOANA STÂNGA: CONFIGURATION --- */}
                            <div className="inputs-column">
                                <h3 className="section-title">Configuration</h3>

                                {/* Folosim clasa .config-grid pentru a le așeza frumos */}
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
                                    {/* Total Items primește o bordură specială galbenă dacă vrei să iasă în evidență */}
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

                            {/* --- COLOANA DREAPTA: FORMULAS --- */}
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

                                    {/* Progress Bar - Design Industrial */}
                                    <div className="mt-auto pt-4">
                                        <div className="flex justify-between text-[#555] mb-2 text-xs font-mono uppercase tracking-widest">
                                            <span>Batch Status</span>
                                            <span>{placedBoxes.length}/{params.total}</span>
                                        </div>
                                        <div className="w-full bg-[#000] h-3 rounded-sm border border-[#333] relative">
                                            {/* Liniile de grid pe bara de progres */}
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

                    {/* --- 3D CANVAS & BUTTONS --- */}
                    <div className="w-full flex flex-col gap-3">
                        
                        {/* BUTOANE NOI - STIL INDUSTRIAL */}
                        <div className="buttons-container">
                            
                            {/* Butonul START / PAUSE */}
                            <button 
                                onClick={() => setIsSimulating(!isSimulating)}
                                className={`cyber-btn flex-1 ${isSimulating ? 'pause' : 'start'}`}
                            >
                                <span className="btn-icon">{isSimulating ? "❚❚" : "▶"}</span>
                                {isSimulating ? "HALT SYSTEM" : "START SYSTEM"}
                            </button>

                            {/* Butonul RESET */}
                            <button 
                                onClick={handleReset}
                                className="cyber-btn reset px-8" // px-8 îl face puțin mai lat
                            >
                                <span className="btn-icon">↺</span>
                                RESET
                            </button>
                        </div>

                        {/* Canvas Container */}
                        <div className="h-[500px] border border-[#444] bg-[#151515] rounded relative overflow-hidden shadow-2xl">
                            <Canvas shadows camera={{ position: [10, 10, 10], fov: 35 }}>
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
                                
                                {/* SOURCE STACK */}
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

                                {/* DESTINATION PALLET */}
                                {placedBoxes.map((boxData) => {
                                    return <Box key={boxData.id} position={boxData.position} size={[params.dx, params.dy, params.h]} />;
                                })}
                            </Canvas>
                            <div className="absolute bottom-2 left-2 text-[8px] text-gray-600 font-mono pointer-events-none">
                                RENDER: THREE.JS FIBER
                            </div>
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
              {/* --- END ROBOT UI --- */}
              
            </div> 
          </PageTurn>
        </div>

        {/* COLOANA DREAPTA */}
        <div className="column3">
          <div id="d-wrapper" ref={rightRef}>
            <div className="zig-zag-bottom"></div>
            <div className="sep1"><p></p></div>
            {[...Array(decorCount)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p></p></div>
                <div className="sep2"><p style={{ marginTop: '20%' }}></p></div>
              </React.Fragment>
            ))}
            <div className="zig-zag-top2"></div>
          </div>
        </div>
      </div>

      <footer>
        <p>Ⓒ 2025 din taste</p>
      </footer>
    </main>
  );
}