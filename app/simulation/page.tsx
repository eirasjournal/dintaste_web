"use client";

import React from 'react';
import Link from 'next/link';
import PageTurn from '../components/PageTurn';
import PageLayout from '../components/PageLayout';
import { SIMULATIONS } from './data'; // Importăm datele

export default function SimulationListPage() {
  return (
    <PageLayout decorCount={5}>
      <PageTurn>
        <div className="fade-in">
          <h2 style={{ paddingLeft: '40px', marginBottom: '20px', borderBottom: '2px solid #99c2ff', paddingBottom: '10px', color: '#dcdcdc'}}> 
            Industrial Simulations
          </h2> 

          {/* SYSTEM LOG */}
          <div style={{
              backgroundColor: 'rgba(5, 20, 5, 0.7)', 
              border: '1px dashed #00ff9d',                
              borderLeft: '5px solid #00ff9d',             
              padding: '15px 20px',
              marginBottom: '40px',
              color: '#00ff9d',                                
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'start',
              gap: '15px',
              boxShadow: '0 0 10px rgba(0, 255, 157, 0.1)',
          }}>
              <span style={{ fontSize: '1.4rem', lineHeight: '1' }}>⚡</span>
              <div>
                  <strong style={{ display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Simulation Engine: Ready
                  </strong>
                  <span style={{ opacity: 0.9, color: '#a0a0a0' }}>
                      Hardware acceleration enabled. Select a module to initialize 3D viewport.
                  </span>
              </div>
          </div>

          {/* LISTA GENERATĂ DIN DATA.TSX */}
          {SIMULATIONS.map((sim) => (
            <Link 
                key={sim.id} 
                href={`/simulation/${sim.slug}`} 
                scroll={false} 
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <div
                    className="article-preview-card"
                    style={{
                    marginBottom: '30px',
                    cursor: 'pointer',
                    padding: '20px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease'
                    }}
                >
                    <h3 style={{ color: '#99c2ff', fontSize: '1.4rem', marginBottom: '5px', fontFamily: 'Courier New' }}>
                        {sim.title}
                    </h3>
                    <span style={{ color: '#666', fontFamily: 'monospace', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        {sim.version}
                    </span>
                    <p style={{ marginTop: '10px', color: '#aaa', fontSize: '0.95rem' }}>
                        {sim.preview} <span style={{color: '#99c2ff'}}>[Launch_System]</span>
                    </p>
                </div>
            </Link>
          ))}
          
        </div> 
      </PageTurn>
    </PageLayout>
  );
}