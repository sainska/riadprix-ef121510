import { useState } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";

const cities = [
  { id: "marrakech", name: "Marrakech", properties: 2847, flag: "🇲🇦" },
  { id: "fes", name: "Fès", properties: 1234, flag: "🇲🇦" },
  { id: "casablanca", name: "Casablanca", properties: 1876, flag: "🇲🇦" },
  { id: "tangier", name: "Tanger", properties: 943, flag: "🇲🇦" },
  { id: "essaouira", name: "Essaouira", properties: 567, flag: "🇲🇦" },
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border-2 border-border hover:border-primary/30 transition-all min-w-[220px] shadow-sm"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left flex-1">
          <p className="font-semibold text-foreground">{selected.name}</p>
          <p className="text-xs text-muted-foreground">{selected.properties.toLocaleString('fr-FR')} propriétés</p>
        </div>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full min-w-[260px] rounded-xl border-2 border-border bg-card shadow-xl animate-scale-in z-50 overflow-hidden">
            <div className="p-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onCityChange(city.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    city.id === selectedCity 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <span className="text-xl">{city.flag}</span>
                  <div className="text-left flex-1">
                    <p className="font-medium">{city.name}</p>
                    <p className="text-xs text-muted-foreground">{city.properties.toLocaleString('fr-FR')} propriétés</p>
                  </div>
                  {city.id === selectedCity && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
