import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';

export default function ReportExport() {
  const { language, t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Export Reports - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Export your market, property, or analytics reports as CSV or PDF." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {language === 'fr' ? 'Exporter les Rapports' : 'Export Reports'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' 
                ? 'Téléchargez vos rapports de marché, propriété ou analytiques au format CSV ou PDF'
                : 'Download your market, property, or analytics reports as CSV or PDF'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  {language === 'fr' ? 'Export CSV' : 'CSV Export'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Exportez vos données au format CSV pour analyse'
                    : 'Export your data in CSV format for analysis'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {language === 'fr' ? 'Données de marché' : 'Market data'}</li>
                  <li>• {language === 'fr' ? 'Benchmarks de prix' : 'Price benchmarks'}</li>
                  <li>• {language === 'fr' ? 'Historique des propriétés' : 'Property history'}</li>
                </ul>
                <Button className="w-full gap-2" variant="default">
                  <Download className="h-4 w-4" />
                  {language === 'fr' ? 'Télécharger CSV' : 'Download CSV'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {language === 'fr' ? 'Export PDF' : 'PDF Export'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Générez un rapport complet au format PDF'
                    : 'Generate a comprehensive report in PDF format'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {language === 'fr' ? 'Rapport de performance' : 'Performance report'}</li>
                  <li>• {language === 'fr' ? 'Analyse de marché' : 'Market analysis'}</li>
                  <li>• {language === 'fr' ? 'Graphiques et visualisations' : 'Charts and visualizations'}</li>
                </ul>
                <Button className="w-full gap-2" variant="default">
                  <Download className="h-4 w-4" />
                  {language === 'fr' ? 'Générer PDF' : 'Generate PDF'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

