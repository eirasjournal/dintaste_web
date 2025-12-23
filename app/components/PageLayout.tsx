"use client";

import React from 'react';
import SparkleManager from './SparkleManager';
import Navbar from './Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  decorCount?: number; // Semnul "?" îl face opțional. Dacă nu pui, ia valoarea default.
}

export default function PageLayout({ children, decorCount = 4 }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-[#050505]">
      <SparkleManager />
      
      {/* HEADER */}
      <div className="header">
        <div className="header-sparkles"></div>
        <h1 className="typewriter-title">d i n<span className="word-space"></span>t a s t e</h1> 
      </div>

      {/* NAVBAR */}
      <Navbar />

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

        {/* COLOANA CENTRALA - Aici vine conținutul paginii */}
        <div className="column2" style={{ perspective: '2000px' }}>
          <div className="spiral-binding"></div>
            {children}
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