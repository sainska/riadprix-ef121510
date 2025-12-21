import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/monitoring";
import { 
  Palette, 
  Globe, 
  Bell, 
  Mail, 
  Clock, 
  Calendar,
  Save,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    theme: theme,
    language: language,
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    weeklyReports: true,
    soundEnabled: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user settings from database
    const loadSettings = async () => {
      if (!user?.id) return;
      
      try {
        // Load settings from localStorage as fallback (until DB columns are added)
        const savedSettings = localStorage.getItem('riadprix-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        handleError(error);
      }
    };

    loadSettings();
  }, [user?.id]);

  const handleSaveSettings = async () => {
    if (!user?.id) {
      toast({
        title: t('common.error'),
        description: language === 'fr' ? 'Vous devez être connecté' : 'You must be logged in',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Save to localStorage (until DB columns are added)
      localStorage.setItem('riadprix-settings', JSON.stringify(settings));

      // Update context immediately
      setTheme(settings.theme);
      setLanguage(settings.language);

      // In production, save to database:
      // await supabase.from('profiles').update({ ... }).eq('id', user.id);

      toast({
        title: t('common.success'),
        description: language === 'fr' ? 'Paramètres enregistrés avec succès' : 'Settings saved successfully',
      });
    } catch (error) {
      handleError(error);
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : (language === 'fr' ? 'Erreur lors de l\'enregistrement' : 'Error saving settings'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Manage your RiadPrix application settings and preferences." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'fr' ? 'Paramètres' : 'Settings'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Personnalisez votre expérience RiadPrix' : 'Customize your RiadPrix experience'}
            </p>
          </div>

          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Apparence' : 'Appearance'}</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Notifications' : 'Notifications'}</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Général' : 'General'}</span>
              </TabsTrigger>
            </TabsList>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    {language === 'fr' ? 'Apparence' : 'Appearance'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Personnalisez l\'apparence de l\'application' : 'Customize the appearance of the application'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">{language === 'fr' ? 'Thème' : 'Theme'}</Label>
                      <div className="flex gap-3">
                        <Button
                          variant={settings.theme === 'light' ? 'default' : 'outline'}
                          onClick={() => setSettings({ ...settings, theme: 'light' })}
                          className="flex-1"
                        >
                          <Sun className="mr-2 h-4 w-4" />
                          {language === 'fr' ? 'Clair' : 'Light'}
                        </Button>
                        <Button
                          variant={settings.theme === 'dark' ? 'default' : 'outline'}
                          onClick={() => setSettings({ ...settings, theme: 'dark' })}
                          className="flex-1"
                        >
                          <Moon className="mr-2 h-4 w-4" />
                          {language === 'fr' ? 'Sombre' : 'Dark'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    {language === 'fr' ? 'Langue' : 'Language'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Choisissez votre langue préférée' : 'Choose your preferred language'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button
                      variant={settings.language === 'en' ? 'default' : 'outline'}
                      onClick={() => setSettings({ ...settings, language: 'en' })}
                      className="flex-1"
                    >
                      🇬🇧 English
                    </Button>
                    <Button
                      variant={settings.language === 'fr' ? 'default' : 'outline'}
                      onClick={() => setSettings({ ...settings, language: 'fr' })}
                      className="flex-1"
                    >
                      🇫🇷 Français
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    {language === 'fr' ? 'Préférences de Notification' : 'Notification Preferences'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Choisissez comment vous souhaitez être notifié' : 'Choose how you want to be notified'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            {language === 'fr' ? 'Notifications par email' : 'Email Notifications'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'fr' ? 'Recevez des mises à jour par email' : 'Receive updates via email'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            {language === 'fr' ? 'Notifications push' : 'Push Notifications'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'fr' ? 'Recevez des notifications en temps réel' : 'Receive real-time notifications'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            {language === 'fr' ? 'Rapport hebdomadaire' : 'Weekly Report'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'fr' ? 'Recevez un résumé hebdomadaire par email' : 'Receive a weekly summary via email'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.weeklyReports}
                        onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            {language === 'fr' ? 'Emails marketing' : 'Marketing Emails'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'fr' ? 'Offres et promotions' : 'Offers and promotions'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* General Settings */}
            <TabsContent value="general">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {language === 'fr' ? 'Paramètres Généraux' : 'General Settings'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Autres préférences de l\'application' : 'Other application preferences'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {settings.soundEnabled ? (
                          <Volume2 className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <VolumeX className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {language === 'fr' ? 'Sons de l\'application' : 'Application Sounds'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {language === 'fr' ? 'Activer les sons de notification' : 'Enable notification sounds'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>{language === 'fr' ? 'Fuseau horaire' : 'Timezone'}</Label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="Africa/Casablanca">Africa/Casablanca (GMT+1)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                        <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button onClick={handleSaveSettings} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading 
                ? (language === 'fr' ? 'Enregistrement...' : 'Saving...')
                : (language === 'fr' ? 'Enregistrer les paramètres' : 'Save Settings')
              }
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
