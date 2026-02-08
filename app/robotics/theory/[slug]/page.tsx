import React from 'react';
import { THEORY_ARTICLES } from '../data';
import ClientPage from './ClientPage';

// 1. GENERARE STATICĂ (Server Side)
export async function generateStaticParams() {
  return THEORY_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

// 2. Definirea Props
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 3. Pagina de Server
export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ClientPage slug={resolvedParams.slug} />;
}