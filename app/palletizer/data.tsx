"use client";

import React from 'react';
// Importăm componenta pe care ai extras-o deja în components/PalletizerSandbox.tsx
import PalletizerSandbox from './sandbox/PalletizerSandbox'; 

export const SIMULATIONS = [
  {
    id: 'palletizer-v1',
    slug: 'sandbox', // <--- URL-ul va fi /palletizer/sandbox
    title: "Palletizing Logic Sandbox",
    version: "v2.4.0 (Stable)",
    preview: "A programmable environment for testing industrial stacking algorithms. Input your variables, defining grid logic...",
    component: <PalletizerSandbox />
  },
  // Aici poți adăuga pe viitor alte simulări:
  // {
  //   id: 'arm-v1',
  //   slug: 'robot-arm',
  //   title: "6-Axis Arm Control",
  //   ...
  // }
];