"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageTurn from '../../components/PageTurn';   
import PageLayout from '../../components/PageLayout'; 
import { SIMULATIONS } from '../data'; 

// Definim tipul props corect pentru Next.js 15
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function SimulationPage(props: PageProps) {
  // Despachetăm params în siguranță
  const params = use(props.params);
  const slug = params.slug;

  // Căutăm simularea
  const selectedSimulation = SIMULATIONS.find((s) => s.slug === slug);

  if (!selectedSimulation) {
    return notFound();
  }

  return (
    <PageLayout decorCount={6}>
      <PageTurn>
        <div className="fade-in">
             <Link href="/palletizer">
                  <button 
                    style={{
                        background: 'transparent', 
                        border: '1px solid #99c2ff', 
                        color: '#99c2ff',
                        padding: '8px 20px', 
                        cursor: 'pointer', 
                        marginBottom: '30px',
                        marginLeft: '40px',
                        fontFamily: 'monospace', 
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                    className="hover:bg-[#99c2ff] hover:text-black transition-colors"
                >
                    ← Terminate Session
                </button>
             </Link>

            <h2 style={{ paddingLeft: '40px', marginBottom: '10px', color: '#dcdcdc', fontSize: '2rem'}}> 
                {selectedSimulation.title}
            </h2> 
            <p style={{ paddingLeft: '40px', fontFamily: 'monospace', color: '#555', marginBottom: '40px', fontSize: '0.8rem' }}>
                    Build: {selectedSimulation.version}
            </p>

            <div className="w-full">
                {/* AICI VINE SIMULAREA SELECTATĂ */}
                {selectedSimulation.component}
            </div>
        </div>
      </PageTurn>
    </PageLayout>
  );
}