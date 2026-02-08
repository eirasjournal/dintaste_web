"use client";

import React, { useState } from 'react';
import NewsletterForm from './components/NewsletterForm';
// Importă noul layout
import PageLayout from './components/PageLayout';
import PageTurn from './components/PageTurn'; 
import MapWidget from './components/MapWidget';

export default function Home() {
  // Aici stabilești câte decorațiuni vrei pentru Home
  const decorForHome = 7;
  const [showNewsletter, setShowNewsletter] = useState(false);
  
  return (
    <PageLayout decorCount={decorForHome}>
       {/* Tot ce pui aici va apărea automat în coloana centrală */}
       <PageTurn>
            <div className="fade-in">
              <h2 style={{fontSize: '2rem', paddingLeft: '40px', marginBottom: '40px', borderBottom: '2px solid #99c2ff', paddingBottom: '10px', color: '#dcdcdc'}}> 
                Welcome! 
              </h2> 
              
              <div style={{lineHeight: '1.8', fontSize: '1.15rem', color: '#dcdcdc', letterSpacing: '0.02em' }}> 
              
                {/* --- PRIMUL POST-IT (Galben, Dreapta) - Focus Tehnic --- */}
                <div className="sticky-note yellow">
                    🧠 <strong>Ever wondered?</strong>
                    <br />
                    How robots know where to move 
                    and why they move that way?
                </div>

                <p style={{ marginBottom: "2%", fontSize: "1.2rem", textIndent: "40px" }}>
                    Ever watched <em>How It’s Made</em> and thought it was cool? Ever looked at
                    a factory robot and wondered what’s actually happening behind the scenes?
                </p> 
                
                <p style={{ marginBottom: "2%", fontSize: "1.2rem", textIndent: "40px" }}>
                    <span className="highlight-text">
                        This blog is a place to explore industrial robotics from the ground up
                    </span>, {" "} in a way that’s approachable and visual.
                    It focuses on how robots move, plan, and interact with their environment, without assuming prior knowledge.
                </p>

                {/* --- AL DOILEA POST-IT (Roz, Stânga) - Focus pe Proces --- */}
                {/* Sticky – tone */}
                <div className="sticky-note pink">
                  ✍️ <strong>Note:</strong>
                  <br />
                  No prior robotics knowledge required.
                </div>

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  The blog includes interactive 3D simulation sandboxes, such as palletizing scenarios, where theory turns into visible motion. These simulations are built using <em>Three.js</em> and <em>React Three Fiber</em>, allowing users to see robotic concepts in action within a web browser.
                </p> 

                <p style={{ marginBottom: '2%', fontSize: '1.2rem', textIndent: '40px' }}> 
                  The visual style follows the idea of a technical notebook: pages that turn like a real journal, sticky notes with reminders, highlighted formulas and arrows that guide the eye. Simulation pages take on a more cyber-inspired look, emphasizing execution and system state.
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