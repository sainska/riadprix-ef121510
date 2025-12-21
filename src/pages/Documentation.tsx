import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Book, Code, Zap, Shield, BarChart3, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const docSections = [
  {
    icon: Zap,
    title: { en: 'Quick Start', fr: 'Démarrage Rapide' },
    description: { en: 'Get up and running in minutes', fr: 'Démarrez en quelques minutes' },
    articles: [
      { en: 'Creating your account', fr: 'Créer votre compte' },
      { en: 'Adding your first property', fr: 'Ajouter votre première propriété' },
      { en: 'Understanding the dashboard', fr: 'Comprendre le tableau de bord' },
    ],
  },
  {
    icon: BarChart3,
    title: { en: 'Analytics & Reports', fr: 'Analytiques et Rapports' },
    description: { en: 'Learn about data and insights', fr: 'Découvrez les données et insights' },
    articles: [
      { en: 'Reading market benchmarks', fr: 'Lire les benchmarks de marché' },
      { en: 'Understanding seasonality trends', fr: 'Comprendre les tendances saisonnières' },
      { en: 'Exporting reports', fr: 'Exporter des rapports' },
    ],
  },
  {
    icon: Settings,
    title: { en: 'Settings & Configuration', fr: 'Paramètres et Configuration' },
    description: { en: 'Customize your experience', fr: 'Personnalisez votre expérience' },
    articles: [
      { en: 'Account settings', fr: 'Paramètres du compte' },
      { en: 'Notification preferences', fr: 'Préférences de notification' },
      { en: 'Language and theme', fr: 'Langue et thème' },
    ],
  },
  {
    icon: Code,
    title: { en: 'API Documentation', fr: 'Documentation API' },
    description: { en: 'Integrate with RiadPrix', fr: 'Intégrez avec RiadPrix' },
    articles: [
      { en: 'API overview', fr: 'Vue d\'ensemble de l\'API' },
      { en: 'Authentication', fr: 'Authentification' },
      { en: 'Endpoints reference', fr: 'Référence des endpoints' },
    ],
  },
];

export default function Documentation() {
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Documentation - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Complete documentation for using RiadPrix features and API." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 via-background to-teal/5">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Book className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {language === 'fr' ? 'Documentation' : 'Documentation'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {language === 'fr'
                    ? 'Guide complet pour utiliser toutes les fonctionnalités de RiadPrix'
                    : 'Complete guide to using all RiadPrix features'}
                </p>
              </div>
            </div>
          </section>

          {/* Documentation Sections */}
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {docSections.map((section, idx) => {
                  const Icon = section.icon;
                  return (
                    <Card key={idx} className="border-border/50 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{section.title[language]}</CardTitle>
                        <CardDescription>{section.description[language]}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-4">
                          {section.articles.map((article, articleIdx) => (
                            <li key={articleIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ArrowRight className="h-3 w-3" />
                              {article[language]}
                            </li>
                          ))}
                        </ul>
                        <Button variant="ghost" size="sm" className="w-full gap-2">
                          {language === 'fr' ? 'En savoir plus' : 'Learn More'}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* API Section */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4 lg:px-8">
              <Card className="border-border/50 max-w-4xl mx-auto">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Code className="h-6 w-6 text-primary" />
                    <CardTitle>{language === 'fr' ? 'Documentation API' : 'API Documentation'}</CardTitle>
                  </div>
                  <CardDescription>
                    {language === 'fr'
                      ? 'Intégrez RiadPrix dans vos applications'
                      : 'Integrate RiadPrix into your applications'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {language === 'fr'
                      ? 'Notre API REST vous permet d\'accéder aux données de marché, benchmarks et recommandations de prix programmatiquement.'
                      : 'Our REST API allows you to access market data, benchmarks, and pricing recommendations programmatically.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">REST API</Badge>
                    <Badge variant="secondary">JSON</Badge>
                    <Badge variant="secondary">OAuth 2.0</Badge>
                    <Badge variant="secondary">Rate Limited</Badge>
                  </div>
                  <Button variant="default" className="gap-2">
                    {language === 'fr' ? 'Voir la Documentation API' : 'View API Documentation'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Getting Help */}
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {language === 'fr' ? 'Besoin d\'Aide ?' : 'Need Help?'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'fr'
                    ? 'Si vous ne trouvez pas ce que vous cherchez, notre équipe est là pour vous aider'
                    : 'If you can\'t find what you\'re looking for, our team is here to help'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="default" asChild>
                    <Link to="/help">
                      {language === 'fr' ? 'Centre d\'Aide' : 'Help Center'}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contact">
                      {language === 'fr' ? 'Nous Contacter' : 'Contact Us'}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

