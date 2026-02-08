// app/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

type HoverState = 'left' | 'right' | null;

export default function Portal() {
  const [hoveredSide, setHoveredSide] = useState<HoverState>(null);

  return (
    <main className="portal-wrapper">
      
      {/* --- LEFT CARD: ROBOTICS (LOGIC) --- */}
      <Link 
        href="/robotics" 
        className={`portal-card left ${hoveredSide === 'right' ? 'dimmed' : ''}`}
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <div className="card-content">
          <div className="card-icon">⚙️</div>
          <h2 className="card-title">ROBOT SIMULATIONS</h2>
          <p className="card-subtitle">
            LOGIC. KINEMATICS. HARDWARE.
          </p>
          <div className="tech-readout">
            <span>STATUS: ONLINE</span>
            <span>SYS: REACT_3_FIBER</span>
          </div>
        </div>
        
        {/* Decorative Grid Background for Robotics */}
        <div className="grid-bg"></div>
      </Link>

      {/* --- RIGHT CARD: DREAMS (ABSTRACT) --- */}
      <Link 
        href="/dreams" 
        className={`portal-card right ${hoveredSide === 'left' ? 'dimmed' : ''}`}
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <div className="card-content">
          <div className="card-icon">🌙</div>
          <h2 className="card-title">AI DREAM ANALYSIS</h2>
          <p className="card-subtitle">
            ABSTRACT. PATTERNS. UNCONSCIOUS.
          </p>
          <div className="tech-readout">
            <span>STATUS: LISTENING</span>
            <span>SYS: AI_CLUSTERING</span>
          </div>
        </div>

        {/* Decorative Particles/Stars for Dreams */}
        <div className="stars-bg"></div>
      </Link>

    </main>
  );
}