import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Building2, 
  Clock,
  FileSpreadsheet,
  FileText as FilePdf,
  Plus
} from "lucide-react";

const reportsHistory = [
  {
    id: '1',
    name: 'Monthly Performance Report',
    nameFr: 'Rapport de Performance Mensuel',
    type: 'performance',
    date: '2024-01-15',
    format: 'pdf',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Market Analysis - Marrakech',
    nameFr: 'Analyse du Marché - Marrakech',
    type: 'market',
    date: '2024-01-10',
    format: 'pdf',
    size: '1.8 MB',
  },
  {
    id: '3',
    name: 'Revenue Export Q4 2023',
    nameFr: 'Export Revenus Q4 2023',
    type: 'export',
    date: '2024-01-05',
    format: 'csv',
    size: '856 KB',
  },
  {
    id: '4',
    name: 'Competitor Benchmark',
    nameFr: 'Benchmark Concurrents',
    type: 'benchmark',
    date: '2024-01-02',
    format: 'pdf',
    size: '3.1 MB',
  },
];

const reportTemplates = [
  {
    id: 'performance',
    name: 'Performance Report',
    nameFr: 'Rapport de Performance',
    description: 'Complete overview of your property performance',
    descriptionFr: 'Aperçu complet de la performance de vos propriétés',
    icon: TrendingUp,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    id: 'market',
    name: 'Market Analysis',
    nameFr: 'Analyse du Marché',
    description: 'In-depth market trends and competitor analysis',
    descriptionFr: 'Tendances du marché et analyse concurrentielle',
    icon: Building2,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    id: 'revenue',
    name: 'Revenue Report',
    nameFr: 'Rapport de Revenus',
    description: 'Detailed revenue breakdown and projections',
    descriptionFr: 'Détail des revenus et projections',
    icon: FileText,
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    id: 'occupancy',
    name: 'Occupancy Report',
    nameFr: 'Rapport d\'Occupation',
    description: 'Occupancy rates and booking patterns',
    descriptionFr: 'Taux d\'occupation et tendances de réservation',
    icon: Calendar,
    color: 'bg-purple-500/10 text-purple-500',
  },
];

export default function Reports() {
  const [generating, setGenerating] = useState<string | null>(null);
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleGenerateReport = (templateId: string) => {
    setGenerating(templateId);
    setTimeout(() => {
      setGenerating(null);
      toast({
        title: language === 'fr' ? 'Rapport généré' : 'Report Generated',
        description: language === 'fr' ? 'Votre rapport est prêt à être téléchargé' : 'Your report is ready for download',
      });
    }, 2000);
  };

  const handleDownload = (reportId: string, format: string) => {
    toast({
      title: language === 'fr' ? 'Téléchargement...' : 'Downloading...',
      description: language === 'fr' ? `Téléchargement du fichier ${format.toUpperCase()}` : `Downloading ${format.toUpperCase()} file`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Reports - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Generate and download detailed reports for your rental properties." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'fr' ? 'Rapports' : 'Reports'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Générez et téléchargez des rapports détaillés' : 'Generate and download detailed reports'}
            </p>
          </div>

          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
              <TabsTrigger value="generate">
                {language === 'fr' ? 'Générer' : 'Generate'}
              </TabsTrigger>
              <TabsTrigger value="history">
                {language === 'fr' ? 'Historique' : 'History'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${template.color}`}>
                          <template.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {language === 'fr' ? template.nameFr : template.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {language === 'fr' ? template.descriptionFr : template.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 gap-2"
                          onClick={() => handleGenerateReport(template.id)}
                          disabled={generating === template.id}
                        >
                          {generating === template.id ? (
                            <>
                              <Clock className="h-4 w-4 animate-spin" />
                              {language === 'fr' ? 'Génération...' : 'Generating...'}
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              {language === 'fr' ? 'Générer PDF' : 'Generate PDF'}
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => handleGenerateReport(template.id)}
                          disabled={generating === template.id}
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          CSV
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>{language === 'fr' ? 'Rapports Récents' : 'Recent Reports'}</CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Vos rapports générés récemment' : 'Your recently generated reports'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportsHistory.map((report) => (
                      <div 
                        key={report.id} 
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            report.format === 'pdf' ? 'bg-red-500/10' : 'bg-green-500/10'
                          }`}>
                            {report.format === 'pdf' ? (
                              <FilePdf className={`h-5 w-5 ${report.format === 'pdf' ? 'text-red-500' : 'text-green-500'}`} />
                            ) : (
                              <FileSpreadsheet className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {language === 'fr' ? report.nameFr : report.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground">{report.date}</span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{report.size}</span>
                              <Badge variant="secondary" className="text-xs">
                                {report.format.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownload(report.id, report.format)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
