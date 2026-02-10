"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, Send, Calendar, Hash, Sparkles, Brain, Lightbulb, Zap, Radio } from 'lucide-react';
import { submitDream } from '../services/dreamApi';
import { Users, User, Globe, Fingerprint } from 'lucide-react';

// ... (Funcția getResonanceDetails rămâne neschimbată) ...

const getResonanceDetails = (label: string, count: number) => {
    // ... (codul existent pentru switch case) ...
    // Pentru brevetare, copiez doar default-ul aici, dar tu păstrează tot switch-ul
    switch (label) {
        case 'COLLECTIVE_WAVE': return { title: 'COLLECTIVE WAVE', desc: `High Temporal Activity. ${count} people are dreaming this exact theme right now.`, color: 'text-indigo-400', borderColor: 'border-indigo-500/50', bg: 'bg-indigo-500/10', icon: <Radio size={18} className="animate-pulse" /> };
        case 'SYNCHRONICITY': return { title: 'SYNCHRONICITY', desc: 'Temporal Lock. You and another dreamer connected within the last 48 hours.', color: 'text-cyan-400', borderColor: 'border-cyan-400/50', bg: 'bg-cyan-400/10', icon: <Zap size={18} /> };
        case 'COLLECTIVE_ECHO': return { title: 'COLLECTIVE ECHO', desc: `This dream acts as a recurring motif for ${count} other people over time.`, color: 'text-amber-400', borderColor: 'border-amber-400/50', bg: 'bg-amber-400/10', icon: <Globe size={18} /> };
        case 'SHARED_ARCHETYPE': return { title: 'SHARED ARCHETYPE', desc: `Common psychological elements. Resonates with ${count} dreamer(s).`, color: 'text-blue-400', borderColor: 'border-blue-400/50', bg: 'bg-blue-400/10', icon: <Users size={18} /> };
        case 'TWIN_CONNECTION': return { title: 'TWIN CONNECTION', desc: 'Deep Resonance. You share this specific vision with a Soul Twin from the past.', color: 'text-pink-400', borderColor: 'border-pink-400/50', bg: 'bg-pink-400/10', icon: <User size={18} /> };
        case 'VAGUE_RESONANCE': return { title: 'VAGUE RESONANCE', desc: 'There are faint ripples, but your dream has its own unique imprint.', color: 'text-purple-300', borderColor: 'border-purple-300/30', bg: 'bg-purple-300/5', icon: <Sparkles size={18} /> };
        default: return { title: 'UNIQUE VISION', desc: 'A completely original dream. No similar frequencies found in the database.', color: 'text-gray-400', borderColor: 'border-gray-500/30', bg: 'bg-gray-500/5', icon: <Fingerprint size={18} /> };
    }
};

interface DreamReceipt {
  id?: string | number;
  date_occurred?: string;
  resonance?: {  // FIX: Adăugat ? pentru a fi opțional
    percentage: number;
    label: string;
    is_sync: boolean;
  };
  similarity?: { // FIX: Adăugat ? pentru a fi opțional
    similar_count: number;
    temporal_matches: number;
  };
  interpretation?: { // FIX: Adăugat ?
    summary?: string;
    motifs?: string[];
    emotions?: string[];
    themes?: string[];
    interpretation?: string;
    advice?: string;
  };
}

