import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  TrendingUp, 
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockProperties = [
  {
    id: '1',
    name: 'Riad Jasmine',
    type: 'riad',
    location: 'Marrakech, Medina',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    currentPrice: 185,
    occupancy: 82,
    status: 'active',
  },
  {
    id: '2',
    name: 'Villa Atlas',
    type: 'villa',
    location: 'Marrakech, Palmeraie',
    bedrooms: 5,
    bathrooms: 5,
    maxGuests: 10,
    currentPrice: 350,
    occupancy: 75,
    status: 'active',
  },
  {
    id: '3',
    name: 'Apartment Gueliz',
    type: 'apartment',
    location: 'Marrakech, Gueliz',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    currentPrice: 85,
    occupancy: 68,
    status: 'inactive',
  },
];

export default function Properties() {
  const [properties, setProperties] = useState(mockProperties);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    type: 'riad',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
  });
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleAddProperty = () => {
    if (!newProperty.name || !newProperty.location) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const property = {
      id: String(properties.length + 1),
      ...newProperty,
      currentPrice: 100,
      occupancy: 0,
      status: 'active',
    };

    setProperties([...properties, property]);
    setDialogOpen(false);
    setNewProperty({
      name: '',
      type: 'riad',
      location: '',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
    });

    toast({
      title: language === 'fr' ? 'Propriété ajoutée' : 'Property Added',
      description: language === 'fr' ? 'Votre propriété a été ajoutée avec succès' : 'Your property has been added successfully',
    });
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
    toast({
      title: language === 'fr' ? 'Propriété supprimée' : 'Property Deleted',
      description: language === 'fr' ? 'La propriété a été supprimée' : 'The property has been deleted',
    });
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; fr: string }> = {
      riad: { en: 'Riad', fr: 'Riad' },
      villa: { en: 'Villa', fr: 'Villa' },
      apartment: { en: 'Apartment', fr: 'Appartement' },
      hotel: { en: 'Hotel', fr: 'Hôtel' },
      guesthouse: { en: 'Guesthouse', fr: 'Maison d\'hôtes' },
    };
    return labels[type]?.[language] || type;
  };

  return (
    <>
      <Helmet>
        <title>Properties - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Manage your vacation rental properties with RiadPrix." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {language === 'fr' ? 'Mes Propriétés' : 'My Properties'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'fr' ? 'Gérez vos propriétés de location' : 'Manage your rental properties'}
              </p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {language === 'fr' ? 'Ajouter une propriété' : 'Add Property'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{language === 'fr' ? 'Nouvelle Propriété' : 'New Property'}</DialogTitle>
                  <DialogDescription>
                    {language === 'fr' ? 'Ajoutez les détails de votre propriété' : 'Add your property details'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{language === 'fr' ? 'Nom' : 'Name'}</Label>
                    <Input
                      id="name"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                      placeholder={language === 'fr' ? 'Ex: Riad Jasmine' : 'e.g., Riad Jasmine'}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">{language === 'fr' ? 'Type' : 'Type'}</Label>
                    <Select
                      value={newProperty.type}
                      onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riad">Riad</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="apartment">{language === 'fr' ? 'Appartement' : 'Apartment'}</SelectItem>
                        <SelectItem value="guesthouse">{language === 'fr' ? 'Maison d\'hôtes' : 'Guesthouse'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">{language === 'fr' ? 'Emplacement' : 'Location'}</Label>
                    <Input
                      id="location"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                      placeholder={language === 'fr' ? 'Ex: Marrakech, Medina' : 'e.g., Marrakech, Medina'}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bedrooms">{language === 'fr' ? 'Chambres' : 'Bedrooms'}</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min={1}
                        value={newProperty.bedrooms}
                        onChange={(e) => setNewProperty({ ...newProperty, bedrooms: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bathrooms">{language === 'fr' ? 'Salles de bain' : 'Bathrooms'}</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min={1}
                        value={newProperty.bathrooms}
                        onChange={(e) => setNewProperty({ ...newProperty, bathrooms: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="guests">{language === 'fr' ? 'Voyageurs' : 'Guests'}</Label>
                      <Input
                        id="guests"
                        type="number"
                        min={1}
                        value={newProperty.maxGuests}
                        onChange={(e) => setNewProperty({ ...newProperty, maxGuests: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    {language === 'fr' ? 'Annuler' : 'Cancel'}
                  </Button>
                  <Button onClick={handleAddProperty}>
                    {language === 'fr' ? 'Ajouter' : 'Add'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Properties Grid */}
          {properties.length === 0 ? (
            <Card className="border-border/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {language === 'fr' ? 'Aucune propriété' : 'No Properties'}
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {language === 'fr' ? 'Ajoutez votre première propriété pour commencer' : 'Add your first property to get started'}
                </p>
                <Button onClick={() => setDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {language === 'fr' ? 'Ajouter une propriété' : 'Add Property'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="border-border/50 overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-primary/50" />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            {language === 'fr' ? 'Voir' : 'View'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            {language === 'fr' ? 'Modifier' : 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            {language === 'fr' ? 'Supprimer' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                        {property.status === 'active' 
                          ? (language === 'fr' ? 'Actif' : 'Active')
                          : (language === 'fr' ? 'Inactif' : 'Inactive')
                        }
                      </Badge>
                      <Badge variant="outline">{getPropertyTypeLabel(property.type)}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {property.bathrooms}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {property.maxGuests}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground">{language === 'fr' ? 'Prix/Nuit' : 'Price/Night'}</p>
                        <p className="text-lg font-semibold text-foreground">€{property.currentPrice}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{language === 'fr' ? 'Occupation' : 'Occupancy'}</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-lg font-semibold text-foreground">{property.occupancy}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
