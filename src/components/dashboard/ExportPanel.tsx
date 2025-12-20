import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ExportPanel() {
  const handleExport = (format: string) => {
    toast.success(`Export ${format.toUpperCase()} en cours...`, {
      description: "Votre rapport sera prêt dans quelques secondes.",
    });
  };

  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-muted">
          <Download className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">Exporter les Données</h3>
          <p className="text-sm text-muted-foreground">Rapports personnalisés</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex-col h-auto py-4 gap-2"
          onClick={() => handleExport("pdf")}
        >
          <FileText className="h-6 w-6 text-coral" />
          <span className="text-sm">Rapport PDF</span>
        </Button>
        <Button
          variant="outline"
          className="flex-col h-auto py-4 gap-2"
          onClick={() => handleExport("csv")}
        >
          <FileSpreadsheet className="h-6 w-6 text-emerald" />
          <span className="text-sm">Données CSV</span>
        </Button>
      </div>
    </div>
  );
}
