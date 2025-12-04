"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import SparkleManager from './components/SparkleManager'; // <--- IMPORT AICI
import Comments from './components/Comments';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#341c74]">
      <SparkleManager />
      {/* HEADER */}
      <div className="header">
        <h1 className="typewriter-title">d i n<span className="word-space"></span>t a s t e</h1> 
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          {/* Asigura-te ca ai poza asta in folderul public */}
          <Image 
            src="/logo.png" 
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
              {/* Linkul acesta poate duce momentan tot spre home sau o pagina in constructie */}
              <Link href="#" onClick={() => setIsMenuOpen(false)}>Films&Series</Link>
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
            <div className="sep1"><p>✧˖°˖࿔⋆</p></div>
            
            {[...Array(1)].map((_, i) => (
              /* React.Fragment tine loc de parinte, dar dispare in browser */
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p>✧˖°˖࿔⋆</p></div>
                <div className="sep2"><p style={{ marginTop: '20%' }}>✧˖°˖࿔⋆</p></div>
              </React.Fragment>
            ))}
            
            <div className="zig-zag-top"></div>
          </div>
        </div>

        {/* COLOANA CENTRALA - Continut */}
        <div className="column2">
          <h2>About me</h2>
          <p style={{ marginBottom: '2%' }}>
            Welcome to my website! I created this site to prove to myself that I can code and manage it properly. 
            I will dedicate this space to showcasing my passions and my journey.
            <br /><br />
            I&apos;m a student at the Faculty of Automatic Control and Computer Science. 
            In my free time, I code, read, and try to find my own path.
            <br /><br />
            I&apos;ll be sharing my thoughts and insights on a variety of topics. 
            I hope that by sharing my experiences, I can inspire others to explore their own interests.
          </p>

          {/* AICI AI PUTEA PUNE BUTONUL DE BUY ME A COFFEE */}
          {/* <div style={{ margin: '40px 0', textAlign: 'center' }}>
            <a href="#" className="sparkley" style={{ color: 'white', textDecoration: 'none' }}>
              ☕ Buy me a coffee (Coming Soon)
            </a>
          </div> */}

          <div className="scroller">
            <Comments />
          </div>
        </div>

        {/* COLOANA DREAPTA - Decorativa */}
        <div className="column3">
          <div id="d-wrapper">
            <div className="zig-zag-bottom"></div>
            <div className="sep1"><p>⋆࿔˖°˖✧</p></div>
            
            {[...Array(1)].map((_, i) => (
              /* React.Fragment tine loc de parinte, dar dispare in browser */
              <React.Fragment key={i}>
                <div className="zig-zag-bottom zig-zag-top1"><p>⋆࿔˖°˖✧</p></div>
                <div className="sep2"><p style={{ marginTop: '20%' }}>⋆࿔˖°˖✧</p></div>
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