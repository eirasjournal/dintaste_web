"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import SparkleManager from '../components/SparkleManager'; 
import PageTurn from '../components/PageTurn'; 

// =========================================================
// 1. ZONA COMPONENTE "NOTEBOOK THEORY" (NEMODIFICATĂ)
// =========================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScribbleArrow = ({ className, color = "#99c2ff", rotation = 180 }: { className?: string, color?: string, rotation?: number }) => (
  <svg className={`absolute pointer-events-none overflow-visible ${className}`} width="100" height="40" viewBox="0 0 100 40" style={{ transform: `rotate(${rotation}deg)` }}>
    <path d="M 5 20 Q 50 5 90 20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset="0" />
    <path d="M 80 12 L 92 20 L 82 28" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScribbleCircle = ({ color = "#ff6b6b" }: { color?: string }) => (
  <svg className="absolute top-[-10px] left-[-15%] w-[130%] h-[150%] pointer-events-none overflow-visible" viewBox="0 0 120 60">
    <path d="M 10 30 Q 30 5 60 10 Q 100 10 110 30 Q 115 50 60 55 Q 20 55 10 30" stroke={color} strokeWidth="2" fill="none" strokeDasharray="5,2" />
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UnderlineScribble = ({ color = "#facc15" }: { color?: string }) => (
    <svg className="absolute -bottom-2 left-0 w-full h-4 overflow-visible pointer-events-none">
        <path d="M 0 5 Q 50 15 100 5 T 200 5" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScribbleArrowSmall = ({ flip = true }) => (
  <svg
    width="60"
    height="40"
    viewBox="0 0 60 40"
    className={`mr-2 ${flip ? "scale-x-[-1]" : ""}`}
  >
    <path
      d="M 58 20 Q 35 5 5 20"
      stroke="#99c2ff"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 10 14 L 5 20 L 12 24"
      stroke="#99c2ff"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const NotebookTheory = () => {
  return (
    <div className="notebook-page" style={{marginBottom: "10%"}}>

      <div className="sticky-note yellow">
        🎯 Key idea: <br />
        index + formula <br />
        = many possible positions
      </div>

      {/* SECTION 1 */}
      <h3 className="notebook-subtitle">
        1. Linear index <span className="highlight-text">i</span>
      </h3>

      <p className="notebook-paragraph">
        The robot runs inside a loop:
      </p>

      <pre className="notebook-code">
        FOR i = 0 TO N-1
      </pre>

      <p className="notebook-paragraph">
        where N is the total number of objects to place.
      </p>

      <p className="notebook-paragraph">
        The variable <strong>i</strong> represents the object number.
        The main question is: <br />
        <span className="highlight-text" style={{fontWeight: "bold", fontSize: "1.5em"}}> how do we convert i into a position (x, y, z)?</span>
      </p>

      {/* SECTION 2 */}
      <h3 className="notebook-subtitle">
        2. 2D pallet – rows and columns
      </h3>

      <p className="notebook-paragraph">
        We assume a pallet with:
      </p>

      <ul className="notebook-list">
        <li><strong>c</strong> = number of columns</li>
        <li><strong>r</strong> = number of rows</li>
        <li><strong>dx</strong> = spacing between objects on X axis</li>
        <li><strong>dy</strong> = spacing between objects on Y axis</li>
      </ul>
      <p className="notebook-paragraph">
        We need two mathematical operations to get column and row from index i:
      </p>
      <p className="notebook-paragraph">
        🔍 <strong>MOD (i / α)</strong> returns the remainder of the division <br />
        🔍 <strong>INT (i / α)</strong> returns the quotient of the division
      </p>

      <div>
  <p className="notebook-paragraph">
    Example for <strong>α = 3</strong>:
  </p>

        <div>
        {/* LINIA 1 */}
        <div className="explanation-row">
            <pre className="notebook-code">
            i: 0 1 2 3 4 5 6 7 8
            </pre>
            <div className="annotation-group">
            <svg width="50" height="20" viewBox="0 0 50 20" style={{ overflow: 'visible' }}>
                <defs>
                <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6" fill="#99c2ff" />
                </marker>
                </defs>
                <path d="M 0 10 L 40 10" stroke="#99c2ff" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)" />
            </svg>
            <span className="handwritten-text">
                this is the index
            </span>
            </div>
        </div>

        {/* LINIA 2 */}
        <div className="explanation-row">
            <pre className="notebook-code">
            i MOD 3: 0 1 2 0 1 2 0 1 2
            </pre>
            <div className="annotation-group">
            <svg width="50" height="20" viewBox="0 0 50 20" style={{ overflow: 'visible' }}>
                <path d="M 0 10 L 40 10" stroke="#99c2ff" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)" />
            </svg>
            <span className="handwritten-text">
                this operation will reset the expression from 3 to 3 values of i
            </span>
            </div>
        </div>
    </div>

  {/* LINIA 3 */}
  <div className="explanation-row">
    <pre className="notebook-code">
    INT(i/3): 0 0 0 1 1 1 2 2 2
    </pre>
    <div className="annotation-group">
      <svg width="50" height="20" viewBox="0 0 50 20" style={{ overflow: 'visible' }}>
        <path d="M 0 10 L 40 10" stroke="#99c2ff" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)" />
      </svg>
      <span className="handwritten-text">
        this operation will increment the expression from 3 to 3 consecutive values of i
      </span>
    </div>
  </div>
</div>

      {/* SECTION 3 */}
      <h3 className="notebook-subtitle">
        3. 3D pallet – rows, columns and layers
      </h3>

      <p className="notebook-paragraph">
        For 3D palletizing we add:
      </p>

      <ul className="notebook-list">
        <li><strong>h</strong> = object height (spacing between objects on Z axis)</li>
        <li><strong>n</strong> = objects per layer</li>
      </ul>

      <pre className="notebook-code">
        layer number = INT( i / n ) 
      </pre>
      <p className="notebook-paragraph">
        The Z position is then calculated as:
      </p>
      <pre className="notebook-code">
        z = h × layer
      </pre>

      <p className="notebook-paragraph">
        This means:
        <span className="highlight-text">every n boxes, the robot moves up one layer</span>.
      </p>

      {/* CONCLUSION */}
      <h3 className="notebook-subtitle mt-12">
        Conclusion
      </h3>

      <p className="notebook-paragraph">
        Everything shown in the sketch reduces to:
      </p>

      <ul className="notebook-list">
        <li>a linear index <strong>i</strong></li>
        <li>simple operations: <strong>MOD (i / α) </strong> and <strong>INT (i / α) </strong></li>
      </ul>

      <span className="highlight-text" style={{fontWeight: "bold", fontSize: "1.5em", lineHeight: "1.4em"}}>
        This logic applies in industrial robotics to place objects in 2D and 3D pallets! 
      </span>

    </div>
  );
};


