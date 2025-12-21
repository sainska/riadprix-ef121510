import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Target, Users, TrendingUp, Heart, Award } from 'lucide-react';

export default function About() {
  const { language, t } = useLanguage();

  const values = [
    {
      icon: Target,
      title: t('about.mission'),
      description: language === 'fr' 
        ? 'Aider les propriétaires de riads au Maroc à optimiser leurs revenus grâce à des données de marché précises.'
        : 'Help riad owners in Morocco optimize their revenue through accurate market data.',
    },
    {
      icon: Heart,
      title: t('about.vision'),
      description: language === 'fr'
        ? 'Devenir la plateforme de référence pour l\'intelligence tarifaire dans l\'hospitalité marocaine.'
        : 'Become the leading platform for pricing intelligence in Moroccan hospitality.',
    },
    {
      icon: Award,
      title: t('about.values'),
      description: language === 'fr'
        ? 'Transparence, précision et innovation au service de l\'hospitalité marocaine.'
        : 'Transparency, accuracy, and innovation in service of Moroccan hospitality.',
    },
  ];

  const stats = [
    { label: t('about.propertiesTracked'), value: '5,000+' },
    { label: t('about.citiesCovered'), value: '10+' },
    { label: t('about.activeUsers'), value: '500+' },
    { label: t('about.customerSatisfaction'), value: '98%' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Learn about RiadPrix and our mission to help Moroccan property owners optimize their rental revenue." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 via-background to-teal/5">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {t('about.title')}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {language === 'fr'
                    ? 'Nous sommes une plateforme dédiée à l\'optimisation des revenus locatifs pour les propriétaires de riads et propriétés touristiques au Maroc. Notre mission est de fournir des données de marché précises et des recommandations tarifaires intelligentes.'
                    : 'We are a platform dedicated to optimizing rental revenue for riad owners and tourist properties in Morocco. Our mission is to provide accurate market data and intelligent pricing recommendations.'}
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 border-b border-border">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {t('about.mission')}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'fr'
                    ? 'Ce qui nous guide dans notre travail quotidien'
                    : 'What guides us in our daily work'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {values.map((value, idx) => {
                  const Icon = value.icon;
                  return (
                    <Card key={idx} className="border-border/50">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {t('about.ourTeam')}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {language === 'fr'
                    ? 'Une équipe passionnée dédiée à votre succès'
                    : 'A passionate team dedicated to your success'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-border/50">
                      <CardContent className="pt-6">
                        <div className="h-20 w-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                          <Users className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">
                          {language === 'fr' ? 'Équipe' : 'Team'} {i}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === 'fr' ? 'Membre de l\'équipe' : 'Team member'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
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

