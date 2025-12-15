"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import SparkleManager from './components/SparkleManager'; 
import MapWidget from './components/MapWidget';


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [decorCount, setDecorCount] = useState(3);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const MAX_DECOR = 30; 

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
      } catch {
        // ignore measurement errors
      }
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
    /* Mentine fundalul negru premium pentru contrastul cu rozul neon */
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
          <Image 
            src="/pixelcat.png" 
            className="image" 
            alt="Logo AZAX" 
            width={150} 
            height={150} 
            priority
          />
          <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
            <li className="list-item">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li className="list-item">
              <Link href="/articles" onClick={() => setIsMenuOpen(false)}>Articles</Link>
            </li>
            <li className="list-item">
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </li>
          </ul>
        </div>
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      <div className="row">
        {/* COLOANA STANGA - Decorativa */}
        <div className="column1">
          <div id="d-wrapper">
              <div className="zig-zag-bottom"></div>
              <div className="sep1"><p></p></div>
            
              {[...Array(decorCount)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p></p></div>
                <div className="sep2"><p style={{ marginTop: '20%' }}></p></div>
              </React.Fragment>
            ))}
            
            <div className="zig-zag-top"></div>
          </div>
        </div>

        {/* COLOANA CENTRALA - Continut */}
        <div className="column2" ref={centerRef}>
          <div className="fade-in" style={{width: '90%', maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
            {/* SCHIMBAT: Border-bottom este acum #fe98ff (Rozul tau) */}
            <h2 style={{ paddingLeft: '40px', marginBottom: '40px', borderBottom: '2px solid #fe98ff', paddingBottom: '10px', color: '#dcdcdc'}}> 
              About me 
            </h2> 
            <div style={{lineHeight: '1.8', fontSize: '1.15rem', color: '#dcdcdc', letterSpacing: '0.02em' }}> 
              <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                Hello and welcome! I started this site with two goals in mind: to push my technical boundaries and to find my voice. What began as a &quot;built-from-scratch&quot; coding challenge quickly became my space of freedom. 
              </p> 
              <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                It’s a space where my technical projects collide with my personal thoughts. Consider it an ongoing experiment in development: building a functional website, but also building myself. 
              </p> 
              <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                Why &apos;Din Taste&apos;? It translates to &apos;From Keys&apos; in my native Romanian. It’s a reminder that everything here comes raw, straight from my keyboard to your screen. 
              </p> 
              <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                I hope reading this inspires you to start your own project, no matter what it is. 
              </p> 
            </div> 
            <MapWidget />
          </div>
        </div>

        {/* COLOANA DREAPTA - Decorativa */}
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
            
            <div className="zig-zag-top"></div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <p>Ⓒ 2025 din taste</p>
      </footer>
    </main>
  );
}