// =========================================================
// 2. CONFIGURAREA ARTICOLELOR (DATE)
// =========================================================

const THEORY_ARTICLES = [
  {
    id: 1, 
    title: "Pallet Position Calculation",
    date: "Core Module 1.1",
    preview: "In industrial robotics, palletizing means computing the exact position of every single object using math...",
    // AICI ESTE CHEIA: Acest articol are o componentă specială, nu doar text
    component: <NotebookTheory />,
    hasSimulationLink: true
  },
  {
    id: 2, 
    title: "Understanding Coordinate Systems",
    date: "Core Module 1.0",
    preview: "Before a robot moves, it must know where 'here' and 'there' are. A look into World vs Tool coordinates...",
    // Acesta este un articol text standard
    content: `In industrial robotics, the concept of "position" is meaningless without a reference frame. A point defined as (10, 20, 30) implies a distance from an Origin (0,0,0).



When we program the palletizer, we are essentially dealing with two main coordinate systems:

1. World Coordinates: Fixed to the floor or the base of the robot. This is absolute.

2. Tool Coordinates (TCP): Fixed to the gripper. This moves with the robot.

The math we visualize in the "Simulation" tab effectively translates the linear index of a box (Box #1, Box #2) into a vector in the World Coordinate system.`
  }
];


// =========================================================
// 3. PAGINA PRINCIPALA (THEORY PAGE)
// =========================================================

