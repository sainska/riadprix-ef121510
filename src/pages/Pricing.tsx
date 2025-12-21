import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Check, Zap, Crown, Building2 } from "lucide-react";

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    nameFr: 'Starter',
    price: 0,
    description: 'Perfect for getting started',
    descriptionFr: 'Parfait pour commencer',
    icon: Zap,
    features: [
      { en: '1 Property', fr: '1 Propriété' },
      { en: 'Basic analytics', fr: 'Analytiques de base' },
      { en: 'Market overview', fr: 'Aperçu du marché' },
      { en: 'Email support', fr: 'Support par email' },
    ],
    cta: { en: 'Get Started', fr: 'Commencer' },
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    nameFr: 'Pro',
    price: 29,
    description: 'For growing property managers',
    descriptionFr: 'Pour les gestionnaires en croissance',
    icon: Crown,
    features: [
      { en: 'Up to 10 Properties', fr: 'Jusqu\'à 10 Propriétés' },
      { en: 'Advanced analytics', fr: 'Analytiques avancées' },
      { en: 'Price recommendations', fr: 'Recommandations de prix' },
      { en: 'Competitor analysis', fr: 'Analyse concurrentielle' },
      { en: 'Export reports (PDF/CSV)', fr: 'Export rapports (PDF/CSV)' },
      { en: 'Priority support', fr: 'Support prioritaire' },
    ],
    cta: { en: 'Upgrade to Pro', fr: 'Passer à Pro' },
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameFr: 'Enterprise',
    price: 99,
    description: 'For large portfolios',
    descriptionFr: 'Pour les grands portefeuilles',
    icon: Building2,
    features: [
      { en: 'Unlimited Properties', fr: 'Propriétés illimitées' },
      { en: 'Custom integrations', fr: 'Intégrations personnalisées' },
      { en: 'API access', fr: 'Accès API' },
      { en: 'White-label reports', fr: 'Rapports personnalisés' },
      { en: 'Dedicated account manager', fr: 'Gestionnaire de compte dédié' },
      { en: 'SLA guarantee', fr: 'Garantie SLA' },
    ],
    cta: { en: 'Contact Sales', fr: 'Contacter les ventes' },
    popular: false,
  },
];

export default function Pricing() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Pricing - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Choose the perfect plan for your vacation rental business. Flexible pricing for properties of all sizes." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {language === 'fr' ? 'Tarifs Simples et Transparents' : 'Simple, Transparent Pricing'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === 'fr' 
                ? 'Choisissez le plan qui correspond à vos besoins. Pas de frais cachés.'
                : 'Choose the plan that fits your needs. No hidden fees.'}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative border-border/50 ${
                  plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    {language === 'fr' ? 'Le plus populaire' : 'Most Popular'}
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto h-14 w-14 rounded-xl flex items-center justify-center mb-4 ${
                    plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10'
                  }`}>
                    <plan.icon className={`h-7 w-7 ${plan.popular ? '' : 'text-primary'}`} />
                  </div>
                  <CardTitle className="text-2xl">
                    {language === 'fr' ? plan.nameFr : plan.name}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? plan.descriptionFr : plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-foreground">
                      €{plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{language === 'fr' ? 'mois' : 'month'}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {language === 'fr' ? feature.fr : feature.en}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/auth?mode=register')}
                  >
                    {language === 'fr' ? plan.cta.fr : plan.cta.en}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ or additional info */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              {language === 'fr' 
                ? 'Besoin d\'une solution personnalisée ? '
                : 'Need a custom solution? '}
              <Button variant="link" className="p-0 h-auto font-semibold">
                {language === 'fr' ? 'Contactez-nous' : 'Contact us'}
              </Button>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
