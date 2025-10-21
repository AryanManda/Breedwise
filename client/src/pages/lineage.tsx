import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileTree, Info } from "lucide-react";
import type { Animal } from "@shared/schema";

interface TreeNode {
  animal: Animal;
  children: TreeNode[];
  level: number;
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

  const buildTree = (animals: Animal[]): { trees: TreeNode[], orphans: Animal[] } => {
    const animalMap = new Map<string, Animal>();
    animals?.forEach((animal) => animalMap.set(animal.id, animal));

    const roots: TreeNode[] = [];
    const coveredIds = new Set<string>();

    const collectCoveredIds = (node: TreeNode) => {
      coveredIds.add(node.animal.id);
      node.children.forEach(collectCoveredIds);
    };

    const buildNodeTree = (animal: Animal, level: number, visited: Set<string> = new Set()): TreeNode => {
      if (visited.has(animal.id)) {
        return { animal, children: [], level };
      }
      
      visited.add(animal.id);
      
      const children = animals?.filter(
        (a) => (a.sireId === animal.id || a.damId === animal.id) && !visited.has(a.id)
      ) || [];

      return {
        animal,
        children: children.map((child) => buildNodeTree(child, level + 1, new Set(visited))),
        level,
      };
    };

    animals?.forEach((animal) => {
      const sireExists = !!(animal.sireId && animalMap.has(animal.sireId));
      const damExists = !!(animal.damId && animalMap.has(animal.damId));
      
      const parentExists = sireExists || damExists;
      const isRoot = !parentExists;
      
      if (isRoot && !coveredIds.has(animal.id)) {
        const tree = buildNodeTree(animal, 0);
        roots.push(tree);
        collectCoveredIds(tree);
      }
    });

    const orphans = animals?.filter((a) => !coveredIds.has(a.id)) || [];

    return { trees: roots, orphans };
  };

  const { trees, orphans } = buildTree(animals || []);

  const renderTree = (node: TreeNode, parentPath: string = "") => {
    const path = `${parentPath}-${node.animal.id}`;
    const hasChildren = node.children.length > 0;

    return (
      <div key={path} className="space-y-3">
        <Card className="hover-elevate" data-testid={`card-animal-${node.animal.id}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>{node.animal.name}</span>
                  <Badge variant={node.animal.sex === "Male" ? "default" : "secondary"}>
                    {node.animal.sex}
                  </Badge>
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Species:</span>
                <span className="ml-2 font-medium">{node.animal.species}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Breed:</span>
                <span className="ml-2 font-medium">{node.animal.breed}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Age:</span>
                <span className="ml-2 font-medium">{node.animal.age} yrs</span>
              </div>
              <div>
                <span className="text-muted-foreground">Weight:</span>
                <span className="ml-2 font-mono font-medium">
                  {parseFloat(node.animal.weight).toFixed(0)} lbs
                </span>
              </div>
            </div>
            {node.animal.hornSize && (
              <div className="text-sm">
                <span className="text-muted-foreground">Horn Size:</span>
                <span className="ml-2 font-medium">{node.animal.hornSize}"</span>
              </div>
            )}
          </CardContent>
        </Card>

        {hasChildren && (
          <div className="ml-8 pl-4 border-l-2 border-border space-y-3">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Offspring ({node.children.length})
            </div>
            {node.children.map((child) => renderTree(child, path))}
          </div>
        )}
      </div>
    );
  };

  const animalsWithoutLineage = animals?.filter((a) => !a.sireId && !a.damId) || [];
  const animalsWithLineage = animals?.filter((a) => a.sireId || a.damId) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <FileTree className="h-8 w-8" />
          Lineage & Hereditary Tree
        </h1>
        <p className="text-muted-foreground text-lg">
          Visualize parent-child relationships and hereditary lineages
        </p>
      </div>

      {animals && animals.length === 0 ? (
        <Card className="p-12">
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
        <div className="space-y-6">
          <Alert>
            <FileTree className="h-4 w-4" />
            <AlertDescription>
              Tracking {animalsWithLineage.length} animal{animalsWithLineage.length !== 1 ? "s" : ""} with lineage data.
              {animalsWithoutLineage.length > 0 && 
                ` ${animalsWithoutLineage.length} animal${animalsWithoutLineage.length !== 1 ? "s" : ""} without parent records.`
              }
            </AlertDescription>
          </Alert>

          {trees.length === 0 && orphans.length === 0 && animalsWithLineage.length > 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All animals in your program have parent records, but no root lineage (animals without parents) to start the tree visualization.
              </AlertDescription>
            </Alert>
          ) : trees.length === 0 && orphans.length === 0 ? (
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
            <div className="space-y-8">
              {trees.map((tree) => (
                <div key={tree.animal.id} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                      Root Lineage
                    </Badge>
                  </div>
                  {renderTree(tree)}
                </div>
              ))}
              
              {orphans.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      Unanchored Animals
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({orphans.length} animal{orphans.length !== 1 ? "s" : ""} with circular or missing parent references)
                    </span>
                  </div>
                  <div className="space-y-3">
                    {orphans.map((animal) => (
                      <Card key={animal.id} className="hover-elevate" data-testid={`card-orphan-${animal.id}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <span>{animal.name}</span>
                                <Badge variant={animal.sex === "Male" ? "default" : "secondary"}>
                                  {animal.sex}
                                </Badge>
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-0">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Species:</span>
                              <span className="ml-2 font-medium">{animal.species}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Breed:</span>
                              <span className="ml-2 font-medium">{animal.breed}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Age:</span>
                              <span className="ml-2 font-medium">{animal.age} yrs</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="ml-2 font-mono font-medium">
                                {parseFloat(animal.weight).toFixed(0)} lbs
                              </span>
                            </div>
                          </div>
                          {animal.hornSize && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Horn Size:</span>
                              <span className="ml-2 font-medium">{animal.hornSize}"</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
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
