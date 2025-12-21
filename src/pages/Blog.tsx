import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: '1',
    title: {
      en: 'How to Optimize Your Riad Pricing for Peak Season',
      fr: 'Comment Optimiser le Prix de Votre Riad pour la Haute Saison',
    },
    excerpt: {
      en: 'Learn the best strategies for pricing your riad during peak tourist seasons in Morocco.',
      fr: 'Découvrez les meilleures stratégies pour tarifer votre riad pendant les saisons touristiques au Maroc.',
    },
    date: '2024-01-15',
    readTime: '5 min',
    category: { en: 'Pricing', fr: 'Tarification' },
    image: '📊',
  },
  {
    id: '2',
    title: {
      en: 'Market Trends: Marrakech vs Fes Rental Markets',
      fr: 'Tendances du Marché : Marrakech vs Fès',
    },
    excerpt: {
      en: 'A comprehensive comparison of rental market dynamics between two major Moroccan cities.',
      fr: 'Une comparaison complète de la dynamique du marché locatif entre deux grandes villes marocaines.',
    },
    date: '2024-01-10',
    readTime: '7 min',
    category: { en: 'Market Analysis', fr: 'Analyse de Marché' },
    image: '📈',
  },
  {
    id: '3',
    title: {
      en: '5 Tips for Increasing Your Property Occupancy Rate',
      fr: '5 Conseils pour Augmenter Votre Taux d\'Occupation',
    },
    excerpt: {
      en: 'Practical advice to help you maximize bookings and revenue throughout the year.',
      fr: 'Des conseils pratiques pour vous aider à maximiser les réservations et les revenus tout au long de l\'année.',
    },
    date: '2024-01-05',
    readTime: '6 min',
    category: { en: 'Tips', fr: 'Conseils' },
    image: '💡',
  },
];

export default function Blog() {
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Blog - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Read articles and insights about property management, pricing strategies, and market trends in Morocco." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 via-background to-teal/5">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {language === 'fr' ? 'Blog RiadPrix' : 'RiadPrix Blog'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {language === 'fr'
                    ? 'Conseils, analyses et tendances pour optimiser vos revenus locatifs'
                    : 'Tips, insights, and trends to optimize your rental revenue'}
                </p>
              </div>
            </div>
          </section>

          {/* Blog Posts */}
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="border-border/50 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="text-4xl mb-4">{post.image}</div>
                      <Badge variant="secondary" className="w-fit mb-2">
                        {post.category[language]}
                      </Badge>
                      <CardTitle className="text-xl mb-2">
                        {post.title[language]}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt[language]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full gap-2" asChild>
                        <Link to={`/blog/${post.id}`}>
                          {language === 'fr' ? 'Lire la suite' : 'Read More'}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Empty State for More Posts */}
              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {language === 'fr' ? 'Plus d\'articles à venir...' : 'More articles coming soon...'}
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

