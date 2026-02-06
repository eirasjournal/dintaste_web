"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

  return (
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
            <Link href="/" onClick={() => setIsMenuOpen(false)} scroll={false}>Home</Link>
          </li>
          
          {/* LOGICA DROPDOWN ROBOTICS */}
          <li className={`list-item dropdown-parent ${mobileSubmenuOpen ? 'active' : ''}`}>
            <span 
              className="nav-link cursor-pointer" 
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
                <Link href="/theory" onClick={() => setIsMenuOpen(false)} scroll={false}>Theory</Link>
              </li>
              <li>
                <Link href="/simulation" onClick={() => setIsMenuOpen(false)} scroll={false}>Simulation</Link>
              </li>
            </ul>
          </li>

          <li className="list-item">
            <Link href="/aboutme" onClick={() => setIsMenuOpen(false)} scroll={false}>About Me</Link>
          </li>
          
          <li className="list-item">
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} scroll={false}>Contact</Link>
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
  );
}