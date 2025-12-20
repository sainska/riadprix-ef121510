import { Lightbulb, TrendingUp, Calendar, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const insights = [
  {
    icon: TrendingUp,
    title: "Opportunité de Hausse",
    description: "Les prix dans votre quartier ont augmenté de 12% ce mois. Considérez une augmentation de 8-10%.",
    action: "Appliquer +10%",
    priority: "high" as const,
  },
  {
    icon: Calendar,
    title: "Haute Saison Approche",
    description: "Le festival de Marrakech commence dans 3 semaines. Les réservations augmentent de 40%.",
    action: "Optimiser",
    priority: "medium" as const,
  },
  {
    icon: Target,
    title: "Positionnement Marché",
    description: "Votre riad est 15% en dessous de la médiane pour les propriétés similaires.",
    action: "Analyser",
    priority: "low" as const,
  },
];

const priorityStyles = {
  high: {
    bg: "bg-primary/5",
    border: "border-primary/20",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  medium: {
    bg: "bg-teal/5",
    border: "border-teal/20",
    iconBg: "bg-teal/10",
    iconColor: "text-teal",
  },
  low: {
    bg: "bg-muted",
    border: "border-border",
    iconBg: "bg-secondary",
    iconColor: "text-muted-foreground",
  },
};

export function MarketInsights() {
  return (
    <div className="stat-card animate-slide-up h-full" style={{ animationDelay: '500ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">Insights IA</h3>
          <p className="text-sm text-muted-foreground">Recommandations intelligentes</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const styles = priorityStyles[insight.priority];
          return (
            <div 
              key={index}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${styles.bg} ${styles.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                  <insight.icon className={`h-4 w-4 ${styles.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{insight.description}</p>
                  <Button 
                    variant={insight.priority === "high" ? "orange" : "outline"} 
                    size="sm"
                    className="gap-2"
                  >
                    {insight.action}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
