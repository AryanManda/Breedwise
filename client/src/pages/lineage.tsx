import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Network, Info } from "lucide-react";
import type { Animal } from "@shared/schema";

interface FamilyGroup {
  id: string;
  sire: Animal | null;
  dam: Animal | null;
  offspring: Animal[];
}

export default function Lineage() {
  const { data: animals, isLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const buildFamilyGroups = (animals: Animal[]): FamilyGroup[] => {
    const animalMap = new Map<string, Animal>();
    animals?.forEach((animal) => animalMap.set(animal.id, animal));

    const groups: FamilyGroup[] = [];
    const grouped = new Set<string>();

    // Group offspring by their parent pairs
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

    // Create family groups
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

    // Add standalone animals without lineage connections
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

  const familyGroups = buildFamilyGroups(animals || []);

  const renderAnimalCard = (animal: Animal | null) => {
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
            <Badge
              variant={animal.sex === "Male" ? "default" : "secondary"}
              className="text-xs w-fit px-1.5 py-0"
            >
              {animal.sex}
            </Badge>
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
        </CardContent>
      </Card>
    );
  };

  const renderFamilyGroup = (group: FamilyGroup) => {
    const hasParents = group.sire || group.dam;
    const hasOffspring = group.offspring.length > 0;

    if (!hasParents && !hasOffspring) return null;

    const offspringCount = group.offspring.length;

    return (
      <div key={group.id} className="family-group mb-12 flex flex-col items-center">
        {/* Parents Row */}
        {hasParents && (
          <div className="parents-row flex items-center gap-4 mb-2 relative">
            {/* Sire */}
            <div className="relative">
              {renderAnimalCard(group.sire)}
            </div>

            {/* Connection between parents */}
            {group.sire && group.dam && (
              <div className="flex flex-col items-center relative">
                <div className="w-8 h-0.5 bg-border"></div>
                {hasOffspring && (
                  <div className="w-0.5 h-8 bg-border"></div>
                )}
              </div>
            )}

            {/* Single parent with line down */}
            {(group.sire || group.dam) && !(group.sire && group.dam) && hasOffspring && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-8 bg-border"></div>
            )}

            {/* Dam */}
            <div className="relative">
              {renderAnimalCard(group.dam)}
            </div>
          </div>
        )}

        {/* Offspring Row */}
        {hasOffspring && (
          <div className="offspring-row flex flex-col items-center relative">
            {/* Horizontal connector line for multiple offspring */}
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

            {/* Single offspring with vertical line */}
            {offspringCount === 1 && (
              <div className="w-0.5 h-8 bg-border mb-2"></div>
            )}

            {/* Offspring cards */}
            <div className="flex items-start gap-4 flex-wrap justify-center max-w-7xl">
              {group.offspring.map((child, index) => (
                <div key={child.id} className="flex flex-col items-center relative">
                  {/* Vertical line up to horizontal connector for multiple offspring */}
                  {offspringCount > 1 && (
                    <div 
                      className="w-0.5 bg-border mb-2"
                      style={{ height: "2rem" }}
                    ></div>
                  )}
                  {renderAnimalCard(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const animalsWithoutLineage = animals?.filter((a) => !a.sireId && !a.damId) || [];
  const animalsWithLineage = animals?.filter((a) => a.sireId || a.damId) || [];

  // Separate groups with offspring from those without
  const groupsWithOffspring = familyGroups.filter(g => g.offspring.length > 0);
  const standaloneGroups = familyGroups.filter(g => g.offspring.length === 0);

  return (
    <div className="p-6 space-y-6 max-w-full mx-auto">
      <div className="space-y-2 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Network className="h-8 w-8" />
          Herd Data
        </h1>
        <p className="text-muted-foreground text-lg">
          Visualize parent-child relationships and family structure
        </p>
      </div>

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
          <Alert>
            <Network className="h-4 w-4" />
            <AlertDescription>
              Tracking {animalsWithLineage.length} animal{animalsWithLineage.length !== 1 ? "s" : ""} with lineage data.
              {animalsWithoutLineage.length > 0 && 
                ` ${animalsWithoutLineage.length} animal${animalsWithoutLineage.length !== 1 ? "s" : ""} without parent records.`
              }
            </AlertDescription>
          </Alert>

          {familyGroups.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Info className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">No Lineage Data Yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Start adding parent relationships when adding or editing animals to build your hereditary tree.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-12 py-8">
              {/* Family groups with offspring */}
              {groupsWithOffspring.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold">Family Lineages</h2>
                  <div className="space-y-12">
                    {groupsWithOffspring.map((group) => renderFamilyGroup(group))}
                  </div>
                </div>
              )}

              {/* Standalone animals */}
              {standaloneGroups.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold">Individual Animals</h2>
                  <div className="flex gap-4 flex-wrap">
                    {standaloneGroups.map((group) => (
                      <div key={group.id}>
                        {renderAnimalCard(group.sire || group.dam)}
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
