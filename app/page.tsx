"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import SparkleManager from './components/SparkleManager'; 
// 1. IMPORTĂ COMPONENTA
import PageTurn from './components/PageTurn'; 
import MapWidget from './components/MapWidget';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 1. ADĂUGĂM ACEST STATE NOU
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const decorCount = 4;

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
              {[...Array(decorCount)].map((_, i) => (
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
        <div className="column2" style={{ perspective: '2000px' }}>
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
                  In theory, there is no difference between theory and practice.
                  <br/>
                  In practice, there is.
                </div>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  Hello! You&apos;ve landed in the workspace of a <strong>Robotics Master’s student</strong>. This isn&apos;t just a portfolio. It&apos;s a documentation of my academic journey into the world of robotics and automation.
                </p> 
                
                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  <span className="highlight-text">This platform is an <strong>open-source lab notebook</strong>.</span> I use this space to document the process of turning mathematical models into working machines.
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
                  Why &apos;Din Taste&apos;? It translates to &apos;From Keys&apos; in my native Romanian. It represents the modern roboticist&apos;s workflow: taking lines of code written on a keyboard and translating them into physical action. Whether it&apos;s simulation or hardware implementation, everything starts &apos;from keys&apos;.
                </p> 
              </div> 
              <MapWidget />
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