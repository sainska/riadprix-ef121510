import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown } from "lucide-react";

const cities = [
  { id: "marrakech", name: "Marrakech", properties: 2847, emoji: "🏜️" },
  { id: "fes", name: "Fès", properties: 1234, emoji: "🕌" },
  { id: "casablanca", name: "Casablanca", properties: 1876, emoji: "🌊" },
  { id: "tangier", name: "Tanger", properties: 943, emoji: "⛵" },
  { id: "essaouira", name: "Essaouira", properties: 567, emoji: "🐚" },
];

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
}

export function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = cities.find(c => c.id === selectedCity) || cities[0];

  return (
    <div className="relative">
      <Button
        variant="glass"
        size="lg"
        className="gap-3 min-w-[200px] justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{selected.emoji}</span>
          <div className="text-left">
            <p className="font-semibold">{selected.name}</p>
            <p className="text-xs text-muted-foreground">{selected.properties.toLocaleString()} propriétés</p>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[240px] rounded-xl border border-border bg-card shadow-xl animate-scale-in z-50">
          <div className="p-2">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  onCityChange(city.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  city.id === selectedCity 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <span className="text-xl">{city.emoji}</span>
                <div className="text-left flex-1">
                  <p className="font-medium">{city.name}</p>
                  <p className="text-xs text-muted-foreground">{city.properties.toLocaleString()} propriétés</p>
                </div>
                {city.id === selectedCity && (
                  <MapPin className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
