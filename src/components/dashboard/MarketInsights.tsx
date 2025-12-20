import { Lightbulb, TrendingUp, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const insights = [
  {
    icon: TrendingUp,
    title: "Opportunité de Hausse",
    description: "Les prix dans votre quartier ont augmenté de 12% ce mois. Considérez une augmentation de 8-10%.",
    action: "Appliquer +10%",
    priority: "high",
  },
  {
    icon: Calendar,
    title: "Haute Saison Approche",
    description: "Le festival de Marrakech commence dans 3 semaines. Les réservations augmentent de 40%.",
    action: "Optimiser les prix",
    priority: "medium",
  },
  {
    icon: Target,
    title: "Positionnement Marché",
    description: "Votre riad est 15% en dessous de la médiane pour les propriétés similaires.",
    action: "Voir les comparables",
    priority: "low",
  },
];

export function MarketInsights() {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: '500ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/20">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Insights Intelligents</h3>
          <p className="text-sm text-muted-foreground">Recommandations basées sur l'IA</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`p-4 rounded-xl border transition-all hover:border-primary/30 ${
              insight.priority === "high" 
                ? "bg-primary/5 border-primary/20" 
                : insight.priority === "medium"
                ? "bg-accent/5 border-accent/20"
                : "bg-muted/30 border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                insight.priority === "high" 
                  ? "bg-primary/20 text-primary" 
                  : insight.priority === "medium"
                  ? "bg-accent/20 text-accent"
                  : "bg-muted text-muted-foreground"
              }`}>
                <insight.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <Button 
                  variant={insight.priority === "high" ? "gold" : "outline"} 
                  size="sm"
                >
                  {insight.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
