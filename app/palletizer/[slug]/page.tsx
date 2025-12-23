import React from 'react';
import { SIMULATIONS } from '../data';
import ClientPage from './ClientPage'; // Importăm componenta client creată mai sus

// 1. GENERARE STATICĂ (Server Side)
export async function generateStaticParams() {
  return SIMULATIONS.map((sim) => ({
    slug: sim.slug,
  }));
}

// 2. Definirea Props
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 3. Pagina de Server
export default async function SimulationPage({ params }: PageProps) {
  // În Server Components putem folosi await direct pe params
  const resolvedParams = await params;
  
  // Pasăm slug-ul către componenta de Client care se ocupă de randare
  return <ClientPage slug={resolvedParams.slug} />;
}