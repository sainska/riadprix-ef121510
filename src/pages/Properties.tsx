import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
import { useAuth } from "@/contexts/AuthContext";
import { propertiesApi } from "@/lib/api";
import { handleError } from "@/lib/monitoring";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Eye,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Database } from "@/integrations/supabase/types";

type PropertyType = Database['public']['Enums']['property_type'];
type Property = Database['public']['Tables']['properties']['Row'];

export default function Properties() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [newProperty, setNewProperty] = useState({
    name: '',
    type: 'riad' as PropertyType,
    city: '',
    neighborhood: '',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
  });
  const { language } = useLanguage();
  const { toast } = useToast();

  // Fetch user properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      try {
        return await propertiesApi.getUserProperties(user.id);
      } catch (error) {
        handleError(error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Update property mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Property> }) => {
      return await propertiesApi.updateProperty(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', user?.id] });
      setDialogOpen(false);
      setEditingProperty(null);
      setNewProperty({
        name: '',
        type: 'riad',
        city: '',
        neighborhood: '',
        bedrooms: 1,
        bathrooms: 1,
        max_guests: 2,
      });
      toast({
        title: language === 'fr' ? 'Propriété mise à jour' : 'Property Updated',
        description: language === 'fr' ? 'Votre propriété a été mise à jour avec succès' : 'Your property has been updated successfully',
      });
    },
    onError: (error) => {
      handleError(error);
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: error instanceof Error ? error.message : (language === 'fr' ? 'Une erreur est survenue' : 'An error occurred'),
        variant: 'destructive',
      });
    },
  });

  // Create property mutation
  const createMutation = useMutation({
    mutationFn: async (propertyData: typeof newProperty) => {
      if (!user?.id) throw new Error('User not authenticated');
      return await propertiesApi.createProperty({
        name: propertyData.name,
        property_type: propertyData.type,
        user_id: user.id,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        max_guests: propertyData.max_guests,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', user?.id] });
      setDialogOpen(false);
      setNewProperty({
        name: '',
        type: 'riad',
        city: '',
        neighborhood: '',
        bedrooms: 1,
        bathrooms: 1,
        max_guests: 2,
      });
      toast({
        title: language === 'fr' ? 'Propriété ajoutée' : 'Property Added',
        description: language === 'fr' ? 'Votre propriété a été ajoutée avec succès' : 'Your property has been added successfully',
      });
    },
    onError: (error) => {
      handleError(error);
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: error instanceof Error ? error.message : (language === 'fr' ? 'Une erreur est survenue' : 'An error occurred'),
        variant: 'destructive',
      });
    },
  });

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await propertiesApi.deleteProperty(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', user?.id] });
      toast({
        title: language === 'fr' ? 'Propriété supprimée' : 'Property Deleted',
        description: language === 'fr' ? 'La propriété a été supprimée' : 'The property has been deleted',
      });
    },
    onError: (error) => {
      handleError(error);
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: error instanceof Error ? error.message : (language === 'fr' ? 'Impossible de supprimer la propriété' : 'Could not delete property'),
        variant: 'destructive',
      });
    },
  });

  const handleSaveProperty = () => {
    if (!newProperty.name || !newProperty.city) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Veuillez remplir tous les champs requis' : 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    if (editingProperty) {
      updateMutation.mutate({
        id: editingProperty.id,
        data: {
          name: newProperty.name,
          property_type: newProperty.type,
          bedrooms: newProperty.bedrooms || null,
          bathrooms: newProperty.bathrooms || null,
          max_guests: newProperty.max_guests || null,
        },
      });
    } else {
      createMutation.mutate(newProperty);
    }
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette propriété ?' : 'Are you sure you want to delete this property?')) {
      deleteMutation.mutate(id);
    }
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
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12 flex-1">
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
            
            <Dialog 
              open={dialogOpen} 
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) {
                  setEditingProperty(null);
                  setNewProperty({
                    name: '',
                    type: 'riad',
                    city: '',
                    neighborhood: '',
                    bedrooms: 1,
                    bathrooms: 1,
                    max_guests: 2,
                  });
                }
              }}
            >
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
                      onValueChange={(value: PropertyType) => setNewProperty({ ...newProperty, type: value })}
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
                    <Label htmlFor="city">{language === 'fr' ? 'Ville' : 'City'}</Label>
                    <Input
                      id="city"
                      value={newProperty.city}
                      onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                      placeholder={language === 'fr' ? 'Ex: Marrakech' : 'e.g., Marrakech'}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="neighborhood">{language === 'fr' ? 'Quartier (optionnel)' : 'Neighborhood (optional)'}</Label>
                    <Input
                      id="neighborhood"
                      value={newProperty.neighborhood}
                      onChange={(e) => setNewProperty({ ...newProperty, neighborhood: e.target.value })}
                      placeholder={language === 'fr' ? 'Ex: Medina' : 'e.g., Medina'}
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
                        value={newProperty.max_guests}
                        onChange={(e) => setNewProperty({ ...newProperty, max_guests: parseInt(e.target.value) || 2 })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={createMutation.isPending}>
                    {language === 'fr' ? 'Annuler' : 'Cancel'}
                  </Button>
                  <Button 
                    onClick={handleSaveProperty} 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {language === 'fr' ? 'Enregistrement...' : 'Saving...'}
                      </>
                    ) : editingProperty ? (
                      language === 'fr' ? 'Mettre à jour' : 'Update'
                    ) : (
                      language === 'fr' ? 'Ajouter' : 'Add'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Properties Grid */}
          {isLoading ? (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
              </CardContent>
            </Card>
          ) : properties.length === 0 ? (
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
                          {property.market_id || 'Unknown location'}
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
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => {
                              setEditingProperty(property);
                              setNewProperty({
                                name: property.name,
                                type: property.property_type,
                                city: '',
                                neighborhood: '',
                                bedrooms: property.bedrooms || 1,
                                bathrooms: property.bathrooms || 1,
                                max_guests: property.max_guests || 2,
                              });
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            {language === 'fr' ? 'Modifier' : 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive"
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deleteMutation.isPending}
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
                      <Badge variant="default">
                        {getPropertyTypeLabel(property.property_type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {property.bedrooms}
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms}
                        </div>
                      )}
                      {property.max_guests && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {property.max_guests}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
