"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, X, Zap, Users, Globe, Fingerprint, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DreamInput from './components/DreamInput';
import "../globals.css";

export default function DreamPage() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d499ff] selection:text-black pb-20 font-mono">
      
      {/* --- INFO MODAL (POP-UP) --- */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowInfo(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a050a] border border-[#d499ff]/30 w-full max-w-lg rounded-xl shadow-[0_0_50px_rgba(212,153,255,0.1)] overflow-hidden relative"
            >
              {/* Header Modal */}
              <div className="bg-[#1a0f1a] p-6 border-b border-[#333] flex justify-between items-center">
                <h3 className="text-[#d499ff] font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                  <Info size={16} /> Algorithm Decoding
                </h3>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content Modal */}
              <div className="p-6 space-y-8 text-sm text-gray-300 leading-relaxed">
                
                {/* Section 1: Match Intensity */}
                <div className="flex gap-4">
                  <div className="bg-[#d499ff]/10 p-3 rounded h-fit border border-[#d499ff]/20">
                    <Zap size={24} className="text-[#d499ff]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase mb-2 text-xs tracking-widest">Match Intensity (%)</h4>
                    <p className="text-xs text-gray-400 mb-2">
                      Answers the question: <em>&quot;How much does my dream resemble the closest dream found?&quot;</em>
                    </p>
                    <div className="space-y-1 text-xs">
                       <div className="flex justify-between">
                         <span className="text-white">90-100%</span>
                         <span className="text-gray-500">Perfect Mirror (Identical)</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-white">50-89%</span>
                         <span className="text-gray-500">Similar Theme (Archetype)</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[#222] w-full"></div>

                {/* Section 2: Resonance Label */}
                <div className="flex gap-4">
                  <div className="bg-blue-500/10 p-3 rounded h-fit border border-blue-500/20">
                    <Globe size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase mb-2 text-xs tracking-widest">Collective Resonance</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      Answers the question: <em>&quot;How many people have dreamed this?&quot;</em>
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Fingerprint size={14} className="text-gray-500 mt-0.5 shrink-0"/> 
                        <div>
                            <span className="text-white block text-xs font-bold">UNIQUE VISION</span>
                            <span className="text-[10px] text-gray-500">0 people. You are a pioneer.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Users size={14} className="text-pink-400 mt-0.5 shrink-0"/> 
                        <div>
                            <span className="text-pink-400 block text-xs font-bold">TWIN CONNECTION</span>
                            <span className="text-[10px] text-gray-500">1 person. A rare coincidence.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Globe size={14} className="text-amber-400 mt-0.5 shrink-0"/> 
                        <div>
                            <span className="text-amber-400 block text-xs font-bold">COLLECTIVE ECHO</span>
                            <span className="text-[10px] text-gray-500">3+ people. A trend in the unconscious.</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Footer Modal */}
              <div className="bg-[#111] p-4 text-center border-t border-[#333]">
                <button 
                  onClick={() => setShowInfo(false)}
                  className="w-full py-2 bg-[#d499ff]/10 text-[#d499ff] hover:bg-[#d499ff] hover:text-black transition-all text-xs uppercase tracking-widest rounded"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NAVIGATION BAR --- */}
      <nav className="border-b border-[#222] bg-[#050505]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/portal" 
            className="flex items-center gap-2 text-[#888] hover:text-[#d499ff] transition-colors text-xs md:text-sm"
          >
            <ArrowLeft size={16} /> PORTAL
          </Link>
          
          <div className="flex items-center gap-4">
             {/* LOGO-ul */}
            <div className="hidden md:block font-bold tracking-[0.2em] text-[#d499ff]">
              DREAM_AI
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-16 px-6 text-center overflow-hidden">
        
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
          UPLOAD YOUR <span className="text-[#d499ff] animate-pulse">SUBCONSCIOUS</span>
        </h1>
        
        <p className="text-[#888] max-w-2xl mx-auto text-xs md:text-sm leading-relaxed mb-8">
          Carl Jung believed that dreams are not isolated events, but messages from a global network we all share: the Collective Unconscious. Dintaste transforms this theory into mathematical reality.
          Participate in the global mapping of human dreamscapes.
        </p>

        {/* 2. TRIGGER SECUNDAR FOARTE VIZIBIL */}
        <div className="flex justify-center">
            <button 
                onClick={() => setShowInfo(true)}
                className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-widest border-b border-gray-800 hover:border-white pb-1"
            >
                <HelpCircle size={14} className="text-[#d499ff] group-hover:scale-110 transition-transform"/>
                <span>How do we measure Synchronicity?</span>
            </button>
        </div>

      </div>

      {/* Core Components */}
      <div className="px-4 md:px-6 relative z-10">
        <DreamInput />
      </div>

    </main>
  );
}