import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

// Translation dictionary
export const translations: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', fr: 'Tableau de bord' },
  'nav.markets': { en: 'Markets', fr: 'Marchés' },
  'nav.properties': { en: 'Properties', fr: 'Propriétés' },
  'nav.pricing': { en: 'Pricing', fr: 'Tarification' },
  'nav.reports': { en: 'Reports', fr: 'Rapports' },
  'nav.account': { en: 'Account', fr: 'Compte' },
  'nav.logout': { en: 'Logout', fr: 'Déconnexion' },
  'nav.login': { en: 'Login', fr: 'Connexion' },
  'nav.register': { en: 'Register', fr: "S'inscrire" },
  
  // Auth
  'auth.login': { en: 'Login', fr: 'Connexion' },
  'auth.register': { en: 'Create Account', fr: 'Créer un compte' },
  'auth.email': { en: 'Email', fr: 'Email' },
  'auth.password': { en: 'Password', fr: 'Mot de passe' },
  'auth.confirmPassword': { en: 'Confirm Password', fr: 'Confirmer le mot de passe' },
  'auth.fullName': { en: 'Full Name', fr: 'Nom complet' },
  'auth.forgotPassword': { en: 'Forgot Password?', fr: 'Mot de passe oublié ?' },
  'auth.resetPassword': { en: 'Reset Password', fr: 'Réinitialiser le mot de passe' },
  'auth.sendResetLink': { en: 'Send Reset Link', fr: 'Envoyer le lien' },
  'auth.backToLogin': { en: 'Back to Login', fr: 'Retour à la connexion' },
  'auth.noAccount': { en: "Don't have an account?", fr: "Vous n'avez pas de compte ?" },
  'auth.haveAccount': { en: 'Already have an account?', fr: 'Vous avez déjà un compte ?' },
  'auth.orContinueWith': { en: 'Or continue with', fr: 'Ou continuer avec' },
  'auth.magicLink': { en: 'Send Magic Link', fr: 'Envoyer le lien magique' },
  'auth.magicLinkSent': { en: 'Check your email for the magic link!', fr: 'Vérifiez votre email pour le lien magique !' },
  'auth.resetLinkSent': { en: 'Password reset link sent to your email', fr: 'Lien de réinitialisation envoyé à votre email' },
  'auth.newPassword': { en: 'New Password', fr: 'Nouveau mot de passe' },
  'auth.updatePassword': { en: 'Update Password', fr: 'Mettre à jour le mot de passe' },
  'auth.passwordUpdated': { en: 'Password updated successfully!', fr: 'Mot de passe mis à jour avec succès !' },
  
  // Dashboard
  'dashboard.title': { en: 'Market Dashboard', fr: 'Tableau de bord du marché' },
  'dashboard.overview': { en: 'Overview', fr: 'Vue d\'ensemble' },
  'dashboard.avgPrice': { en: 'Average Price', fr: 'Prix moyen' },
  'dashboard.occupancy': { en: 'Occupancy Rate', fr: "Taux d'occupation" },
  'dashboard.listings': { en: 'Total Listings', fr: 'Annonces totales' },
  'dashboard.revenue': { en: 'Estimated Revenue', fr: 'Revenu estimé' },
  'dashboard.priceRange': { en: 'Price Range', fr: 'Fourchette de prix' },
  'dashboard.min': { en: 'Min', fr: 'Min' },
  'dashboard.median': { en: 'Median', fr: 'Médian' },
  'dashboard.max': { en: 'Max', fr: 'Max' },
  'dashboard.yourPrice': { en: 'Your Price', fr: 'Votre prix' },
  'dashboard.seasonality': { en: 'Seasonality Trends', fr: 'Tendances saisonnières' },
  'dashboard.recommendations': { en: 'AI Recommendations', fr: 'Recommandations IA' },
  
  // Properties
  'properties.title': { en: 'My Properties', fr: 'Mes propriétés' },
  'properties.add': { en: 'Add Property', fr: 'Ajouter une propriété' },
  'properties.edit': { en: 'Edit Property', fr: 'Modifier la propriété' },
  'properties.name': { en: 'Property Name', fr: 'Nom de la propriété' },
  'properties.type': { en: 'Property Type', fr: 'Type de propriété' },
  'properties.city': { en: 'City', fr: 'Ville' },
  'properties.neighborhood': { en: 'Neighborhood', fr: 'Quartier' },
  'properties.bedrooms': { en: 'Bedrooms', fr: 'Chambres' },
  'properties.bathrooms': { en: 'Bathrooms', fr: 'Salles de bain' },
  'properties.guests': { en: 'Max Guests', fr: 'Invités max' },
  'properties.currentPrice': { en: 'Current Price', fr: 'Prix actuel' },
  
  // Hero
  'hero.title': { en: 'Smart Pricing for Moroccan Riads', fr: 'Tarification intelligente pour les Riads marocains' },
  'hero.subtitle': { en: 'Benchmark your prices against competitors on Airbnb and Booking.com. Maximize your revenue with data-driven insights.', fr: 'Comparez vos prix avec la concurrence sur Airbnb et Booking.com. Maximisez vos revenus avec des analyses basées sur les données.' },
  'hero.cta': { en: 'Start Free Trial', fr: 'Essai gratuit' },
  'hero.demo': { en: 'View Demo', fr: 'Voir la démo' },
  
  // Common
  'common.save': { en: 'Save', fr: 'Enregistrer' },
  'common.cancel': { en: 'Cancel', fr: 'Annuler' },
  'common.delete': { en: 'Delete', fr: 'Supprimer' },
  'common.loading': { en: 'Loading...', fr: 'Chargement...' },
  'common.error': { en: 'Error', fr: 'Erreur' },
  'common.success': { en: 'Success', fr: 'Succès' },
  'common.export': { en: 'Export', fr: 'Exporter' },
  'common.filter': { en: 'Filter', fr: 'Filtrer' },
  'common.search': { en: 'Search', fr: 'Rechercher' },
  
  // Pricing page
  'pricing.title': { en: 'Simple, Transparent Pricing', fr: 'Tarification simple et transparente' },
  'pricing.subtitle': { en: 'Choose the plan that fits your needs', fr: 'Choisissez le plan qui correspond à vos besoins' },
  'pricing.starter': { en: 'Starter', fr: 'Débutant' },
  'pricing.pro': { en: 'Pro', fr: 'Pro' },
  'pricing.enterprise': { en: 'Enterprise', fr: 'Entreprise' },
  'pricing.perMonth': { en: '/month', fr: '/mois' },
  'pricing.getStarted': { en: 'Get Started', fr: 'Commencer' },
  'pricing.contactSales': { en: 'Contact Sales', fr: 'Contacter les ventes' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('riadprix-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('riadprix-language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
