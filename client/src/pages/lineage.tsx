import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Network, Info, Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Animal, Herd, InsertHerd } from "@shared/schema";
import { insertHerdSchema } from "@shared/schema";

interface FamilyGroup {
  id: string;
  sire: Animal | null;
  dam: Animal | null;
  offspring: Animal[];
}

export default function Lineage() {
  const { toast } = useToast();
  const [herdDialogOpen, setHerdDialogOpen] = useState(false);
  const [editingHerd, setEditingHerd] = useState<Herd | null>(null);
  const [selectedHerd, setSelectedHerd] = useState<string | null>(null);

  const { data: animals, isLoading: animalsLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const { data: herds, isLoading: herdsLoading } = useQuery<Herd[]>({
    queryKey: ["/api/herds"],
  });

  const form = useForm<InsertHerd>({
    resolver: zodResolver(insertHerdSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createHerdMutation = useMutation({
    mutationFn: async (data: InsertHerd) => {
      const response = await apiRequest("POST", "/api/herds", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/herds"] });
      toast({
        title: "Herd created",
        description: "The herd has been successfully created.",
      });
      setHerdDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create herd. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateHerdMutation = useMutation({
    mutationFn: async (data: { id: string; herd: InsertHerd }) => {
      const response = await apiRequest("PUT", `/api/herds/${data.id}`, data.herd);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/herds"] });
      toast({
        title: "Herd updated",
        description: "The herd has been successfully updated.",
      });
      setHerdDialogOpen(false);
      setEditingHerd(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update herd. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteHerdMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/herds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/herds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "Herd deleted",
        description: "The herd has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete herd. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateAnimalHerdMutation = useMutation({
    mutationFn: async (data: { animalId: string; herdId: string | null }) => {
      const animal = animals?.find(a => a.id === data.animalId);
      if (!animal) throw new Error("Animal not found");
      
      const updateData = {
        name: animal.name,
        species: animal.species,
        sex: animal.sex as "Male" | "Female",
        healthNotes: animal.healthNotes || undefined,
        hornSize: animal.hornSize ? parseFloat(animal.hornSize) : undefined,
        sireId: animal.sireId || undefined,
        damId: animal.damId || undefined,
        herdId: data.herdId || undefined,
      };
      
      const response = await apiRequest("PUT", `/api/animals/${data.animalId}`, updateData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "Animal updated",
        description: "Animal has been assigned to herd.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update animal herd assignment.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertHerd) => {
    if (editingHerd) {
      updateHerdMutation.mutate({ id: editingHerd.id, herd: data });
    } else {
      createHerdMutation.mutate(data);
    }
  };

  const handleEditHerd = (herd: Herd) => {
    setEditingHerd(herd);
    form.reset({
      name: herd.name,
      description: herd.description || "",
    });
    setHerdDialogOpen(true);
  };

  const handleDeleteHerd = (herdId: string) => {
    if (confirm("Are you sure you want to delete this herd? Animals will not be deleted, just unassigned from the herd.")) {
      deleteHerdMutation.mutate(herdId);
    }
  };

  const handleCreateNew = () => {
    setEditingHerd(null);
    form.reset({
      name: "",
      description: "",
    });
    setHerdDialogOpen(true);
  };

  const buildFamilyGroups = (animals: Animal[]): FamilyGroup[] => {
    const animalMap = new Map<string, Animal>();
    animals?.forEach((animal) => animalMap.set(animal.id, animal));

    const groups: FamilyGroup[] = [];
    const grouped = new Set<string>();

    const parentPairMap = new Map<string, Animal[]>();
    
    animals?.forEach((animal) => {
      if (animal.sireId || animal.damId) {
        const key = `${animal.sireId || "none"}-${animal.damId || "none"}`;
        if (!parentPairMap.has(key)) {
          parentPairMap.set(key, []);
        }
        parentPairMap.get(key)!.push(animal);
        grouped.add(animal.id);
      }
    });

    parentPairMap.forEach((offspring, key) => {
      const [sireId, damId] = key.split("-");
      const sire = sireId !== "none" ? animalMap.get(sireId) || null : null;
      const dam = damId !== "none" ? animalMap.get(damId) || null : null;

      if (sire) grouped.add(sire.id);
      if (dam) grouped.add(dam.id);

      groups.push({
        id: key,
        sire,
        dam,
        offspring,
      });
    });

    animals?.forEach((animal) => {
      if (!grouped.has(animal.id)) {
        groups.push({
          id: `standalone-${animal.id}`,
          sire: animal.sex === "Male" ? animal : null,
          dam: animal.sex === "Female" ? animal : null,
          offspring: [],
        });
      }
    });

    return groups;
  };

  const renderAnimalCard = (animal: Animal | null, showHerdSelector: boolean = false) => {
    if (!animal) {
      return (
        <div className="w-40 h-28 border-2 border-dashed border-muted rounded-md flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Unknown</span>
        </div>
      );
    }

    return (
      <Card
        className="w-40 hover-elevate flex-shrink-0"
        data-testid={`card-animal-${animal.id}`}
      >
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm flex flex-col gap-1">
            <span className="truncate font-semibold">{animal.name}</span>
            <div className="flex gap-1">
              <Badge
                variant={animal.sex === "Male" ? "default" : "secondary"}
                className="text-xs w-fit px-1.5 py-0"
              >
                {animal.sex}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-1">
          <div className="text-xs space-y-0.5">
            <div className="text-muted-foreground truncate">{animal.species}</div>
            {animal.hornSize && (
              <div className="font-medium">
                Horn: {animal.hornSize}"
              </div>
            )}
          </div>
          {showHerdSelector && (
            <Select
              value={animal.herdId || "none"}
              onValueChange={(value) => {
                updateAnimalHerdMutation.mutate({
                  animalId: animal.id,
                  herdId: value === "none" ? null : value,
                });
              }}
            >
              <SelectTrigger className="h-7 text-xs mt-2" data-testid={`select-herd-${animal.id}`}>
                <SelectValue placeholder="Assign herd" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Herd</SelectItem>
                {herds?.map((herd) => (
                  <SelectItem key={herd.id} value={herd.id} data-testid={`option-herd-${herd.id}`}>
                    {herd.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderFamilyGroup = (group: FamilyGroup, showHerdSelector: boolean = false) => {
    const hasParents = group.sire || group.dam;
    const hasOffspring = group.offspring.length > 0;

    if (!hasParents && !hasOffspring) return null;

    const offspringCount = group.offspring.length;

    return (
      <div key={group.id} className="family-group mb-12 flex flex-col items-center">
        {hasParents && (
          <div className="parents-row flex items-center gap-4 mb-2 relative">
            <div className="relative">
              {renderAnimalCard(group.sire, showHerdSelector)}
            </div>

            {group.sire && group.dam && (
              <div className="flex flex-col items-center relative">
                <div className="w-8 h-0.5 bg-border"></div>
                {hasOffspring && (
                  <div className="w-0.5 h-8 bg-border"></div>
                )}
              </div>
            )}

            {(group.sire || group.dam) && !(group.sire && group.dam) && hasOffspring && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-8 bg-border"></div>
            )}

            <div className="relative">
              {renderAnimalCard(group.dam, showHerdSelector)}
            </div>
          </div>
        )}

        {hasOffspring && (
          <div className="offspring-row flex flex-col items-center relative">
            {offspringCount > 1 && (
              <div className="horizontal-connector mb-2 relative">
                <div 
                  className="h-0.5 bg-border"
                  style={{ 
                    width: `${(offspringCount - 1) * 11}rem`
                  }}
                ></div>
              </div>
            )}

            {offspringCount === 1 && (
              <div className="w-0.5 h-8 bg-border mb-2"></div>
            )}

            <div className="flex items-start gap-4 flex-wrap justify-center max-w-7xl">
              {group.offspring.map((child) => (
                <div key={child.id} className="flex flex-col items-center relative">
                  {offspringCount > 1 && (
                    <div 
                      className="w-0.5 bg-border mb-2"
                      style={{ height: "2rem" }}
                    ></div>
                  )}
                  {renderAnimalCard(child, showHerdSelector)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const isLoading = animalsLoading || herdsLoading;

  if (isLoading || !animals || !herds) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Filter animals by selected herd
  const filteredAnimals = selectedHerd
    ? animals.filter(a => a.herdId === selectedHerd)
    : animals;

  const familyGroups = buildFamilyGroups(filteredAnimals);
  const groupsWithOffspring = familyGroups.filter(g => g.offspring.length > 0);
  const standaloneGroups = familyGroups.filter(g => g.offspring.length === 0);

  const animalsWithoutHerd = animals.filter(a => !a.herdId);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-full mx-auto">
      <div className="space-y-2 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Network className="h-8 w-8" />
          Herd Data
        </h1>
        <p className="text-muted-foreground text-lg">
          Organize animals into herds and visualize family relationships
        </p>
      </div>

      {/* Herd Management Section */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Herds</h2>
          <Dialog open={herdDialogOpen} onOpenChange={setHerdDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateNew} data-testid="button-create-herd">
                <Plus className="h-4 w-4 mr-2" />
                Create Herd
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingHerd ? "Edit Herd" : "Create New Herd"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Herd Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Main Breeding Herd"
                            {...field}
                            data-testid="input-herd-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the purpose of this herd..."
                            {...field}
                            data-testid="input-herd-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={createHerdMutation.isPending || updateHerdMutation.isPending}
                      data-testid="button-save-herd"
                    >
                      {editingHerd ? "Update" : "Create"} Herd
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {herds && herds.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {herds.map((herd) => {
              const herdAnimalCount = animals?.filter(a => a.herdId === herd.id).length || 0;
              return (
                <Card
                  key={herd.id}
                  className={`hover-elevate cursor-pointer ${selectedHerd === herd.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedHerd(selectedHerd === herd.id ? null : herd.id)}
                  data-testid={`card-herd-${herd.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <FolderOpen className="h-5 w-5" />
                          {herd.name}
                        </CardTitle>
                        {herd.description && (
                          <CardDescription className="mt-2">
                            {herd.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditHerd(herd)}
                          data-testid={`button-edit-herd-${herd.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteHerd(herd.id)}
                          data-testid={`button-delete-herd-${herd.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">
                      {herdAnimalCount} animal{herdAnimalCount !== 1 ? 's' : ''}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8">
            <div className="text-center space-y-2">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold">No Herds Yet</h3>
              <p className="text-muted-foreground">
                Create your first herd to organize your animals
              </p>
            </div>
          </Card>
        )}

        {selectedHerd && (
          <Alert>
            <Network className="h-4 w-4" />
            <AlertDescription>
              Viewing herd: <strong>{herds?.find(h => h.id === selectedHerd)?.name}</strong>
              {" "}
              <Button 
                variant="ghost" 
                className="p-0 h-auto underline" 
                onClick={() => setSelectedHerd(null)}
                data-testid="button-clear-herd-filter"
              >
                View all animals
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Animals and Lineage Section */}
      {animals && animals.length === 0 ? (
        <Card className="p-12 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">No Animals Found</h3>
              <p className="text-muted-foreground mt-1">
                Add animals to your breeding program to start tracking lineages.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-6 max-w-7xl mx-auto">
          {animalsWithoutHerd.length > 0 && !selectedHerd && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {animalsWithoutHerd.length} animal{animalsWithoutHerd.length !== 1 ? 's are' : ' is'} not assigned to any herd.
                Use the dropdown on animal cards below to assign them.
              </AlertDescription>
            </Alert>
          )}

          {familyGroups.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Info className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">No Animals in This View</h3>
                  <p className="text-muted-foreground mt-1">
                    {selectedHerd 
                      ? "No animals assigned to this herd yet. Use the dropdown on animal cards to assign them."
                      : "Start adding parent relationships when adding or editing animals to build your hereditary tree."
                    }
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-12 py-8">
              {groupsWithOffspring.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold">Family Lineages</h2>
                  <div className="space-y-12">
                    {groupsWithOffspring.map((group) => renderFamilyGroup(group, true))}
                  </div>
                </div>
              )}

              {standaloneGroups.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold">Individual Animals</h2>
                  <div className="flex gap-4 flex-wrap">
                    {standaloneGroups.map((group) => (
                      <div key={group.id}>
                        {renderAnimalCard(group.sire || group.dam, true)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
