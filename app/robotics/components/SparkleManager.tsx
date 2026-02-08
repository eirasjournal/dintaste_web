'use client';

import { useEffect } from 'react';
import $ from 'jquery';
import { initSparkle } from '../lib/sparkle'; // Verifică calea să fie corectă

declare global {
  interface JQuery<TElement = HTMLElement> {
    sparkle_hover(options?: Record<string, unknown>): JQuery<TElement>;
    sparkle_always(options?: Record<string, unknown>): JQuery<TElement>;
  }
}

export default function SparkleManager() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initSparkle($);
    }

    const applySparkles = () => {
      // 1. CURĂȚENIE TOTALĂ (Distrugem instanțele vechi înainte să creăm altele)
      // Acest pas este crucial pentru performanță
      $(".header-sparkles, .sep1, .sep2, .list-item, .btn, .sparkley, .copy-btn").each(function() {
         if ($(this).data('sparkle-instance')) {
             $(this).trigger('destroy.sparkle');
         }
      });

      const isMobile = window.innerWidth < 820;

      const headerSettings = isMobile ? {
        color: ["#99c2ff", "#fdfdfd"],
        minSize: 8,
        maxSize: 12,
        count: 50, // Mai puține particule pe mobil = performanță
        direction: "up",
        speed: 1
      } : {
        color: ["#99c2ff", "#fdfdfd"],
        minSize: 10,
        maxSize: 16,
        count: 80, // Redus de la 120 pentru a menține FPS constant
        direction: "up",
        speed: 1.5
      };

      const decorSettings = {
        color: ["#99c2ff"],
        minSize: 8,
        maxSize: 12,
        count: 20, // Redus pentru performanță
        direction: "both",
        speed: 1
      };

      const hoverSettings = {
        color: ["#fdfdfd", "#99c2ff"],
        minSize: 4,
        maxSize: 10,
        count: 15,
        direction: "both",
        speed: 2
      };

      // 2. APLICARE NOUĂ
      ($(".header-sparkles") as JQuery<HTMLElement>).sparkle_always(headerSettings);
      ($(".sep1, .sep2") as JQuery<HTMLElement>).sparkle_hover(decorSettings);
      ($(".btn, .sparkley") as JQuery<HTMLElement>).sparkle_hover(hoverSettings);
    };

    // Inițializare
    const initTimer = setTimeout(applySparkles, 100);

    // Resize Handler Debounced
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      // Oprim totul imediat la resize ca să nu sacadeze
      $(".sparkle-canvas").hide(); 
      resizeTimer = setTimeout(applySparkles, 300);
    };

    window.addEventListener('resize', handleResize);

    // --- CLEANUP FUNCTION (Foarte important) ---
    // Asta rulează când pleci de pe pagină
    return () => {
      clearTimeout(initTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      
      // Distrugem explicit toate sclipiciurile pentru a elibera RAM-ul
      $(".header-sparkles, .sep1, .sep2, .list-item, .btn, .sparkley").trigger('destroy.sparkle');
      $('.sparkle-canvas').remove();
    };

  }, []);

  return null;
}