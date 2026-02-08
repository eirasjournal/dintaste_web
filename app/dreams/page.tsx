"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DreamInput from './components/DreamInput';
import "../globals.css";

export default function DreamPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d499ff] selection:text-black pb-20">
      
      {/* Navigation Bar */}
      <nav className="border-b border-[#222] bg-[#050505]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[#888] hover:text-[#d499ff] transition-colors font-mono text-sm"
          >
            <ArrowLeft size={16} /> RETURN_TO_PORTAL
          </Link>
          <div className="font-mono font-bold tracking-[0.2em] text-[#d499ff]">
            DREAM_AI
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          UPLOAD YOUR <span className="text-[#d499ff] animate-pulse">SUBCONSCIOUS</span>
        </h1>
        <p className="text-[#888] max-w-xl mx-auto font-mono text-sm md:text-base leading-relaxed">
          Participate in the global mapping of human dreamscapes. 
          Your data is anonymized, tokenized, and clustered to find 
          synchronistic patterns in the collective psyche.
        </p>
      </div>

      {/* Core Components */}
      <div className="px-6 relative z-10">
        <DreamInput />
      </div>

    </main>
  );
}