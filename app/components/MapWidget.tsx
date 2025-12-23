'use client'; 
import { useEffect, useRef } from 'react';

export default function MapWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    
    if (container) {
       container.innerHTML = "";
    }

    const script = document.createElement("script");
    script.id = "mapmyvisitors"; 
    script.src = "https://mapmyvisitors.com/map.js?cl=fdfdfd&w=a&t=n&d=q6goPNzI_ouLI-M22B5dKzBaC_hdjd9R79wu2IxymG8&co=222222&cmo=555555&cmn=99c2ff";
    script.type = "text/javascript";
    script.async = true;

    if(container) {
        container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        minHeight: '200px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: '30px',
        marginBottom: '10px',
        overflow: 'hidden' // Important pentru a tăia excesul dacă CSS-ul nu prinde instant
      }} 
    >
      {/* Adăugăm CSS Global doar pentru acest widget.
         Asta forțează imaginea generată să se scaleze automat (responsive).
      */}
      <style jsx global>{`
        /* Țintim elementul generat de script (care are id-ul scriptului sau similar) */
        #mapmyvisitors { 
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
        }
        
        /* Țintim imaginea din interiorul widgetului, just in case */
        #mapmyvisitors img {
          max-width: 100% !important;
          height: auto !important;
        }
        
        /* Uneori scriptul creează un canvas */
        #mapmyvisitors canvas {
          max-width: 100% !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
}