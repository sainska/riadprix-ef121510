import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Clock, Briefcase, Mail } from 'lucide-react';

const jobOpenings = [
  {
    id: '1',
    title: {
      en: 'Senior Full-Stack Developer',
      fr: 'Développeur Full-Stack Senior',
    },
    department: { en: 'Engineering', fr: 'Ingénierie' },
    location: { en: 'Remote / Marrakech', fr: 'Distant / Marrakech' },
    type: { en: 'Full-time', fr: 'Temps plein' },
    description: {
      en: 'We are looking for an experienced full-stack developer to join our engineering team.',
      fr: 'Nous recherchons un développeur full-stack expérimenté pour rejoindre notre équipe d\'ingénierie.',
    },
  },
  {
    id: '2',
    title: {
      en: 'Data Analyst',
      fr: 'Analyste de Données',
    },
    department: { en: 'Data', fr: 'Données' },
    location: { en: 'Remote / Casablanca', fr: 'Distant / Casablanca' },
    type: { en: 'Full-time', fr: 'Temps plein' },
    description: {
      en: 'Join our data team to analyze market trends and help property owners make better decisions.',
      fr: 'Rejoignez notre équipe de données pour analyser les tendances du marché et aider les propriétaires à prendre de meilleures décisions.',
    },
  },
  {
    id: '3',
    title: {
      en: 'Customer Success Manager',
      fr: 'Responsable Succès Client',
    },
    department: { en: 'Customer Success', fr: 'Succès Client' },
    location: { en: 'Marrakech', fr: 'Marrakech' },
    type: { en: 'Full-time', fr: 'Temps plein' },
    description: {
      en: 'Help our customers succeed and get the most value from RiadPrix.',
      fr: 'Aidez nos clients à réussir et à tirer le meilleur parti de RiadPrix.',
    },
  },
];

const benefits = [
  { en: 'Competitive salary', fr: 'Salaire compétitif' },
  { en: 'Remote work options', fr: 'Options de travail à distance' },
  { en: 'Health insurance', fr: 'Assurance maladie' },
  { en: 'Professional development', fr: 'Développement professionnel' },
  { en: 'Flexible hours', fr: 'Horaires flexibles' },
];

export default function Careers() {
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Careers - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Join the RiadPrix team and help shape the future of property management in Morocco." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 via-background to-teal/5">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  {language === 'fr' ? 'Rejoignez Notre Équipe' : 'Join Our Team'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {language === 'fr'
                    ? 'Construisons ensemble l\'avenir de l\'intelligence tarifaire pour l\'hospitalité marocaine'
                    : 'Let\'s build the future of pricing intelligence for Moroccan hospitality together'}
                </p>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 border-b border-border">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                {language === 'fr' ? 'Avantages' : 'Benefits'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="text-center p-4 rounded-lg bg-card border border-border/50">
                    <p className="text-sm font-medium text-foreground">{benefit[language]}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Job Openings */}
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {language === 'fr' ? 'Postes Ouverts' : 'Open Positions'}
              </h2>
              <div className="space-y-4 max-w-4xl">
                {jobOpenings.map((job) => (
                  <Card key={job.id} className="border-border/50 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{job.title[language]}</CardTitle>
                            <Badge variant="secondary">{job.department[language]}</Badge>
                          </div>
                          <CardDescription className="mb-4">
                            {job.description[language]}
                          </CardDescription>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {job.location[language]}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {job.type[language]}
                            </div>
                          </div>
                        </div>
                        <Button variant="default" className="gap-2">
                          <Briefcase className="h-4 w-4" />
                          {language === 'fr' ? 'Postuler' : 'Apply'}
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* General Application */}
              <Card className="mt-8 border-border/50 bg-secondary/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'fr' ? 'Vous ne trouvez pas le poste idéal ?' : 'Don\'t see the right role?'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'fr'
                        ? 'Envoyez-nous votre candidature spontanée'
                        : 'Send us your general application'}
                    </p>
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      {language === 'fr' ? 'Candidature Spontanée' : 'General Application'}
                    </Button>
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

