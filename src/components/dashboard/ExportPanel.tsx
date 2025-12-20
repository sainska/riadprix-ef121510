import { FileText, FileSpreadsheet, Download, ArrowRight } from "lucide-react";
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
          className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border bg-card hover:border-danger/30 hover:bg-danger/5 transition-all group"
        >
          <div className="p-3 rounded-xl bg-danger/10 group-hover:bg-danger/20 transition-colors">
            <FileText className="h-6 w-6 text-danger" />
          </div>
          <span className="text-sm font-semibold text-foreground">Rapport PDF</span>
        </button>
        <button
          onClick={() => handleExport("csv")}
          className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border bg-card hover:border-success/30 hover:bg-success/5 transition-all group"
        >
          <div className="p-3 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors">
            <FileSpreadsheet className="h-6 w-6 text-success" />
          </div>
          <span className="text-sm font-semibold text-foreground">Données CSV</span>
        </button>
      </div>
    </div>
  );
}
