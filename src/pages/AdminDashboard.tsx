import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Users, Settings, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { language } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Administrative dashboard for managing users, roles, and system settings." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {language === 'fr' ? 'Tableau de Bord Administrateur' : 'Admin Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Gérez les utilisateurs, rôles et paramètres système' : 'Manage users, roles, and system settings'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {language === 'fr' ? 'Utilisateurs' : 'Users'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Total utilisateurs' : 'Total users'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {language === 'fr' ? 'Rôles' : 'Roles'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Rôles actifs' : 'Active roles'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {language === 'fr' ? 'Propriétés' : 'Properties'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Propriétés totales' : 'Total properties'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  {language === 'fr' ? 'Système' : 'System'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Statut: Opérationnel' : 'Status: Operational'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'fr' ? 'Fonctionnalités Administrateur' : 'Admin Features'}</CardTitle>
              <CardDescription>
                {language === 'fr' ? 'Les contrôles utilisateur, rôle et admin seront disponibles prochainement' : 'User, role and admin controls coming soon'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">
                    {language === 'fr' ? 'Gestion des Utilisateurs' : 'User Management'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Afficher, modifier et gérer les utilisateurs' : 'View, edit and manage users'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">
                    {language === 'fr' ? 'Gestion des Rôles' : 'Role Management'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' ? 'Assigner et modifier les rôles utilisateur' : 'Assign and modify user roles'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}

