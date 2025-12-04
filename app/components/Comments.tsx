'use client';

import Giscus from '@giscus/react';

export default function Comments() {
  return (
    <div style={{ marginTop: '50px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '15px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Comentarii</h2>
      <Giscus
        id="comments"
        repo="eirasjournal/dintaste" // <-- Pune aici datele tale
        repoId="R_kgDOQiwAEA"            // <-- De pe giscus.app
        category="General"
        categoryId="DIC_kwDOQiwAEM4CzaFe"      // <-- De pe giscus.app
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="purple_dark"              // Tema intunecata
        lang="ro"
        loading="lazy"
      />
    </div>
  );
}