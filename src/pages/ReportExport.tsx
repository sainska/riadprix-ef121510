import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, FileSpreadsheet, Download, Calendar, Building, CheckCircle } from 'lucide-react';
import { exportToCSV, exportToPDF, ExportData, ReportConfig } from '@/lib/export';
import { toast } from 'sonner';

type ReportType = 'market' | 'property' | 'recommendations' | 'analytics';

export default function ReportExport() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<ReportType>('market');
  const [isExporting, setIsExporting] = useState(false);
  const [lastExportId, setLastExportId] = useState<string | null>(null);

  const reportTypes = {
    market: {
      title: language === 'fr' ? 'Données du Marché' : 'Market Data',
      description: language === 'fr' 
        ? 'Prix moyens, taux d\'occupation et tendances par marché'
        : 'Average prices, occupancy rates and trends by market',
    },
    property: {
      title: language === 'fr' ? 'Rapport de Propriétés' : 'Property Report',
      description: language === 'fr'
        ? 'Inventaire complet de vos propriétés avec statistiques'
        : 'Complete inventory of your properties with statistics',
    },
    recommendations: {
      title: language === 'fr' ? 'Recommandations de Prix' : 'Price Recommendations',
      description: language === 'fr'
        ? 'Suggestions de prix optimisés avec analyse'
        : 'Optimized price suggestions with analysis',
    },
    analytics: {
      title: language === 'fr' ? 'Analyse de Performance' : 'Performance Analytics',
      description: language === 'fr'
        ? 'Métriques de performance et comparaisons'
        : 'Performance metrics and comparisons',
    },
  };

  // Generate sample data based on report type
  const generateReportData = (type: ReportType): ExportData => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (type) {
      case 'market':
        return {
          headers: language === 'fr' 
            ? ['Marché', 'Type de Propriété', 'Prix Moyen (MAD)', 'Taux d\'Occupation (%)', 'Tendance', 'Période']
            : ['Market', 'Property Type', 'Avg Price (MAD)', 'Occupancy Rate (%)', 'Trend', 'Period'],
          rows: [
            ['Marrakech', 'Riad', 1850, '72%', '↑ +5.2%', today],
            ['Marrakech', 'Apartment', 950, '68%', '↑ +3.1%', today],
            ['Marrakech', 'Villa', 3200, '65%', '→ 0%', today],
            ['Fès', 'Riad', 1450, '58%', '↑ +2.8%', today],
            ['Fès', 'Guesthouse', 780, '62%', '↓ -1.2%', today],
            ['Essaouira', 'Riad', 1280, '70%', '↑ +4.5%', today],
            ['Casablanca', 'Apartment', 1100, '75%', '↑ +2.0%', today],
            ['Tangier', 'Villa', 2800, '55%', '↑ +6.3%', today],
          ],
        };
      case 'property':
        return {
          headers: language === 'fr'
            ? ['Nom', 'Type', 'Emplacement', 'Chambres', 'Prix Actuel (MAD)', 'Statut', 'Performance']
            : ['Name', 'Type', 'Location', 'Bedrooms', 'Current Price (MAD)', 'Status', 'Performance'],
          rows: [
            ['Riad Jasmine', 'Riad', 'Marrakech Medina', 4, 1800, 'Active', 'Excellent'],
            ['Villa Atlas', 'Villa', 'Marrakech Palmeraie', 6, 3500, 'Active', 'Good'],
            ['Dar Fès', 'Riad', 'Fès Medina', 3, 1400, 'Active', 'Average'],
            ['Ocean View Apt', 'Apartment', 'Essaouira', 2, 950, 'Active', 'Excellent'],
          ],
        };
      case 'recommendations':
        return {
          headers: language === 'fr'
            ? ['Propriété', 'Prix Actuel (MAD)', 'Prix Recommandé (MAD)', 'Variation', 'Confiance', 'Raison', 'Valide Jusqu\'au']
            : ['Property', 'Current Price (MAD)', 'Recommended Price (MAD)', 'Change', 'Confidence', 'Reason', 'Valid Until'],
          rows: [
            ['Riad Jasmine', 1800, 1950, '+8.3%', '92%', language === 'fr' ? 'Forte demande saisonnière' : 'High seasonal demand', '2025-01-15'],
            ['Villa Atlas', 3500, 3200, '-8.6%', '78%', language === 'fr' ? 'Concurrence accrue' : 'Increased competition', '2025-01-10'],
            ['Dar Fès', 1400, 1550, '+10.7%', '85%', language === 'fr' ? 'Événement local' : 'Local event', '2025-01-08'],
            ['Ocean View Apt', 950, 1050, '+10.5%', '88%', language === 'fr' ? 'Haute saison' : 'Peak season', '2025-01-20'],
          ],
        };
      case 'analytics':
        return {
          headers: language === 'fr'
            ? ['Métrique', 'Ce Mois', 'Mois Dernier', 'Variation', 'Objectif', 'Statut']
            : ['Metric', 'This Month', 'Last Month', 'Change', 'Target', 'Status'],
          rows: [
            [language === 'fr' ? 'Revenu Total' : 'Total Revenue', '45,000 MAD', '42,000 MAD', '+7.1%', '50,000 MAD', '90%'],
            [language === 'fr' ? 'Taux d\'Occupation' : 'Occupancy Rate', '72%', '68%', '+4pp', '75%', '96%'],
            [language === 'fr' ? 'Prix Moyen' : 'Average Price', '1,650 MAD', '1,580 MAD', '+4.4%', '1,700 MAD', '97%'],
            [language === 'fr' ? 'Réservations' : 'Bookings', '28', '25', '+12%', '30', '93%'],
            [language === 'fr' ? 'Score Avis' : 'Review Score', '4.8/5', '4.7/5', '+2.1%', '4.9/5', '98%'],
          ],
        };
      default:
        return { headers: [], rows: [] };
    }
  };

  const getReportConfig = (): ReportConfig => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return {
      title: reportTypes[selectedReport].title,
      subtitle: reportTypes[selectedReport].description,
      generatedBy: user?.email || 'RiadPrix User',
      dateRange: {
        start: lastMonth.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
      },
      filters: {
        [language === 'fr' ? 'Type de Rapport' : 'Report Type']: reportTypes[selectedReport].title,
        [language === 'fr' ? 'Langue' : 'Language']: language === 'fr' ? 'Français' : 'English',
      },
      language,
    };
  };

  const handleCSVExport = async () => {
    setIsExporting(true);
    try {
      const data = generateReportData(selectedReport);
      const config = getReportConfig();
      const filename = `riadprix-${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`;
      
      const reportId = exportToCSV(data, filename, config);
      setLastExportId(reportId);
      
      toast.success(
        language === 'fr' ? 'Rapport CSV généré avec succès!' : 'CSV report generated successfully!',
        { description: `ID: ${reportId}` }
      );
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur lors de l\'export' : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDFExport = async () => {
    setIsExporting(true);
    try {
      const data = generateReportData(selectedReport);
      const config = getReportConfig();
      
      const reportId = await exportToPDF({
        title: reportTypes[selectedReport].title,
        content: data,
        config,
      });
      setLastExportId(reportId);
      
      toast.success(
        language === 'fr' ? 'Rapport PDF généré avec succès!' : 'PDF report generated successfully!',
        { description: `ID: ${reportId}` }
      );
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur lors de l\'export' : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{language === 'fr' ? 'Exporter les Rapports' : 'Export Reports'} - RiadPrix</title>
        <meta name="description" content="Export your market, property, or analytics reports as professional CSV or PDF documents." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {language === 'fr' ? 'Exporter les Rapports' : 'Export Reports'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' 
                ? 'Générez des rapports professionnels avec en-tête et pied de page personnalisés'
                : 'Generate professional reports with custom letterhead and footer'}
            </p>
          </div>

          {/* Report Type Selection */}
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                {language === 'fr' ? 'Type de Rapport' : 'Report Type'}
              </CardTitle>
              <CardDescription>
                {language === 'fr' 
                  ? 'Sélectionnez le type de données à exporter'
                  : 'Select the type of data to export'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(Object.entries(reportTypes) as [ReportType, typeof reportTypes.market][]).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedReport(key)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedReport === key
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-sm">{value.title}</span>
                      {selectedReport === key && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{value.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  {language === 'fr' ? 'Export CSV' : 'CSV Export'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Fichier tableur avec métadonnées et pied de page'
                    : 'Spreadsheet file with metadata and footer'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {language === 'fr' ? 'En-tête avec informations de rapport' : 'Header with report info'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {language === 'fr' ? 'ID unique de rapport' : 'Unique report ID'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {language === 'fr' ? 'Pied de page avec disclaimer' : 'Footer with disclaimer'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {language === 'fr' ? 'Compatible Excel/Google Sheets' : 'Excel/Google Sheets compatible'}
                  </li>
                </ul>
                <Button 
                  className="w-full gap-2" 
                  variant="default"
                  onClick={handleCSVExport}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4" />
                  {isExporting 
                    ? (language === 'fr' ? 'Génération...' : 'Generating...') 
                    : (language === 'fr' ? 'Télécharger CSV' : 'Download CSV')}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  {language === 'fr' ? 'Export PDF' : 'PDF Export'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Document professionnel avec en-tête et branding'
                    : 'Professional document with letterhead and branding'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    {language === 'fr' ? 'En-tête avec logo RiadPrix' : 'RiadPrix logo letterhead'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    {language === 'fr' ? 'Tableau de données formaté' : 'Formatted data table'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    {language === 'fr' ? 'Section disclaimer légal' : 'Legal disclaimer section'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    {language === 'fr' ? 'Pied de page avec contacts' : 'Footer with contact info'}
                  </li>
                </ul>
                <Button 
                  className="w-full gap-2" 
                  variant="default"
                  onClick={handlePDFExport}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4" />
                  {isExporting 
                    ? (language === 'fr' ? 'Génération...' : 'Generating...') 
                    : (language === 'fr' ? 'Générer PDF' : 'Generate PDF')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Last Export Info */}
          {lastExportId && (
            <Card className="mt-6 border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      {language === 'fr' ? 'Dernier rapport généré' : 'Last report generated'}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-mono">
                      ID: {lastExportId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Preview */}
          <Card className="mt-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {language === 'fr' ? 'Aperçu des Données' : 'Data Preview'}
              </CardTitle>
              <CardDescription>
                {reportTypes[selectedReport].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {generateReportData(selectedReport).headers.map((header, i) => (
                        <th key={i} className="text-left py-3 px-2 font-semibold text-muted-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {generateReportData(selectedReport).rows.slice(0, 4).map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {row.map((cell, j) => (
                          <td key={j} className="py-3 px-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {generateReportData(selectedReport).rows.length > 4 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {language === 'fr' 
                      ? `+ ${generateReportData(selectedReport).rows.length - 4} lignes supplémentaires dans le rapport complet`
                      : `+ ${generateReportData(selectedReport).rows.length - 4} more rows in full report`}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}
