"use client";

import React from 'react';

// Mock data to demonstrate the visual (Connect to API later)
const MOCK_CLUSTERS = [
  { topic: 'ANXIETY / TEETH', percentage: 45, color: '#ff4d4d' },
  { topic: 'FLYING / WATER', percentage: 30, color: '#4d94ff' },
  { topic: 'UNKNOWN / ABSTRACT', percentage: 25, color: '#888' },
];

export default function DreamPatterns() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-20">
      <h2 className="text-[#d499ff] font-mono text-2xl mb-8 text-center border-b border-[#333] pb-4">
        GLOBAL_SYNC // {new Date().toLocaleDateString()}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_CLUSTERS.map((cluster, i) => (
          <div key={i} className="border border-[#333] bg-[#0a050a] p-6 relative overflow-hidden group hover:border-[#d499ff] transition-colors">
            {/* Background Bar */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-current opacity-10 transition-all duration-1000"
              style={{ height: `${cluster.percentage}%`, color: cluster.color }}
            />
            
            <h3 className="text-4xl font-black text-white mb-2 relative z-10">
              {cluster.percentage}%
            </h3>
            <p className="text-[#888] font-mono text-sm tracking-widest mb-4 relative z-10">
              DETECTED_PATTERN
            </p>
            <div className="text-lg font-bold relative z-10" style={{ color: cluster.color }}>
              {cluster.topic}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[#555] font-mono text-center mt-12 text-sm">
        * Patterns are generated via Unsupervised Learning (LDA) on the nightly dataset.
      </p>
    </div>
  );
}