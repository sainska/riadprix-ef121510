import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/monitoring";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Shield, Bell, Palette, Globe, Save, Lock, Loader2 } from "lucide-react";

export default function Account() {
  const { user, profile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    weekly: true,
  });

  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.full_name) {
      setProfileData(prev => ({ ...prev, fullName: profile.full_name || '' }));
    }
    if (profile?.phone) {
      setProfileData(prev => ({ ...prev, phone: profile.phone || '' }));
    }
  }, [profile]);

  const handleSaveNotifications = () => {
    toast({
      title: language === 'fr' ? 'Préférences enregistrées' : 'Preferences Saved',
      description: language === 'fr' ? 'Vos préférences de notification ont été mises à jour' : 'Your notification preferences have been updated',
    });
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Vous devez être connecté' : 'You must be logged in',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.fullName,
          phone: profileData.phone || null,
        })
        .eq('id', user.id);

      if (error) throw error;

    toast({
      title: language === 'fr' ? 'Profil mis à jour' : 'Profile Updated',
      description: language === 'fr' ? 'Vos informations ont été enregistrées' : 'Your information has been saved',
    });

      // Refresh profile
      window.location.reload();
    } catch (error) {
      handleError(error);
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: error instanceof Error ? error.message : (language === 'fr' ? 'Erreur lors de l\'enregistrement' : 'Error saving profile'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast({
        title: language === 'fr' ? 'Mot de passe mis à jour' : 'Password Updated',
        description: language === 'fr' ? 'Votre mot de passe a été modifié avec succès' : 'Your password has been updated successfully',
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      handleError(error);
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: error instanceof Error ? error.message : (language === 'fr' ? 'Erreur lors de la modification du mot de passe' : 'Error updating password'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Account - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Manage your RiadPrix account settings and preferences." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl flex-1">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'fr' ? 'Mon Compte' : 'My Account'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Gérez vos paramètres et préférences' : 'Manage your settings and preferences'}
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Profil' : 'Profile'}</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Notifications' : 'Notifications'}</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Préférences' : 'Preferences'}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {language === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Mettez à jour vos informations de profil' : 'Update your profile information'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {language === 'fr' ? 'Nom complet' : 'Full Name'}
                      </Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        {language === 'fr' ? 'L\'email ne peut pas être modifié' : 'Email cannot be changed'}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {language === 'fr' ? 'Téléphone' : 'Phone'}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={loading} className="gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {language === 'fr' ? 'Enregistrement...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                    <Save className="h-4 w-4" />
                    {language === 'fr' ? 'Enregistrer' : 'Save Changes'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/50 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {language === 'fr' ? 'Sécurité' : 'Security'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Gérez votre mot de passe et la sécurité du compte' : 'Manage your password and account security'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">{language === 'fr' ? 'Mot de passe actuel' : 'Current Password'}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder={language === 'fr' ? 'Entrez votre mot de passe actuel' : 'Enter your current password'}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">{language === 'fr' ? 'Nouveau mot de passe' : 'New Password'}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder={language === 'fr' ? 'Entrez le nouveau mot de passe' : 'Enter new password'}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">{language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder={language === 'fr' ? 'Confirmez le nouveau mot de passe' : 'Confirm new password'}
                      />
                    </div>
                  </div>
                  <Button onClick={handleChangePassword} disabled={loading} variant="default" className="gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {language === 'fr' ? 'Modification...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        {language === 'fr' ? 'Mettre à jour le mot de passe' : 'Update Password'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

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
                      <div>
                        <p className="font-medium text-foreground">
                          {language === 'fr' ? 'Notifications par email' : 'Email Notifications'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'fr' ? 'Recevez des mises à jour par email' : 'Receive updates via email'}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {language === 'fr' ? 'Notifications push' : 'Push Notifications'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'fr' ? 'Recevez des notifications en temps réel' : 'Receive real-time notifications'}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {language === 'fr' ? 'Rapport hebdomadaire' : 'Weekly Report'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'fr' ? 'Recevez un résumé hebdomadaire' : 'Receive a weekly summary'}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.weekly}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weekly: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {language === 'fr' ? 'Marketing' : 'Marketing'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'fr' ? 'Offres et promotions' : 'Offers and promotions'}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveNotifications} className="gap-2">
                    <Save className="h-4 w-4" />
                    {language === 'fr' ? 'Enregistrer' : 'Save Preferences'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
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
                          variant={theme === 'light' ? 'default' : 'outline'}
                          onClick={() => setTheme('light')}
                          className="flex-1"
                        >
                          ☀️ {language === 'fr' ? 'Clair' : 'Light'}
                        </Button>
                        <Button
                          variant={theme === 'dark' ? 'default' : 'outline'}
                          onClick={() => setTheme('dark')}
                          className="flex-1"
                        >
                          🌙 {language === 'fr' ? 'Sombre' : 'Dark'}
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
                      variant={language === 'en' ? 'default' : 'outline'}
                      onClick={() => setLanguage('en')}
                      className="flex-1"
                    >
                      🇬🇧 English
                    </Button>
                    <Button
                      variant={language === 'fr' ? 'default' : 'outline'}
                      onClick={() => setLanguage('fr')}
                      className="flex-1"
                    >
                      🇫🇷 Français
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </>
  );
}
