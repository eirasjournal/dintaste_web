"use client";

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageTurn from '../../components/PageTurn'; 
import PageLayout from '../../components/PageLayout'; 
import { THEORY_ARTICLES } from '../data'; 
// 👇 Importăm componenta AICI, nu în data.tsx
import NotebookTheory from '../../components/NotebookTheory';

export default function ClientPage({ slug }: { slug: string }) {
  const selectedArticle = THEORY_ARTICLES.find((a) => a.slug === slug);

  if (!selectedArticle) {
    return notFound();
  }

  // 👇 LOGICA DE RANDARE COMPONENTĂ (Mapping)
  const renderContent = () => {
    if (selectedArticle.slug === 'pallet-position-calculation') {
      return <NotebookTheory />;
    }
    // Dacă nu e componentă specială, returnăm textul standard (dacă există)
    if (selectedArticle.content) {
       return (
         <div style={{ lineHeight: '1.7', fontSize: '1.05rem', color: '#d0d0d0', letterSpacing: '0.01em' }}>
            {selectedArticle.content.split('\n\n').map((para, idx) => (
                <p key={idx} style={{ marginBottom: '20px', textIndent: '40px' }}>{para}</p>
            ))}
         </div>
       );
    }
    return null;
  };

  return (
    <PageLayout decorCount={6}>
      <PageTurn>
        <div className="fade-in">
            <Link href="/robotics/theory">
                <button 
                    style={{
                    background: 'transparent', border: '1px solid #99c2ff', color: '#99c2ff', padding: '8px 20px', cursor: 'pointer', marginBottom: '30px', marginLeft: '40px', fontFamily: 'monospace', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'
                    }}
                    className="hover:bg-[#99c2ff] hover:text-black transition-colors"
                >
                    ← Return to Index
                </button>
            </Link>

            <h2 style={{ paddingLeft: '40px', marginBottom: '10px', color: '#dcdcdc', fontSize: '2rem'}}> 
                {selectedArticle.title}
            </h2> 
            <p style={{ paddingLeft: '40px', fontFamily: 'monospace', color: '#555', marginBottom: '40px', fontSize: '0.8rem' }}>
                UID: {selectedArticle.date} 
            </p>

            <div className="w-full">
                {/* AICI RANDĂM FUNCȚIA NOASTRĂ */}
                {renderContent()}
                
                {selectedArticle.hasSimulationLink && (
                    <div className="text-center my-8">
                        <Link href="/robotics/simulation/palletizer" scroll={false}>
                            <button className="cyber-btn start px-8 py-4">
                                <span className="btn-icon" style={{marginBottom: '2%'}}>▶</span>
                                Test Logic in Simulator
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '50px', borderTop: '1px solid #222', paddingTop: '20px', textAlign: 'center', opacity: 0.6, fontFamily: 'monospace', color: '#444' }}>
                / END OF FILE
            </div>
        </div>
      </PageTurn>
    </PageLayout>
  );
}