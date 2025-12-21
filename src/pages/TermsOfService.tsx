import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsOfService() {
  const { language } = useLanguage();
  
  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl flex-1">
          <h1 className="text-3xl font-bold mb-8">
            {language === 'fr' ? 'Conditions d\'Utilisation' : 'Terms of Service'}
          </h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <p>
              {language === 'fr'
                ? 'Cette page décrit les règles et accords légaux pour l\'utilisation de la plateforme RiadPrix. Plus de contenu sera ajouté prochainement.'
                : 'This page will describe the rules and legal agreements for use of the RiadPrix platform. More content will be added soon.'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

