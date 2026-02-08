"use client";

import React, { useState } from 'react';
import PageTurn from '../components/PageTurn';
// 1. IMPORTĂM NOUL LAYOUT
import PageLayout from '../components/PageLayout';
import Comments from '../components/Comments';

export default function Contact() {
  // State pentru efectul de "Copied!"
  const [copied, setCopied] = useState(false);
  const email = "eirasjournal@gmail.com"; 

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Resetează mesajul după 2 secunde
  };

  return (
    // Folosim PageLayout cu un decorCount mai mic, pagina fiind scurtă
    <PageLayout decorCount={4}>
      <PageTurn>
        <div className="fade-in">
          
          <h2 style={{fontSize: '2rem', paddingLeft: '40px', marginBottom: '40px', borderBottom: '2px solid #99c2ff', paddingBottom: '10px', color: '#dcdcdc' }}>
            Get in Touch
          </h2>

          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px', textIndent: '40px', color: '#dcdcdc' }}>
            Have something to share? A thought about an article or just want to say hi?
          </p>

          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px', textIndent: '40px', color: '#dcdcdc' }}>
            I&apos;m always open to reading emails from strangers!
          </p>

          {/* CUTIA DE EMAIL */}
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '30px', 
            borderRadius: '15px', 
            border: '1px dashed #99c2ff',
            textAlign: 'center',
            marginTop: '50px',
            marginBottom: '50px'
          }}>
            <p style={{fontFamily: 'monospace', 
                        color: '#ccc', 
                        marginBottom: '15px',
                        textAlign: 'center'}}>
                  You can reach me at:
            </p>
            
            <div style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.4rem)', 
              color: '#fff', 
              fontFamily: 'monospace', 
              marginBottom: '25px',
              textAlign: 'center',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere' 
            }}>
              {email}
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Buton Copy */}
              <button 
                onClick={handleCopy}
                className="copy-btn"
                style={{ 
                  background: copied ? '#4caf50' : '#99c2ff', // Se face verde când e copiat
                  color: '#1a1a1a',
                  border: 'none',
                  padding: '10px 25px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  margin: 0,
                  cursor: 'pointer',
                  borderRadius: '5px',
                  transition: 'background 0.3s ease'
                }}
              >
                {copied ? "Copied! ✅" : "Copy Email"}
              </button>
            </div>
          </div>

          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px', textIndent: '40px', color: '#dcdcdc' }}>
            Or reach out via GitHub!
          </p>
          <div className="scroller">
            <Comments />
          </div>
        </div>
      </PageTurn>
    </PageLayout>
  );
}