export default function DreamInput() {
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [receipt, setReceipt] = useState<DreamReceipt | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.length < 10) return;

    setStatus('LOADING');
    setReceipt(null);

    try {
      const apiCall = submitDream({ content, date_occurred: date });
      const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
      const [result] = await Promise.all([apiCall, minDelay]);
      
      console.log("Result received:", result); // Debug check
      setReceipt(result); 
      setStatus('SUCCESS');
      setContent('');
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-16 relative font-mono">
      <AnimatePresence mode="wait">
        {status !== 'SUCCESS' ? (
          // --- INPUT FORM ---
          <motion.div 
            key="input-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative bg-[#0a050a] border border-[#333] rounded-lg overflow-hidden shadow-2xl"
          >
             {/* ... (Header și Formularul rămân identice) ... */}
             <div className="bg-[#1a0f1a] px-4 py-2 flex justify-between items-center border-b border-[#333]">
               <div className="flex items-center gap-2">
                 <Terminal size={14} className="text-[#d499ff]" />
                 <span className="text-[#d499ff] text-xs tracking-widest opacity-80">INPUT_STREAM // UNCONSCIOUS</span>
               </div>
               <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#333]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#d499ff] animate-pulse"></div>
               </div>
             </div>

             <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                   <label className="text-[#888] text-xs uppercase flex items-center gap-2">
                      <Calendar size={12}/> Temporal Marker
                   </label>
                   <input 
                     type="date" 
                     value={date} 
                     onChange={(e)=>setDate(e.target.value)} 
                     className="bg-[#050505] border border-[#333] text-[#d499ff] text-sm p-3 rounded focus:border-[#d499ff] outline-none" 
                   />
                </div>

                <div className="flex flex-col gap-2">
                   <label className="text-[#888] text-xs uppercase">Dream Description</label>
                   <textarea 
                     value={content} 
                     onChange={(e)=>setContent(e.target.value)} 
                     className="bg-[#050505] border border-[#333] text-white text-sm p-4 h-32 rounded resize-none focus:border-[#d499ff] outline-none" 
                     placeholder="> I was wandering through..." 
                     minLength={10} 
                     maxLength={1500} 
                     required 
                   />
                   <div className="text-right text-[10px] text-[#555]">{content.length} / 1500 CHARS</div>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'LOADING'} 
                  className="border border-[#d499ff] text-[#d499ff] hover:bg-[#d499ff]/10 py-3 rounded uppercase text-sm transition-all flex justify-center gap-2 items-center"
                >
                   {status === 'LOADING' ? (
                     <span className="animate-pulse">ANALYZING TEMPORAL DATA...</span>
                   ) : (
                     <>UPLOAD TO COLLECTIVE <Send size={14}/></>
                   )}
                </button>
             </form>
          </motion.div>
        ) : (
          
          // --- RICH RECEIPT (CORECȚII AICI) ---
          <motion.div 
            key="receipt-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a050a] border border-[#d499ff] rounded-lg p-6 md:p-8 relative overflow-hidden text-left"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[#d499ff] shadow-[0_0_15px_#d499ff]"></div>
            
            <div className="flex items-center gap-4 mb-8 border-b border-[#333] pb-6">
                <CheckCircle size={32} className="text-[#d499ff]" />
                <div>
                    <h2 className="text-xl text-white tracking-widest">ANALYSIS COMPLETE</h2>
                    <p className="text-[#666] text-xs uppercase">
                        {/* FIX: Folosim ?.resonance?.label și un fallback */}
                        {date} {" // "} {receipt?.resonance?.label || "PROCESSING"}
                    </p>
                </div>
            </div>

            {/* 1. Statistics Grid - FIX: Optional Chaining Peste tot */}
            {(() => {
              // FIX: Adăugat ?. peste tot și valori default
              const label = receipt?.resonance?.label || 'UNIQUE_VISION';
              const count = receipt?.similarity?.similar_count || 0;
              const isSync = receipt?.resonance?.is_sync || false;
              const percentage = receipt?.resonance?.percentage || 0;

              const resonance = getResonanceDetails(label, count);
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  
                  {/* RESONANCE LABEL */}
                  <div className={`p-4 rounded border flex flex-col justify-center relative overflow-hidden ${resonance.borderColor} ${resonance.bg}`}>
                    {isSync && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-white bg-red-500/20 border border-red-500/50 px-2 py-0.5 rounded animate-pulse">
                            <Zap size={10} /> Live Sync
                        </div>
                    )}
                    
                    <div className={`flex items-center gap-2 mb-2 ${resonance.color} font-bold text-sm tracking-widest uppercase`}>
                      {resonance.icon}
                      {resonance.title}
                    </div>
                    <p className={`text-xs leading-relaxed opacity-80 ${resonance.color.replace('text-', 'text-')}`}>
                      {resonance.desc}
                    </p>
                  </div>

                  {/* INTENSITY SCORE */}
                  <div className="bg-[#111] p-4 rounded border border-[#333] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <span className="text-[#555] text-[10px] uppercase mb-1 z-10">
                      Match Intensity
                    </span>
                    <span className="text-white font-bold text-3xl z-10">
                      {percentage}%
                    </span>
                    
                    <div 
                        className="absolute bottom-0 left-0 h-1 opacity-50 transition-all duration-1000"
                        style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: 'currentColor',
                            color: resonance.color === 'text-cyan-400' ? '#22d3ee' : '#d499ff'
                        }}
                    ></div>
                  </div>
                  
                </div>
              );
            })()}

            {/* 2. Structured Tags */}
            {receipt?.interpretation && (
                <div className="mb-8 space-y-4">
                    {/* Motifs - FIX: ?.motifs */}
                    {receipt.interpretation?.motifs && (
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-[#888] text-xs uppercase">
                                <Hash size={12}/> Detected Motifs
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {receipt.interpretation.motifs.map((m, i) => (
                                    <span key={i} className="px-2 py-1 bg-[#d499ff]/10 text-[#d499ff] text-xs border border-[#d499ff]/30 rounded">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Interpretation Text - FIX: ?.interpretation */}
            <div className="bg-[#111] border border-[#333] p-5 rounded mb-6 relative">
              <h3 className="text-[#d499ff] text-xs uppercase mb-3 flex items-center gap-2">
                <Brain size={14}/> Psychological Analysis
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {receipt?.interpretation?.interpretation || "Interpretation data unavailable."}
              </p>
            </div>

            {/* 4. Actionable Advice - FIX: ?.advice */}
            {receipt?.interpretation?.advice && (
                <div className="bg-[#d499ff]/5 border border-[#d499ff]/20 p-4 rounded mb-8 flex gap-3">
                    <Lightbulb size={18} className="text-[#d499ff] shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-[#d499ff] text-xs uppercase mb-1">Reflection</h4>
                        <p className="text-gray-400 text-xs italic">
                            &quot;{receipt.interpretation.advice}&quot;
                        </p>
                    </div>
                </div>
            )}

            <button 
              onClick={() => setStatus('IDLE')}
              className="w-full py-4 border-t border-[#333] text-[#555] hover:text-[#d499ff] hover:bg-[#111] transition-colors text-xs uppercase tracking-widest"
            >
              [ INITIALIZE NEW UPLOAD ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}