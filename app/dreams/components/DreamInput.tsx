"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, Send, Calendar, Hash, Sparkles, Brain, Lightbulb } from 'lucide-react';
import { submitDream } from '../services/dreamApi';

// Updated Interface to match the new JSON structure
interface DreamReceipt {
  id: string | number;
  date_occurred: string;
  cluster_label: string;
  similarity_percentage: number;
  similar_count: number;
  interpretation: string;
  analysis?: {
    summary?: string;
    motifs?: string[];
    emotions?: string[];
    themes?: string[];
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
      // Minimum "thinking" time for effect
      const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
      const [result] = await Promise.all([apiCall, minDelay]);

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
          // --- INPUT FORM (Same as before) ---
          <motion.div 
            key="input-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative bg-[#0a050a] border border-[#333] rounded-lg overflow-hidden shadow-2xl"
          >
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
                     <span className="animate-pulse">DECODING SYMBOLS...</span>
                   ) : (
                     <>UPLOAD TO COLLECTIVE <Send size={14}/></>
                   )}
                </button>
             </form>
          </motion.div>
        ) : (
          
          // --- NEW RICH RECEIPT ---
          <motion.div 
            key="receipt-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a050a] border border-[#d499ff] rounded-lg p-6 md:p-8 relative overflow-hidden text-left"
          >
            {/* Top Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#d499ff] shadow-[0_0_15px_#d499ff]"></div>
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 border-b border-[#333] pb-6">
                <CheckCircle size={32} className="text-[#d499ff]" />
                <div>
                    <h2 className="text-xl text-white tracking-widest">ANALYSIS COMPLETE</h2>
                    <p className="text-[#666] text-xs uppercase">ID: #{receipt?.id} {" // "} {receipt?.date_occurred}</p>
                </div>
            </div>

            {/* 1. Statistics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#111] p-3 rounded border border-[#333] flex flex-col items-center justify-center text-center">
                <span className="text-[#555] text-[10px] uppercase mb-1">RESONANCE</span>
                <span className="text-[#d499ff] font-bold text-sm uppercase">
                  {receipt?.cluster_label}
                </span>
              </div>
              <div className="bg-[#111] p-3 rounded border border-[#333] flex flex-col items-center justify-center text-center">
                <span className="text-[#555] text-[10px] uppercase mb-1">COLLECTIVE MATCH</span>
                <span className="text-white font-bold text-xl">
                  {receipt?.similarity_percentage}%
                </span>
              </div>
            </div>

            {/* 2. Structured Tags (Motifs & Emotions) */}
            {receipt?.analysis && (
                <div className="mb-8 space-y-4">
                    {/* Motifs */}
                    {receipt.analysis.motifs && receipt.analysis.motifs.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-[#888] text-xs uppercase">
                                <Hash size={12}/> Detected Motifs
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {receipt.analysis.motifs.map((m, i) => (
                                    <span key={i} className="px-2 py-1 bg-[#d499ff]/10 text-[#d499ff] text-xs border border-[#d499ff]/30 rounded">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Emotions */}
                    {receipt.analysis.emotions && receipt.analysis.emotions.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-[#888] text-xs uppercase">
                                <Sparkles size={12}/> Emotional Signature
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {receipt.analysis.emotions.map((e, i) => (
                                    <span key={i} className="px-2 py-1 bg-[#222] text-gray-300 text-xs border border-[#444] rounded">
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Interpretation Text */}
            <div className="bg-[#111] border border-[#333] p-5 rounded mb-6 relative">
              <h3 className="text-[#d499ff] text-xs uppercase mb-3 flex items-center gap-2">
                <Brain size={14}/> Psychological Analysis
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {receipt?.interpretation}
              </p>
            </div>

            {/* 4. Actionable Advice */}
            {receipt?.analysis?.advice && (
                <div className="bg-[#d499ff]/5 border border-[#d499ff]/20 p-4 rounded mb-8 flex gap-3">
                    <Lightbulb size={18} className="text-[#d499ff] shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-[#d499ff] text-xs uppercase mb-1">Reflection</h4>
                        <p className="text-gray-400 text-xs italic">
                            &quot;{receipt.analysis.advice}&quot;
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