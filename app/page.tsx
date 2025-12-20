"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import SparkleManager from './components/SparkleManager'; 
// 1. IMPORTĂ COMPONENTA
import PageTurn from './components/PageTurn'; 

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [decorCount, setDecorCount] = useState(3);
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
            <li className="list-item">
              <Link href="/palletizer" onClick={() => setIsMenuOpen(false)} scroll={false}>Robotics</Link>
            </li>
            <li className="list-item">
              <Link href="/articles" onClick={() => setIsMenuOpen(false)} scroll={false}>Journal Entries</Link>
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
              <div className="zig-zag-bottom"></div>
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
        <div className="column2" ref={centerRef} style={{ perspective: '2000px' }}>
          <div className="spiral-binding"></div>
          {/* 3. ÎNCONJOARĂ CONȚINUTUL CU <PageTurn> */}
          <PageTurn>
            <div className="fade-in">
              <h2 style={{ paddingLeft: '40px', marginBottom: '40px', borderBottom: '2px solid #99c2ff', paddingBottom: '10px', color: '#dcdcdc'}}> 
                About me 
              </h2> 
              
              <div style={{lineHeight: '1.8', fontSize: '1.15rem', color: '#dcdcdc', letterSpacing: '0.02em' }}> 
              
                {/* --- PRIMUL POST-IT (Galben, Dreapta) --- */}
                <div className="sticky-note yellow">
                  📌 <strong>Reminder:</strong>
                  <br/>
                  You are not doing it wrong if no one knows what you are doing.
                </div>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  Hello and welcome! You have landed in the digital workspace of a <strong>Robotics Master’s student</strong>. What started as a coding challenge to push my technical boundaries has evolved into something much more personal.
                </p> 
                
                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  I recently found some interesting insights on <a href="https://www.journalinghabit.com/observing-journals-leonardo-da-vinci/" target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3', textDecoration: 'underline' }}>Journaling Habit</a> regarding the chaotic beauty of <strong>Leonardo da Vinci’s notebooks</strong>. It struck a chord with me: in his pages, sketches of complex flying machines sit right next to doodles and philosophical musings.
                </p>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  He showed that the technical mind and the human soul are not separate compartments. They bleed into each other.
                </p>

                {/* --- AL DOILEA POST-IT (Roz, Stânga) --- */}
                <div className="sticky-note pink">
                  📌 <strong>Note to self:</strong>
                  <br/>
                  Entropy isn&apos;t just a physics concept, it&apos;s my current mental state.
                </div>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}>
                  <span className="highlight-text">This website is my version of that notebook.</span> By day, I deal in rigid logic. But the engineer who builds the machine also has a heart that beats, breaks, and heals. 
                </p>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  Here, you will find my technical projects sitting side-by-side with my rawest thoughts. Why &apos;Din Taste&apos;? It translates to &apos;From Keys&apos; in my native Romanian. Whether I’m typing an algorithm for a robot or a journal entry about growing up, it all flows from the same keyboard. Consider it an ongoing experiment in development.
                </p> 

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  I hope you find a bit of your own chaos reflected in this blog&apos;s lines. Maybe you’ll find that we are debugging the same errors. 
                </p>
              </div> 
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
            <div className="zig-zag-top"></div>
          </div>
        </div>
      </div>

      <footer>
        <p>Ⓒ 2025 din taste</p>
      </footer>
    </main>
  );
}