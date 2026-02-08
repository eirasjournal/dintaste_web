"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Info, X, Zap, Users, Globe, Fingerprint, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DreamInput from './components/DreamInput';
import "../globals.css";

export default function DreamPage() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d499ff] selection:text-black font-mono">
      
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

      {/* --- SECȚIUNEA NOUĂ: THE GENESIS (Footer Story) --- */}
      <footer className="relative z-10 border-t border-[#222] mt-20 bg-[#0a050a]">
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
          
          {/* Partea de Text (Stânga) */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d499ff]/5 border border-[#d499ff]/20 text-[#d499ff] text-[10px] tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d499ff] animate-pulse"></span>
              Project Genesis
            </div>
            
            <h3 className="text-2xl font-bold text-white">
              It started with a <br/>
              <span className="text-gray-500">signal from the noise.</span>
            </h3>
            
            <p className="text-sm text-gray-400 leading-relaxed font-mono">
              Sometimes the collective unconscious speaks through YouTube comments. 
              User <span className="text-white">@christopherg6335</span> broadcasted a wish into the void. 
            </p>
            <p className="text-sm text-gray-400 leading-relaxed font-mono">
              I accepted the challenge. <br/>
              Dintaste is the response.
            </p>
          </div>

          {/* Partea cu Imaginea (Dreapta) */}
          <div className="flex-1 relative group cursor-pointer">
            {/* Glow effect in spate */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#d499ff] to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-black p-2 rounded-lg border border-[#333] group-hover:border-[#d499ff]/50 transition-colors">
              {/* Bara de sus a ferestrei (Mac/Browser style) */}
              <div className="flex gap-1.5 mb-2 px-1 opacity-50">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              
              {/* Imaginea */}
              <Image 
                src="/origin-comment.png" 
                alt="The YouTube comment that started it all" 
                width={600}
                height={400}
                className="rounded w-full opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 duration-500"
              />
            </div>
            
            <div className="text-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] text-[#d499ff] tracking-widest font-mono uppercase">
              [ Source Identified ]
            </div>
          </div>

        </div>
        
        {/* Copyright simplu */}
        <div className="text-center py-8 border-t border-[#1a1a1a] text-[#333] text-[10px] uppercase tracking-widest">
          Engineered by [AMI MICU] // {new Date().getFullYear()}
        </div>
      </footer>

    </main>
  );
}