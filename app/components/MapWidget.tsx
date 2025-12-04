'use client'; 
import { useEffect, useRef } from 'react';

export default function MapWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificăm dacă scriptul există deja ca să nu îl duplicăm
    // De data asta verificăm după ID-ul specific al noului serviciu
    if (containerRef.current && !document.getElementById("mmvst_globe")) {
      
      const script = document.createElement("script");
      // Adăugăm ID-ul obligatoriu cerut de MapMyVisitors
      script.id = "mmvst_globe"; 
      // Folosim https explicit pentru siguranță
      script.src = "https://mapmyvisitors.com/globe.js?d=c4LSSPOF7Fleplz6Un1s30tLd3fKYtiXWTHFnHVgj2U";
      script.type = "text/javascript";
      script.async = true;
      
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    // Setăm o înălțime minimă ca să nu fie "turtit" până se încarcă
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        minHeight: '300px', // Am pus 300px ca să aibă loc globul
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: '20px'
      }} 
    />
  );
}