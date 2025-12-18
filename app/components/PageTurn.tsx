"use client";

import { motion } from "framer-motion";

export default function PageTurn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ 
        rotateY: -90, // Pornește "închisă" la 90 de grade (invizibilă)
        opacity: 0, 
        transformOrigin: "left center" // Se rotește ca o carte, de la stânga
      }}
      animate={{ 
        rotateY: 0, // Se deschide la 0 grade (plat)
        opacity: 1 
      }}
      exit={{ 
        rotateY: 90, // Dacă am folosi AnimatePresence pe layout
        opacity: 0 
      }}
      transition={{ 
        duration: 0.8, // Durata "răsfoirii"
        ease: [0.16, 1, 0.3, 1], // Un efect de încetinire natural (bezier)
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      style={{ 
        width: "100%", 
        height: "100%",
        transformStyle: "preserve-3d" // Esențial pentru efectul 3D
      }}
    >
      {children}
    </motion.div>
  );
}