'use client';

import { useEffect } from 'react';
import $ from 'jquery';
import { initSparkle } from '../lib/sparkle';

declare global {
  interface JQuery<TElement = HTMLElement> {
    sparkle_hover(options?: Record<string, unknown>): JQuery<TElement>;
    sparkle_always(options?: Record<string, unknown>): JQuery<TElement>;
  }
}

export default function SparkleManager() {
  useEffect(() => {
    // 1. Inițializăm pluginul jQuery
    if (typeof window !== 'undefined') {
      initSparkle($);
    }

    // Funcția care aplică sclipiciul în funcție de ecran
    const applySparkles = () => {
      // A. CURĂȚENIE: Ștergem sclipiciul vechi ca să nu se dubleze la resize
      $('.sparkle-canvas').remove();

      // B. DETECTĂM MĂRIMEA ECRANULUI
      const isMobile = window.innerWidth < 820;

      // C. DEFINIM SETĂRILE (Mic pe mobil, Mare pe Desktop)
      
      // Setări pentru HEADER (Active mereu)
      const headerSettings = isMobile ? {
        color: ["#e0e0e0", "#fe98ff"],
        minSize: 6,     // Mai mic pe mobil
        maxSize: 10,
        count: 150,      // Mai puține particule
        direction: "up",
        speed: 1.5
      } : {
        color: ["#e0e0e0", "#fe98ff"],
        minSize: 8,     // Mare pe desktop
        maxSize: 16,
        count: 200,
        direction: "up",
        speed: 2
      };

      // Setări pentru DECORAȚIUNI (Separatoare, zig-zag - Active mereu)
      const decorSettings = isMobile ? {
        color: ["#e0e0e0", "#fe98ff"], // Am pus rozul tău neon aici
        minSize: 6,
        maxSize: 10,
        count: 60,
        direction: "both",
        speed: 1
      } : {
        color: ["#e0e0e0", "#fe98ff"],
        minSize: 6,
        maxSize: 10,
        count: 30,
        direction: "both",
        speed: 2
      };

      // Setări pentru HOVER (Meniu, Butoane)
      const hoverSettings = {
        color: ["#e0e0e0", "#fe98ff"],
        minSize: isMobile ? 3 : 5,
        maxSize: isMobile ? 6 : 9,
        count: 20,
        direction: "both",
        speed: 2
      };

      // D. APLICĂM EFECTELE PE ELEMENTE

      // MODIFICARE AICI: Țintim clasa nouă
      ($(".header-sparkles") as JQuery<HTMLElement>).sparkle_always(headerSettings);

      // 2. Elemente Decorative (Zig-Zag, Separatoare - Always active)
      // Am adăugat și clasele zig-zag pe care le ai în design
      ($(".sep1, .sep2") as JQuery<HTMLElement>).sparkle_hover(decorSettings);

      // 3. Elemente Interactive (Hover)
      ($(".list-item, .btn, .sparkley") as JQuery<HTMLElement>).sparkle_hover(hoverSettings);
    };

    // --- EXECUȚIE ---

    // 1. Pornim imediat ce se încarcă (cu mică întârziere pentru siguranță)
    const initTimer = setTimeout(applySparkles, 100);

    // 2. Ascultăm Resize-ul ferestrei (Re-calculăm când tragi de browser)
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      // Așteptăm 300ms după ce termini de redimensionat ca să nu sacadeze
      resizeTimer = setTimeout(applySparkles, 300);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup la ieșirea din pagină
    return () => {
      clearTimeout(initTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      $('.sparkle-canvas').remove();
    };

  }, []);

  return null;
}