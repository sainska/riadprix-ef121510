import { FileText, FileSpreadsheet, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportToCSV, exportToPDF, formatBenchmarkDataForExport } from "@/lib/export";
import { benchmarksApi } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface ExportPanelProps {
  marketId?: string;
  propertyType?: string;
}

export function ExportPanel({ marketId, propertyType }: ExportPanelProps) {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setLoading(true);
    try {
      if (format === 'csv') {
        // Fetch benchmark data
        const benchmarks = await benchmarksApi.getBenchmarks({
          marketId,
          propertyType: propertyType as any,
        });
        
        const exportData = formatBenchmarkDataForExport(benchmarks);
        const filename = `riadprix-benchmarks-${marketId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
        exportToCSV(exportData, filename);
        
        toast.success(language === 'fr' ? 'Export CSV réussi' : 'CSV export successful', {
          description: language === 'fr' ? 'Le fichier a été téléchargé' : 'File has been downloaded',
        });
      } else {
        // PDF export
        const benchmarks = await benchmarksApi.getBenchmarks({
          marketId,
          propertyType: propertyType as any,
        });
        
        const tableRows = benchmarks.map(b => `
          <tr>
            <td>${b.property_type}</td>
            <td>${b.min_price || 0}</td>
            <td>${b.median_price || 0}</td>
            <td>${b.max_price || 0}</td>
            <td>${b.period_start}</td>
            <td>${b.period_end}</td>
          </tr>
        `).join('');
        
        const tableHTML = `
          <table>
            <thead>
              <tr>
                <th>Property Type</th>
                <th>Min Price</th>
                <th>Median Price</th>
                <th>Max Price</th>
                <th>Period Start</th>
                <th>Period End</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        `;
        
        await exportToPDF({
          title: `RiadPrix Benchmark Report - ${marketId || 'All Markets'}`,
          content: tableHTML,
        });
        
        toast.success(language === 'fr' ? 'Export PDF initié' : 'PDF export initiated', {
          description: language === 'fr' ? 'Utilisez la boîte de dialogue d\'impression' : 'Use the print dialog',
        });
      }
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur d\'export' : 'Export error', {
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-secondary">
          <Download className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">Exporter les Données</h3>
          <p className="text-sm text-muted-foreground">Téléchargez vos rapports</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleExport("pdf")}
          disabled={loading}
          className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border bg-card hover:border-danger/30 hover:bg-danger/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-3 rounded-xl bg-danger/10 group-hover:bg-danger/20 transition-colors">
            <FileText className="h-6 w-6 text-danger" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            {loading ? (language === 'fr' ? 'Export...' : 'Exporting...') : (language === 'fr' ? 'Rapport PDF' : 'PDF Report')}
          </span>
        </button>
        <button
          onClick={() => handleExport("csv")}
          disabled={loading}
          className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border bg-card hover:border-success/30 hover:bg-success/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-3 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors">
            <FileSpreadsheet className="h-6 w-6 text-success" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            {loading ? (language === 'fr' ? 'Export...' : 'Exporting...') : (language === 'fr' ? 'Données CSV' : 'CSV Data')}
          </span>
        </button>
      </div>
    </div>
  );
}
