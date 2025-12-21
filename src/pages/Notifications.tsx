import React from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Notifications() {
  const { language, t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Notifications - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="View and manage your RiadPrix notifications." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'fr' ? 'Notifications' : 'Notifications'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Restez informé de vos activités et mises à jour' : 'Stay informed about your activities and updates'}
            </p>
          </div>
          <NotificationCenter />
        </main>
        <Footer />
      </div>
    </>
  );
}

