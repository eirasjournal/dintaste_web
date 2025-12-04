'use client';

import { useEffect } from 'react';
import $ from 'jquery';
import { initSparkle } from '../lib/sparkle';

declare global {
  interface JQuery<TElement = HTMLElement> {
    sparkle(options?: Record<string, unknown>): JQuery<TElement>;
  }
}

export default function SparkleManager() {
  useEffect(() => {
    // 1. Initializam pluginul sparkle atasandu-l la jQuery
    initSparkle($);

    // 2. Activam efectul pe elementele dorite (Configuratia ta originala)
    
    // Header
    ($(".header") as JQuery<HTMLElement>).sparkle({
      color: ["#FFFFFF", "#e67976"],
      minSize: 10,
      maxSize: 20,
      count: 100,
      direction: "up",
      speed: 2
    });

    // List Items din Navbar
    ($(".list-item") as JQuery<HTMLElement>).sparkle({
      color: ["#FFFFFF", "#e67976"],
      minSize: 4,
      maxSize: 7,
      count: 20,
      direction: "both",
      speed: 2
    });

    // Separatoarele si textul decorativ
    ($(".sep1 p, .sep2 p, .zig-zag-top1 p") as JQuery<HTMLElement>).sparkle({
      color: ["#FFFFFF", "#e67976"],
      minSize: 7,
      maxSize: 10,
      count: 20,
      direction: "both",
      speed: 2
    });

    // Butonul (daca o sa ai unul cu clasa .btn sau .sparkley)
    ($(".btn, .sparkley") as JQuery<HTMLElement>).sparkle({
      color: ["#341c74", "#221f38"],
      minSize: 7,
      maxSize: 10,
      count: 20,
      direction: "both",
      speed: 2
    });

    // Cleanup (optional, dar bun pentru performanta)
    return () => {
        // Aici am putea opri animatiile daca pleci de pe pagina,
        // dar pentru sparkle e ok sa il lasam asa momentan.
    };
  }, []); // [] inseamna ca ruleaza o singura data cand se incarca pagina

  return null; // Acest component nu deseneaza nimic vizibil, doar ruleaza scriptul
}