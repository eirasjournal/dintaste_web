"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import SparkleManager from '../components/SparkleManager'; // <--- IMPORT AICI

export default function Contact() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [decorCount, setDecorCount] = useState(3);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const MAX_DECOR = 30; // safety cap to avoid infinite repetition on extremely tall screens

  // State pentru efectul de "Copied!"
  const [copied, setCopied] = useState(false);
  const email = "eirasjournal@gmail.com"; // <-- PUNE ADRESA TA AICI (chiar dacă nu ai domeniul încă, poți pune gmail)

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Resetează mesajul după 2 secunde
  };

  useEffect(() => {
    let t: number | null = null;
    const compute = () => {
      try {
        const center = centerRef.current;
        const left = leftRef.current;
        if (!center || !left) return;

        const centerHeight = center.offsetHeight;

        // Try to measure one pattern block: a zig + sep2
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
    <main className="min-h-screen bg-[#341c74]">
      <SparkleManager />
      {/* HEADER */}
      <div className="header">
        {/* --- AICI: Containerul nou pentru stele --- */}
        <div className="header-sparkles"></div>
        <h1 className="typewriter-title">d i n<span className="word-space"></span>t a s t e</h1> 
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          {/* Asigura-te ca ai poza asta in folderul public */}
          <Image 
            src="/pixelcat.png" 
            className="image" 
            alt="Logo AZAX" 
            width={150}  // Asta e doar pentru rezoluție, CSS-ul decide mărimea vizuală
            height={150} // Asta e doar pentru rezoluție
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
              /* React.Fragment tine loc de parinte, dar dispare in browser */
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p></p></div>
                <div className="sep2"></div>
              </React.Fragment>
            ))}
            
            <div className="zig-zag-top"></div>
          </div>
        </div>

        {/* COLOANA CENTRALA - Continut */}
        <div className="column2" ref={centerRef}>
          <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
            <h2 style={{ marginBottom: '40px', borderBottom: '2px solid #fe98ff', paddingBottom: '10px' }}>
              Get in Touch
            </h2>

            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Have something to share? A thought about an article, a song recommendation, or just want to say hi?
            </p>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px' }}>
              I&apos;m always open to reading emails from strangers. It reminds me that there are real people behind the screens.
            </p>

            {/* CUTIA DE EMAIL */}
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              padding: '30px', 
              borderRadius: '15px', 
              border: '1px dashed #fe98ff',
              textAlign: 'center',
              marginTop: '50px'
            }}>
              <p style={{marginLeft: '-45px', fontFamily: 'monospace', color: '#ccc', marginBottom: '15px' }}>
                You can reach me at:
              </p>
              
              <div style={{ 
                fontSize: '1.5rem', 
                color: '#fff', 
                fontFamily: 'monospace', 
                marginBottom: '25px',
                wordBreak: 'break-all' 
              }}>
                {email}
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {/* Buton Copy */}
                <button 
                  onClick={handleCopy}
                  className="copy-btn"
                  style={{ 
                    background: copied ? '#4caf50' : '#fe98ff', // Se face verde când e copiat
                    color: '#1a1a1a',
                    border: 'none',
                    padding: '10px 25px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    margin: 0
                  }}
                >
                  {copied ? "Copied! ✅" : "Copy Email"}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* COLOANA DREAPTA - Decorativa */}
        <div className="column3">
          <div id="d-wrapper" ref={rightRef}>
            <div className="zig-zag-bottom"></div>
            <div className="sep1"><p></p></div>
            
            {[...Array(decorCount)].map((_, i) => (
              /* React.Fragment tine loc de parinte, dar dispare in browser */
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p></p></div>
                <div className="sep2"></div>
              </React.Fragment>
            ))}
            
            <div className="zig-zag-top"></div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        {/* Am scos linkurile reale pentru anonimitate. Poti pune linkuri catre Github-ul tau anonim */}
        <p>Ⓒ 2025 din taste</p>
      </footer>
    </main>
  );
}