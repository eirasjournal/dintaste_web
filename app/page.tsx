"use client";

import React, { useState } from 'react';
import NewsletterForm from './components/NewsletterForm';
// Importă noul layout
import PageLayout from './components/PageLayout';
import PageTurn from './components/PageTurn'; 
import MapWidget from './components/MapWidget';

export default function Home() {
  // Aici stabilești câte decorațiuni vrei pentru Home
  const decorForHome = 8;
  const [showNewsletter, setShowNewsletter] = useState(false);
  
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
                  Hello! You&apos;ve landed in the workspace of a <strong>Robotics Master&apos;s student</strong>. This isn&apos;t just a portfolio. It&apos;s a documentation of my academic journey into the world of robotics and automation.
                </p> 
                
                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  <span className="highlight-text">This platform is an <strong>open-source lab notebook</strong>.</span> Here you&apos;ll find topics I am actively learning, along with documented explanations meant to help readers who are new to robotics. The focus is on understanding how things work, step by step. Concepts like robot motion, coordinate systems, and basic modeling are introduced gradually, with formulas explained in plain language and connected to intuitive examples.
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
                  The blog also includes interactive 3D simulation sandboxes, such as palletizing scenarios, where theory turns into visible motion. These simulations are built using <em>Three.js</em> and <em>React Three Fiber</em>, allowing users to see robotic concepts in action within a web browser.
                </p> 

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  This space reflects my own learning process, but it is designed to be welcoming to inexperienced readers. You don&apos;t need an advanced background to follow along. The goal is to build intuition first, then deepen understanding at your own pace.
                </p> 

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  The visual style follows the idea of a technical notebook: pages that turn like a real journal, sticky notes with reminders, highlighted formulas and arrows that guide the eye. Simulation pages take on a more cyber-inspired look, emphasizing execution and system state.
                </p> 

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  This is not a formal course or a finished reference. It is a shared learning space. It is a place to explore industrial robotics from the ground up, through explanation and simulation.
                </p>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  Why &apos;Din Taste&apos;? It translates to &apos;From Keys&apos; in my native Romanian. It represents the modern roboticist&apos;s workflow: taking lines of code written on a keyboard and translating them into physical action. Whether it&apos;s simulation or hardware implementation, everything starts &apos;from keys&apos;.
                </p> 

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}>
                    This notebook is constantly evolving. New explanations, simulations, and notes
                    are added as I learn and experiment. If you want to stay up to date when new
                    content goes live, you can subscribe to the mailing list below — no spam, just
                    updates from the lab.
                </p>

                <div style={{ marginTop: '40px'}}>
                  <button
                    className="cyber-btn start"
                    onClick={() => setShowNewsletter(prev => !prev)}
                  >
                    {showNewsletter ? 'HIDE SIGNAL' : 'SUBSCRIBE FOR UPDATES'}
                  </button>
                  {showNewsletter && <NewsletterForm />}
                </div>
              </div> 
              <MapWidget />
            </div>
       </PageTurn>
    </PageLayout>
  );
}