export default function TheoryPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const decorCount = 6;

  // State pentru articolul selectat
  const [selectedArticle, setSelectedArticle] = useState<typeof THEORY_ARTICLES[number] | null>(null);

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
            
            <li className="list-item">
              <Link href="/" onClick={() => setIsMenuOpen(false)} scroll={false}>Home</Link>
            </li>

            {/* --- DROPDOWN ROBOTICS --- */}
            <li className={`list-item dropdown-parent ${mobileSubmenuOpen ? 'active' : ''}`}>
              <span 
                className="nav-link cursor-pointer" 
                style={{ color: '#99c2ff' }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileSubmenuOpen(!mobileSubmenuOpen);
                }}
              >
                Robotics <span style={{ fontSize: '0.6em', verticalAlign: 'middle' }}>
                  {mobileSubmenuOpen ? '▲' : '▼'}
                </span>
              </span>
              
              <ul className="dropdown-menu">
                <li>
                  <Link href="/theory" onClick={() => {
                      setIsMenuOpen(false);
                      setSelectedArticle(null); // Reset la listă dacă dai click pe Theory din meniu
                  }}>Theory</Link>
                </li>
                <li>
                  <Link href="/palletizer" onClick={() => setIsMenuOpen(false)}>Simulation</Link>
                </li>
              </ul>
            </li>

            <li className="list-item">
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} scroll={false}>Contact</Link>
            </li>
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
        <div className="column2" style={{ perspective: '2000px' }}>
          <div className="spiral-binding"></div>
          
          <PageTurn>
            <div className="fade-in pb-10">

              {!selectedArticle ? (
                // ---------------------------------------------
                // VIEW A: LISTA DE ARTICOLE
                // ---------------------------------------------
                <>
                  <h2 style={{ paddingLeft: '40px', marginBottom: '20px', borderBottom: '2px solid #99c2ff', paddingBottom: '10px', color: '#dcdcdc'}}> 
                    Theoretical Concepts
                  </h2> 

                   {/* --- SYSTEM LOG: ONLINE --- */}
                    <div style={{
                        backgroundColor: 'rgba(5, 20, 5, 0.7)', 
                        border: '1px dashed #00ff9d',                
                        borderLeft: '5px solid #00ff9d',             
                        padding: '15px 20px',
                        marginBottom: '40px',
                        color: '#00ff9d',                                
                        fontFamily: 'monospace',
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '15px',
                        boxShadow: '0 0 10px rgba(0, 255, 157, 0.1)',
                        marginLeft: '40px',
                        marginRight: '20px'
                    }}>
                        <span style={{ fontSize: '1.4rem', lineHeight: '1' }}>💠</span>
                        <div>
                            <strong style={{ display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                System Status: Online
                            </strong>
                            <span style={{ opacity: 0.9, color: '#a0a0a0' }}>
                                Accessing logic database. Select a module to initialize data stream.
                            </span>
                        </div>
                    </div>

                  {/* LISTAREA */}
                  {THEORY_ARTICLES.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticle(art)}
                      className="article-preview-card"
                      style={{
                        marginBottom: '30px',
                        marginLeft: '40px',
                        marginRight: '20px',
                        cursor: 'pointer',
                        padding: '20px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <h3 style={{ color: '#99c2ff', fontSize: '1.4rem', marginBottom: '5px', fontFamily: 'Courier New' }}>
                          {art.title}
                      </h3>
                      <span style={{ color: '#666', fontFamily: 'monospace', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                          {art.date}
                      </span>
                      <p style={{ marginTop: '10px', color: '#aaa', fontSize: '0.95rem' }}>
                          {art.preview} <span style={{color: '#99c2ff'}}>[Read_Data]</span>
                      </p>
                    </div>
                  ))}
                </>

              ) : (
                // ---------------------------------------------
                // VIEW B: ARTICOL SELECTAT
                // ---------------------------------------------
                <>
                  {/* Buton Înapoi */}
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    style={{
                      background: 'transparent', 
                      border: '1px solid #99c2ff', 
                      color: '#99c2ff',
                      padding: '8px 20px', 
                      cursor: 'pointer', 
                      marginBottom: '30px',
                      marginLeft: '40px',
                      fontFamily: 'monospace', 
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                    className="hover:bg-[#99c2ff] hover:text-black transition-colors"
                  >
                    ← Return to Index
                  </button>

                  <h2 style={{ paddingLeft: '40px', marginBottom: '10px', color: '#dcdcdc', fontSize: '2rem'}}> 
                    {selectedArticle.title}
                  </h2> 
                  <p style={{ paddingLeft: '40px', fontFamily: 'monospace', color: '#555', marginBottom: '40px', fontSize: '0.8rem' }}>
                        UID: {selectedArticle.date} / ID: {selectedArticle.id}
                  </p>

                  {/* --- LOGICA DE AFIȘARE --- */}
                  {selectedArticle.component ? (
                    // CAZ 1: Randează componenta specială (Notebook)
                    <div className="w-full">
                        {selectedArticle.component}
                        
                        {/* Butonul CTA pentru simulare (dacă e setat flag-ul) */}
                        {selectedArticle.hasSimulationLink && (
                            <div className="text-center my-8">
                                <Link href="/palletizer">
                                    <button className="cyber-btn start px-8 py-4">
                                        <span className="btn-icon" style={{marginBottom: '2%'}}>▶</span>
                                        Test Logic in Simulator
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                  ) : (
                    // CAZ 2: Randează text standard
                    <div style={{ paddingLeft: '40px', paddingRight: '20px', lineHeight: '1.7', fontSize: '1.05rem', color: '#d0d0d0', letterSpacing: '0.01em' }}>
                        {selectedArticle.content?.split('\n\n').map((para, idx) => (
                             <p key={idx} style={{ marginBottom: '20px', textIndent: '40px' }}>
                             {/* Verificare simplă pentru imagini sau formule (opțional) */}
                             {para.startsWith('[Image') ? (
                                 <span style={{display: 'block', padding: '40px', border: '1px dashed #444', textAlign: 'center', color: '#555', margin: '20px 0', fontSize: '0.8rem', fontStyle: 'italic'}}>
                                     {para}
                                 </span>
                             ) : (
                                 para
                             )}
                         </p>
                        ))}
                    </div>
                  )}

                  <div style={{ marginTop: '50px', borderTop: '1px solid #222', paddingTop: '20px', textAlign: 'center', opacity: 0.6, fontFamily: 'monospace', color: '#444' }}>
                        / END OF FILE
                  </div>
                </>
              )}

            </div>
          </PageTurn>
        </div>

        {/* COLOANA DREAPTA */}
        <div className="column3">
          <div id="d-wrapper">
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