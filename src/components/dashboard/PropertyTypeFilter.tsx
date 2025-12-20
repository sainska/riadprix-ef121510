import { Home, Building, Castle, Tent, Building2, LayoutGrid } from "lucide-react";

const propertyTypes = [
  { id: "all", label: "Tous", icon: LayoutGrid },
  { id: "riad", label: "Riad", icon: Castle },
  { id: "apartment", label: "Appartement", icon: Building },
  { id: "villa", label: "Villa", icon: Home },
  { id: "guesthouse", label: "Maison d'hôtes", icon: Building2 },
];

interface PropertyTypeFilterProps {
  selected: string;
  onSelect: (type: string) => void;
}

export function PropertyTypeFilter({ selected, onSelect }: PropertyTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {propertyTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${
            selected === type.id 
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" 
              : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
          }`}
        >
          <type.icon className="h-4 w-4" />
          {type.label}
        </button>
      ))}
    </div>
  );
}
