"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import SparkleManager from './components/SparkleManager'; 
// 1. IMPORTĂ COMPONENTA
import PageTurn from './components/PageTurn'; 
import MapWidget from './components/MapWidget';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [decorCount, setDecorCount] = useState(3);
  // 1. ADĂUGĂM ACEST STATE NOU
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const MAX_DECOR = 30; 

  // ... (păstrează logica useEffect pentru decorCount exact cum era) ...
  useEffect(() => {
    let t: number | null = null;
    const compute = () => {
      try {
        const center = centerRef.current;
        const left = leftRef.current;
        if (!center || !left) return;
        const centerHeight = center.offsetHeight;
        const oneZig = left.querySelector('.zig-zag-top1') || left.querySelector('.zig-zag-bottom');
        const oneSep = left.querySelector('.sep2');
        const zigH = oneZig ? (oneZig as HTMLElement).offsetHeight : 1;
        const sepH = oneSep ? (oneSep as HTMLElement).offsetHeight : 1;
        const patternH = zigH + sepH;
        if (patternH <= 0) return;
        let needed = Math.max(3, Math.ceil(centerHeight / patternH));
        if (MAX_DECOR && needed > MAX_DECOR) needed = MAX_DECOR;
        if (needed !== decorCount) setDecorCount(needed);
      } catch { }
    };
    const debounced = () => {
      if (t) clearTimeout(t);
      t = window.setTimeout(() => compute(), 120);
    };
    compute();
    window.addEventListener('resize', debounced);
    return () => {
      window.removeEventListener('resize', debounced);
      if (t) clearTimeout(t);
    };
  }, [decorCount]);

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
            {/* --- MODIFICARE DROPDOWN ROBOTICS --- */}
            {/* Adăugăm clasa 'active' dacă submeniul este deschis */}
            <li className={`list-item dropdown-parent ${mobileSubmenuOpen ? 'active' : ''}`}>
              
              {/* Adăugăm onClick pentru a comuta starea (Open/Close) */}
              <span 
                className="nav-link cursor-pointer" 
                onClick={(e) => {
                  e.preventDefault(); // Previne comportamentul default
                  setMobileSubmenuOpen(!mobileSubmenuOpen); // Comută Deschis/Închis
                }}
              >
                Robotics <span style={{ fontSize: '0.6em', verticalAlign: 'middle' }}>
                  {mobileSubmenuOpen ? '▲' : '▼'} {/* Schimbăm săgeata */}
                </span>
              </span>
              
              <ul className="dropdown-menu">
                <li>
                  <Link href="/theory" onClick={() => setIsMenuOpen(false)}>Theory</Link>
                </li>
                <li>
                  <Link href="/palletizer" onClick={() => setIsMenuOpen(false)}>Simulation</Link>
                </li>
              </ul>
            </li>
            {/* --- END MODIFICARE --- */}
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
              {[...Array(decorCount + 2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p></p></div>
                <div className="sep2"><p style={{ marginTop: '20%' }}></p></div>
              </React.Fragment>
            ))}
            <div className="zig-zag-top"></div>
          </div>
        </div>

        {/* COLOANA CENTRALA - Aici aplicăm stilul de perspectivă și wrapper-ul */}
        {/* 2. ADADUGĂ style={{ perspective: '2000px' }} PE CONTAINERUL PĂRINTE */}
        <div className="column2" ref={centerRef} style={{ perspective: '2000px' }}>
          <div className="spiral-binding"></div>
          {/* 3. ÎNCONJOARĂ CONȚINUTUL CU <PageTurn> */}
          <PageTurn>
            <div className="fade-in">
              <h2 style={{ paddingLeft: '40px', marginBottom: '40px', borderBottom: '2px solid #99c2ff', paddingBottom: '10px', color: '#dcdcdc'}}> 
                About me 
              </h2> 
              
              <div style={{lineHeight: '1.8', fontSize: '1.15rem', color: '#dcdcdc', letterSpacing: '0.02em' }}> 
              
                {/* --- PRIMUL POST-IT (Galben, Dreapta) - Focus Tehnic --- */}
                <div className="sticky-note yellow">
                  📌 <strong>Reminder:</strong>
                  <br/>
                  If it works on the first try, something is definitely wrong.
                </div>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  Hello and welcome! You have landed in the digital workspace of a <strong>Robotics Master’s student</strong>. This platform serves as a living documentation of my academic and practical journey into the world of automation.
                </p> 
                
                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  My goal is to bridge the gap between theory and physical motion. I treat this website as an <strong>open-source lab notebook</strong>. I use this space to document the process of turning mathematical models into working machines.
                </p>

                {/* --- AL DOILEA POST-IT (Roz, Stânga) - Focus pe Proces --- */}
                <div className="sticky-note pink">
                  ⚙️ <strong>Current Status:</strong>
                 <br/>
                  It does exactly what
                  <br/>
                  I told it to (sadly).
                </div>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}>
                  <span className="highlight-text">This blog is dedicated to the engineering behind the robots.</span> From kinematics to computer vision, I explore the technologies that drive the industry.
                </p>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  Why &apos;Din Taste&apos;? It translates to &apos;From Keys&apos; in my native Romanian. It represents the modern roboticist&apos;s workflow: taking lines of code written on a keyboard and translating them into precise, physical action. Whether it&apos;s simulation or hardware implementation, everything starts &apos;from keys&apos;.
                </p> 
              </div> 
              <MapWidget />
            </div>
          </PageTurn>
          
        </div>

        {/* COLOANA DREAPTA */}
        <div className="column3">
          <div id="d-wrapper" ref={rightRef}>
            <div className="zig-zag-bottom"></div>
            <div className="sep1"><p></p></div>
            {[...Array(decorCount + 2)].map((_, i) => (
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