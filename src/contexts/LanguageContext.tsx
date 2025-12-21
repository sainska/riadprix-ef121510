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
  'common.noData': { en: 'No data available', fr: 'Aucune donnée disponible' },
  'nav.notifications': { en: 'Notifications', fr: 'Notifications' },
  'nav.exports': { en: 'Exports', fr: 'Exports' },
  'nav.settings': { en: 'Settings', fr: 'Paramètres' },
  
  // Pricing page
  'pricing.title': { en: 'Simple, Transparent Pricing', fr: 'Tarification simple et transparente' },
  'pricing.subtitle': { en: 'Choose the plan that fits your needs', fr: 'Choisissez le plan qui correspond à vos besoins' },
  'pricing.starter': { en: 'Starter', fr: 'Débutant' },
  'pricing.pro': { en: 'Pro', fr: 'Pro' },
  'pricing.enterprise': { en: 'Enterprise', fr: 'Entreprise' },
  'pricing.perMonth': { en: '/month', fr: '/mois' },
  'pricing.getStarted': { en: 'Get Started', fr: 'Commencer' },
  'pricing.contactSales': { en: 'Contact Sales', fr: 'Contacter les ventes' },
  
  // Footer
  'footer.terms': { en: 'Terms', fr: 'Conditions' },
  'footer.privacy': { en: 'Privacy', fr: 'Confidentialité' },
  'footer.contact': { en: 'Contact', fr: 'Contact' },
  'footer.rightsReserved': { en: 'All rights reserved.', fr: 'Tous droits réservés.' },
  
  // About Page
  'about.title': { en: 'About RiadPrix', fr: 'À Propos de RiadPrix' },
  'about.mission': { en: 'Mission', fr: 'Mission' },
  'about.vision': { en: 'Vision', fr: 'Vision' },
  'about.values': { en: 'Values', fr: 'Valeurs' },
  'about.ourTeam': { en: 'Our Team', fr: 'Notre Équipe' },
  'about.propertiesTracked': { en: 'Properties Tracked', fr: 'Propriétés suivies' },
  'about.citiesCovered': { en: 'Cities Covered', fr: 'Villes couvertes' },
  'about.activeUsers': { en: 'Active Users', fr: 'Utilisateurs actifs' },
  'about.customerSatisfaction': { en: 'Customer Satisfaction', fr: 'Satisfaction client' },
  
  // Blog Page
  'blog.title': { en: 'RiadPrix Blog', fr: 'Blog RiadPrix' },
  'blog.subtitle': { en: 'Tips, insights, and trends to optimize your rental revenue', fr: 'Conseils, analyses et tendances pour optimiser vos revenus locatifs' },
  'blog.readMore': { en: 'Read More', fr: 'Lire la suite' },
  'blog.moreComing': { en: 'More articles coming soon...', fr: 'Plus d\'articles à venir...' },
  
  // Careers Page
  'careers.title': { en: 'Join Our Team', fr: 'Rejoignez Notre Équipe' },
  'careers.subtitle': { en: "Let's build the future of pricing intelligence for Moroccan hospitality together", fr: 'Construisons ensemble l\'avenir de l\'intelligence tarifaire pour l\'hospitalité marocaine' },
  'careers.benefits': { en: 'Benefits', fr: 'Avantages' },
  'careers.openPositions': { en: 'Open Positions', fr: 'Postes Ouverts' },
  'careers.apply': { en: 'Apply', fr: 'Postuler' },
  'careers.dontSeeRole': { en: "Don't see the right role?", fr: 'Vous ne trouvez pas le poste idéal ?' },
  'careers.generalApplication': { en: 'Send us your general application', fr: 'Envoyez-nous votre candidature spontanée' },
  
  // Cookies Page
  'cookies.title': { en: 'Cookie Policy', fr: 'Politique des Cookies' },
  'cookies.whatIs': { en: 'What is a Cookie?', fr: 'Qu\'est-ce qu\'un cookie ?' },
  'cookies.managePreferences': { en: 'Manage Your Preferences', fr: 'Gérer Vos Préférences' },
  'cookies.moreInfo': { en: 'More Information', fr: 'Plus d\'Informations' },
  'cookies.essential': { en: 'Essential Cookies', fr: 'Cookies Essentiels' },
  'cookies.analytics': { en: 'Analytics Cookies', fr: 'Cookies d\'Analyse' },
  'cookies.marketing': { en: 'Marketing Cookies', fr: 'Cookies Marketing' },
  'cookies.required': { en: 'Required', fr: 'Requis' },
  'cookies.savePreferences': { en: 'Save Preferences', fr: 'Enregistrer les Préférences' },
  
  // Help Center
  'help.title': { en: 'Help Center', fr: 'Centre d\'Aide' },
  'help.subtitle': { en: 'Find answers to your questions and learn how to use RiadPrix effectively', fr: 'Trouvez des réponses à vos questions et apprenez à utiliser RiadPrix efficacement' },
  'help.categories': { en: 'Categories', fr: 'Catégories' },
  'help.popularArticles': { en: 'Popular Articles', fr: 'Articles Populaires' },
  'help.needMoreHelp': { en: 'Need More Help?', fr: 'Besoin d\'Aide Supplémentaire ?' },
  'help.contactSupport': { en: 'Contact Support', fr: 'Contacter le Support' },
  'help.sendEmail': { en: 'Send Email', fr: 'Envoyer un Email' },
  
  // Documentation
  'docs.title': { en: 'Documentation', fr: 'Documentation' },
  'docs.subtitle': { en: 'Complete guide to using all RiadPrix features', fr: 'Guide complet pour utiliser toutes les fonctionnalités de RiadPrix' },
  'docs.apiDoc': { en: 'API Documentation', fr: 'Documentation API' },
  'docs.needHelp': { en: 'Need Help?', fr: 'Besoin d\'Aide ?' },
  'docs.viewApiDoc': { en: 'View API Documentation', fr: 'Voir la Documentation API' },
  
  // Features & How It Works (Index page)
  'index.features.title': { en: 'Key Features', fr: 'Fonctionnalités Principales' },
  'index.features.subtitle': { en: 'Everything you need to optimize your rental revenue', fr: 'Tout ce dont vous avez besoin pour optimiser vos revenus locatifs' },
  'index.features.benchmarking': { en: 'Price Benchmarking', fr: 'Benchmarking des Prix' },
  'index.features.benchmarkingDesc': { en: 'Compare your prices with the local market in real time', fr: 'Comparez vos prix avec le marché local en temps réel' },
  'index.features.trends': { en: 'Trend Analysis', fr: 'Analyse de Tendances' },
  'index.features.trendsDesc': { en: 'Understand seasonal trends and opportunities', fr: 'Comprenez les tendances saisonnières et les opportunités' },
  'index.features.recommendations': { en: 'Smart Recommendations', fr: 'Recommandations Intelligentes' },
  'index.features.recommendationsDesc': { en: 'Receive data-driven pricing suggestions', fr: 'Recevez des suggestions de prix basées sur les données' },
  'index.howitworks.title': { en: 'How It Works', fr: 'Comment Ça Marche' },
  'index.howitworks.subtitle': { en: 'In three simple steps, start optimizing your revenue', fr: 'En trois étapes simples, commencez à optimiser vos revenus' },
  'index.howitworks.step1': { en: 'Create Your Account', fr: 'Créez Votre Compte' },
  'index.howitworks.step1Desc': { en: 'Sign up for free and add your properties', fr: 'Inscrivez-vous gratuitement et ajoutez vos propriétés' },
  'index.howitworks.step2': { en: 'Analyze the Market', fr: 'Analysez le Marché' },
  'index.howitworks.step2Desc': { en: 'View benchmarks and trends for your city', fr: 'Consultez les benchmarks et tendances de votre ville' },
  'index.howitworks.step3': { en: 'Optimize Your Prices', fr: 'Optimisez Vos Prix' },
  'index.howitworks.step3Desc': { en: 'Apply our recommendations and maximize your revenue', fr: 'Appliquez nos recommandations et maximisez vos revenus' },
  'index.dashboard.title': { en: 'Your Market Intelligence Dashboard', fr: 'Votre Tableau de Bord Intelligence Marché' },
  'index.dashboard.subtitle': { en: 'Analyze market trends, compare your prices and optimize your rental revenue in real time.', fr: 'Analysez les tendances du marché, comparez vos prix et optimisez vos revenus locatifs en temps réel.' },
  'index.cta.title': { en: 'Ready to optimize your revenue?', fr: 'Prêt à optimiser vos revenus?' },
  'index.cta.subtitle': { en: 'Join over 70,000 property owners using RiadPrix to maximize their rental revenue.', fr: 'Rejoignez plus de 70,000 propriétaires qui utilisent RiadPrix pour maximiser leurs revenus locatifs.' },
  'index.cta.startNow': { en: 'Get Started Now', fr: 'Démarrer Maintenant' },
  'index.cta.requestDemo': { en: 'Request a Demo', fr: 'Demander une Démo' },
  'index.cta.freeTrial': { en: '14-day free trial', fr: 'Essai gratuit 14 jours' },
  'index.cta.noCard': { en: 'No credit card required', fr: 'Sans carte bancaire' },
  
  // Settings
  'settings.title': { en: 'Settings', fr: 'Paramètres' },
  'settings.appearance': { en: 'Appearance', fr: 'Apparence' },
  'settings.language': { en: 'Language', fr: 'Langue' },
  'settings.theme': { en: 'Theme', fr: 'Thème' },
  'settings.light': { en: 'Light', fr: 'Clair' },
  'settings.dark': { en: 'Dark', fr: 'Sombre' },
  'settings.notifications': { en: 'Notifications', fr: 'Notifications' },
  
  // Admin
  'admin.dashboard': { en: 'Admin Dashboard', fr: 'Administration' },
  'admin.roleManagement': { en: 'Role Management', fr: 'Gestion des rôles' },
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
    // Update HTML lang attribute for accessibility
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
    }
  };
  
  // Initialize language attribute on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

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
