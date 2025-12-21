import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { Cookie, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Cookies() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
  });

  const handleSavePreferences = () => {
    localStorage.setItem('riadprix-cookie-preferences', JSON.stringify(preferences));
    toast({
      title: language === 'fr' ? 'Préférences enregistrées' : 'Preferences Saved',
      description: language === 'fr' ? 'Vos préférences de cookies ont été enregistrées' : 'Your cookie preferences have been saved',
    });
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: {
        en: 'Essential Cookies',
        fr: 'Cookies Essentiels',
      },
      description: {
        en: 'Required for the website to function properly. These cannot be disabled.',
        fr: 'Nécessaires au bon fonctionnement du site web. Ils ne peuvent pas être désactivés.',
      },
      required: true,
    },
    {
      id: 'analytics',
      title: {
        en: 'Analytics Cookies',
        fr: 'Cookies d\'Analyse',
      },
      description: {
        en: 'Help us understand how visitors interact with our website by collecting anonymous information.',
        fr: 'Nous aident à comprendre comment les visiteurs interagissent avec notre site web en collectant des informations anonymes.',
      },
      required: false,
    },
    {
      id: 'marketing',
      title: {
        en: 'Marketing Cookies',
        fr: 'Cookies Marketing',
      },
      description: {
        en: 'Used to track visitors across websites to display relevant advertisements.',
        fr: 'Utilisés pour suivre les visiteurs sur les sites web afin d\'afficher des publicités pertinentes.',
      },
      required: false,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Cookie Policy - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Learn about how RiadPrix uses cookies and manage your cookie preferences." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl flex-1">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {language === 'fr' ? 'Politique des Cookies' : 'Cookie Policy'}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {language === 'fr'
                ? 'Gérez vos préférences de cookies et apprenez comment nous les utilisons'
                : 'Manage your cookie preferences and learn how we use them'}
            </p>
          </div>

          {/* Cookie Information */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>
                {language === 'fr' ? 'Qu\'est-ce qu\'un cookie ?' : 'What is a Cookie?'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'fr'
                  ? 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils permettent au site de se souvenir de vos actions et préférences sur une période donnée, afin que vous n\'ayez pas à les ressaisir à chaque fois que vous revenez sur le site ou naviguez d\'une page à l\'autre.'
                  : 'Cookies are small text files stored on your device when you visit a website. They allow the site to remember your actions and preferences over a period of time, so you don\'t have to re-enter them every time you return to the site or browse from one page to another.'}
              </p>
            </CardContent>
          </Card>

          {/* Cookie Preferences */}
          <Card className="mb-8 border-border/50">
            <CardHeader>
              <CardTitle>
                {language === 'fr' ? 'Gérer Vos Préférences' : 'Manage Your Preferences'}
              </CardTitle>
              <CardDescription>
                {language === 'fr'
                  ? 'Choisissez les types de cookies que vous acceptez'
                  : 'Choose which types of cookies you accept'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {cookieTypes.map((cookie) => (
                <div key={cookie.id} className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor={cookie.id} className="font-semibold text-foreground">
                        {cookie.title[language]}
                      </Label>
                      {cookie.required && (
                        <span className="text-xs text-muted-foreground">
                          ({language === 'fr' ? 'Requis' : 'Required'})
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {cookie.description[language]}
                    </p>
                  </div>
                  <Switch
                    id={cookie.id}
                    checked={preferences[cookie.id as keyof typeof preferences]}
                    onCheckedChange={(checked) => {
                      if (!cookie.required) {
                        setPreferences({ ...preferences, [cookie.id]: checked });
                      }
                    }}
                    disabled={cookie.required}
                  />
                </div>
              ))}
              <Button onClick={handleSavePreferences} className="w-full gap-2">
                <Save className="h-4 w-4" />
                {language === 'fr' ? 'Enregistrer les Préférences' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>

          {/* More Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>
                {language === 'fr' ? 'Plus d\'Informations' : 'More Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                {language === 'fr'
                  ? 'Pour plus d\'informations sur notre utilisation des cookies, veuillez consulter notre'
                  : 'For more information about our use of cookies, please see our'}{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  {language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
                </a>.
              </p>
              <p>
                {language === 'fr'
                  ? 'Si vous avez des questions concernant notre utilisation des cookies, veuillez nous contacter à'
                  : 'If you have questions about our use of cookies, please contact us at'}{' '}
                <a href="mailto:privacy@riadprix.com" className="text-primary hover:underline">
                  privacy@riadprix.com
                </a>.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}

