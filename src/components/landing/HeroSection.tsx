import { BarChart3, Users, Globe2, Award, ArrowRight, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description: "Analysez les prix concurrentiels en temps réel sur Airbnb et Booking.com",
  },
  {
    icon: Users,
    title: "Benchmarking Précis",
    description: "Comparez vos tarifs par ville, quartier, type de bien et saisonnalité",
  },
  {
    icon: Globe2,
    title: "Données Fiables",
    description: "Sources légales via AirDNA avec historique complet des marchés",
  },
  {
    icon: Award,
    title: "Recommandations IA",
    description: "Suggestions tarifaires basées sur votre positionnement marché",
  },
];

const stats = [
  { value: "70,000+", label: "Propriétés analysées" },
  { value: "5", label: "Villes marocaines" },
  { value: "98%", label: "Précision des données" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-teal/10 via-transparent to-transparent opacity-40" />
      
      <div className="container mx-auto px-4 lg:px-8 pt-28 pb-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Intelligence Tarifaire pour le Maroc
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Optimisez vos
              <span className="text-primary"> revenus locatifs</span> avec l'IA
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              RiadPrix aide les propriétaires de riads, conciergeries et gestionnaires immobiliers à benchmarker leurs prix et maximiser leurs revenus grâce à l'intelligence de marché.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="xl" variant="hero" className="gap-2">
                Commencer Gratuitement
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline" className="gap-2">
                <Play className="h-5 w-5" />
                Voir la Démo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Feature Cards Preview */}
          <div className="relative animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="card-elevated p-5 animate-float"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-card border-2 border-border rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">+23% RevPAR</p>
                  <p className="text-xs text-muted-foreground">Amélioration moyenne</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
