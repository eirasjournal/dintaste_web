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
            src="/catpixeled.png" 
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
              <Link href="/articles" onClick={() => setIsMenuOpen(false)}>Journal Entries</Link>
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

        {/* COLOANA CENTRALA - Continut */}
        <div className="column2" ref={centerRef}>
          <div className="fade-in" style={{width: '90%', maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
            {/* SCHIMBAT: Border-bottom este acum #99c2ff */}
            <h2 style={{ paddingLeft: '40px', marginBottom: '40px', borderBottom: '2px solid #99c2ff', paddingBottom: '10px', color: '#dcdcdc'}}> 
              About me 
            </h2> 
            <div style={{lineHeight: '1.8', fontSize: '1.15rem', color: '#dcdcdc', letterSpacing: '0.02em' }}> 
              <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                Hello and welcome! You have landed in the digital workspace of a <strong>Robotics Master’s student</strong>. What started as a coding challenge to push my technical boundaries has evolved into something much more personal.
              </p> 
              
              <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                I recently found some interesting insights on <a href="https://www.journalinghabit.com/observing-journals-leonardo-da-vinci/" target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3', textDecoration: 'underline' }}>Journaling Habit</a> regarding the chaotic beauty of <strong>Leonardo da Vinci’s notebooks</strong>. It struck a chord with me: in his pages, sketches of complex flying machines and anatomical studies sit right next to doodles and philosophical musings. He showed that the technical mind and the human soul are not separate compartments. They bleed into each other.
              </p> 

              <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                <strong>This website is my version of that notebook.</strong> By day, I deal in rigid logic. But the engineer who builds the machine also has a heart that beats, breaks, and heals. 
              </p>

              <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                Here, you will find my technical projects sitting side-by-side with my rawest thoughts. Why &apos;Din Taste&apos;? It translates to &apos;From Keys&apos; in my native Romanian. Whether I’m typing an algorithm for a robot or a journal entry about growing up, it all flows from the same keyboard. Consider it an ongoing experiment in development
              </p> 

              <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                I hope you find a bit of your own chaos reflected in these blog&apos;s lines. Maybe you’ll find that we are debugging the same errors. 
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
            
            {[...Array(decorCount + 2)].map((_, i) => (
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