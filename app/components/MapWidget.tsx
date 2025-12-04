'use client'; 
import { useEffect, useRef } from 'react';

export default function MapWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    // 1. Curățăm containerul ca să nu avem dubluri la re-randare
    if (container) {
       container.innerHTML = "";
    }

    // 2. Creăm elementul script
    const script = document.createElement("script");
    // Noul ID cerut de scriptul plat
    script.id = "mapmyvisitors"; 
    // Noul link generat de tine
    script.src = "https://mapmyvisitors.com/map.js?cl=fe98ff&w=a&t=n&d=q6goPNzI_ouLI-M22B5dKzBaC_hdjd9R79wu2IxymG8&co=341c74&ct=ffffff&cmo=221f38&cmn=ffffff";
    script.type = "text/javascript";
    script.async = true;

    // 3. Îl "plantăm" în container
    if(container) {
        container.appendChild(script);
    }

    // 4. Curățenie la ieșirea de pe pagină
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
        // Hărțile plate sunt de obicei mai scunde, 
        // dar lăsăm minHeight ca să nu sară layout-ul
        minHeight: '200px', 
        
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: '30px',
        marginBottom: '30px',
        
        // Am scos 'pointerEvents: none' ca să poți vedea tooltip-ul cu numărul de vizite
        // Am scos 'overflow: hidden' pentru că harta plată se scalează mai bine
      }} 
    />
  );
}