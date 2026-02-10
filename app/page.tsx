"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Brain, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#d499ff] selection:text-black">
      
      {/* Background Ambience (Optional) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-purple-500 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 max-w-2xl px-6 text-center"
      >
        {/* Titlu Simbolic */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
          THE{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d499ff] via-[#3b82f6] to-[#d499ff] animate-text-gradient">
            POLYMATH
          </span>{' '}
          LAB
        </h1>

        {/* Textul despre Da Vinci */}
        <div className="space-y-6 text-gray-400 leading-relaxed text-sm md:text-base mb-12">
          <p>
            Just like Leonardo da Vinci&apos;s journals, where sketches of flying machines 
            coexisted with anatomical studies, this platform is a convergence of distinct worlds.
          </p>
          <p>
            Here lies the intersection of 
            <span className="text-white font-bold mx-1">Logic</span>  
            and 
             <span className="text-white font-bold mx-1">Aether</span>. 
            A collection of varied interests, from the cold logic of robotics to the 
            deep symbolism of the collective unconscious.
          </p>
          <p className="italic opacity-60">
            &quot;Study the science of art. Study the art of science. Develop your senses — especially learn how to see.&quot;
          </p>
        </div>

        {/* Butonul DIVE IN */}
        <Link href="/portal">
          <motion.button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-white text-black font-bold tracking-widest uppercase text-sm rounded hover:bg-[#d499ff] transition-colors duration-300"
          >
            <span className="flex items-center gap-3">
              Dive In
              <ArrowRight 
                size={16} 
                className={`transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`}
              />
            </span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Footer Discret */}
      <div className="absolute bottom-8 text-[#333] text-[10px] uppercase tracking-[0.2em]">
        Curated by [AMI MICU]
      </div>
    </div>
  );
}