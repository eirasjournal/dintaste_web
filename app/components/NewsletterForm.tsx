"use client";

import React, { useState } from 'react';
import { subscribeToNewsletter } from '../actions'; // Importă acțiunea

export default function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(event.currentTarget);
    const result = await subscribeToNewsletter(formData);

    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      (event.target as HTMLFormElement).reset();
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  return (
    <div style={{ 
      marginTop: '30px', 
      padding: '30px', 
      border: '1px dashed #333', 
      borderLeft: '4px solid #99c2ff', // Accent albastru
      background: 'rgba(20, 20, 20, 0.5)',
      borderRadius: '4px'
    }}>
      <h3 style={{ 
        color: '#dcdcdc', 
        fontFamily: "'Courier New', Courier, monospace", 
        fontSize: '1.2rem', 
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Join the learning lab newsletter
      </h3>
      <p style={{ color: '#888', fontFamily: "'Courier New', Courier, monospace", marginBottom: '20px', fontSize: '0.9rem' }}>
        Get updates on simulation modules and new articles. No spam.
      </p>

      {status === 'success' ? (
        <div style={{ color: '#00ff9d', fontFamily: "'Courier New', Courier, monospace", padding: '10px', border: '1px solid #00ff9d', background: 'rgba(0, 255, 157, 0.1)' }}>
          ✅ {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter_Email_Address..." 
            required
            className="tech-input" // Folosim clasa ta din CSS
            style={{ flex: 1, minWidth: '200px' }}
          />
          
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="cyber-btn start" // Folosim clasa ta de buton
            style={{ padding: '10px 25px', fontSize: '0.9rem' }}
          >
            {status === 'loading' ? 'CONNECTING...' : 'SUBSCRIBE'}
          </button>
        </form>
      )}
      
      {status === 'error' && (
        <p style={{ color: '#ff3366', marginTop: '10px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          ❌ {message}
        </p>
      )}
    </div>
  );
}