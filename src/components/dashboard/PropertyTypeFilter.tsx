import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Building, Castle, Tent, Warehouse } from "lucide-react";

const propertyTypes = [
  { id: "all", label: "Tous", icon: Building },
  { id: "riad", label: "Riad", icon: Castle },
  { id: "apartment", label: "Appartement", icon: Home },
  { id: "villa", label: "Villa", icon: Warehouse },
  { id: "guesthouse", label: "Maison d'hôtes", icon: Tent },
];

interface PropertyTypeFilterProps {
  selected: string;
  onSelect: (type: string) => void;
}

export function PropertyTypeFilter({ selected, onSelect }: PropertyTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {propertyTypes.map((type) => (
        <Button
          key={type.id}
          variant={selected === type.id ? "gold" : "outline"}
          size="sm"
          onClick={() => onSelect(type.id)}
          className="gap-2"
        >
          <type.icon className="h-4 w-4" />
          {type.label}
        </Button>
      ))}
    </div>
  );
}
