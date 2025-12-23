"use client";

import React from 'react';
// Importă noul layout
import PageLayout from './components/PageLayout';
import PageTurn from './components/PageTurn'; 
import MapWidget from './components/MapWidget';

export default function Home() {
  // Aici stabilești câte decorațiuni vrei pentru Home
  const decorForHome = 3;
  
  return (
    <PageLayout decorCount={decorForHome}>
       {/* Tot ce pui aici va apărea automat în coloana centrală */}
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
    </PageLayout>
  );
}