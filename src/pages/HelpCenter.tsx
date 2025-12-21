import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, BookOpen, MessageCircle, Video, FileText, HelpCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    icon: BookOpen,
    title: { en: 'Getting Started', fr: 'Pour Commencer' },
    description: { en: 'Learn the basics of RiadPrix', fr: 'Apprenez les bases de RiadPrix' },
    articles: 5,
    href: '/help/getting-started',
  },
  {
    icon: FileText,
    title: { en: 'Account & Billing', fr: 'Compte et Facturation' },
    description: { en: 'Manage your account and subscription', fr: 'Gérez votre compte et abonnement' },
    articles: 8,
    href: '/help/account',
  },
  {
    icon: MessageCircle,
    title: { en: 'Properties', fr: 'Propriétés' },
    description: { en: 'Add and manage your properties', fr: 'Ajoutez et gérez vos propriétés' },
    articles: 12,
    href: '/help/properties',
  },
  {
    icon: Video,
    title: { en: 'Analytics & Reports', fr: 'Analytiques et Rapports' },
    description: { en: 'Understand your data and reports', fr: 'Comprenez vos données et rapports' },
    articles: 10,
    href: '/help/analytics',
  },
];

const popularArticles = [
  {
    id: '1',
    title: {
      en: 'How to add your first property',
      fr: 'Comment ajouter votre première propriété',
    },
    category: { en: 'Properties', fr: 'Propriétés' },
  },
  {
    id: '2',
    title: {
      en: 'Understanding price benchmarks',
      fr: 'Comprendre les benchmarks de prix',
    },
    category: { en: 'Analytics', fr: 'Analytiques' },
  },
  {
    id: '3',
    title: {
      en: 'Exporting reports to PDF',
      fr: 'Exporter des rapports en PDF',
    },
    category: { en: 'Reports', fr: 'Rapports' },
  },
  {
    id: '4',
    title: {
      en: 'Changing your subscription plan',
      fr: 'Changer votre plan d\'abonnement',
    },
    category: { en: 'Billing', fr: 'Facturation' },
  },
];

export default function HelpCenter() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Helmet>
        <title>Help Center - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Find answers to common questions and learn how to use RiadPrix effectively." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 via-background to-teal/5">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {language === 'fr' ? 'Centre d\'Aide' : 'Help Center'}
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {language === 'fr'
                    ? 'Trouvez des réponses à vos questions et apprenez à utiliser RiadPrix efficacement'
                    : 'Find answers to your questions and learn how to use RiadPrix effectively'}
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={language === 'fr' ? 'Rechercher dans l\'aide...' : 'Search help articles...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {language === 'fr' ? 'Catégories' : 'Categories'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <Card key={idx} className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
                      <Link to={category.href}>
                        <CardHeader>
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{category.title[language]}</CardTitle>
                          <CardDescription>{category.description[language]}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {category.articles} {language === 'fr' ? 'articles' : 'articles'}
                          </p>
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Popular Articles */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {language === 'fr' ? 'Articles Populaires' : 'Popular Articles'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                {popularArticles.map((article) => (
                  <Card key={article.id} className="border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Badge variant="secondary" className="mb-2">
                            {article.category[language]}
                          </Badge>
                          <h3 className="font-semibold text-foreground mb-2">
                            {article.title[language]}
                          </h3>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {language === 'fr' ? 'Besoin d\'Aide Supplémentaire ?' : 'Need More Help?'}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {language === 'fr'
                        ? 'Notre équipe de support est là pour vous aider'
                        : 'Our support team is here to help you'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="default" asChild>
                        <Link to="/contact">
                          {language === 'fr' ? 'Contacter le Support' : 'Contact Support'}
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="mailto:support@riadprix.com">
                          {language === 'fr' ? 'Envoyer un Email' : 'Send Email'}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

