import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sparkles, TrendingUp, ChevronDown, Loader2, Info, Users, AlertTriangle } from "lucide-react";
import type { Animal, HerdBreedingRecommendation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Breeding() {
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [expandedAnalysis, setExpandedAnalysis] = useState(false);
  const { toast } = useToast();

  const { data: animals, isLoading: animalsLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const recommendationsMutation = useMutation({
    mutationFn: async (animalIds: string[]) => {
      const response = await apiRequest("POST", "/api/recommendations", {
        animalIds,
      });
      return await response.json();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const recommendations = Array.isArray(recommendationsMutation.data) 
    ? (recommendationsMutation.data as HerdBreedingRecommendation[]) 
    : undefined;

  const males = animals?.filter((a) => a.sex === "Male") || [];
  const females = animals?.filter((a) => a.sex === "Female") || [];
  
  const selectedMales = selectedAnimalIds.filter(id => 
    males.some(m => m.id === id)
  ).length;
  const selectedFemales = selectedAnimalIds.filter(id => 
    females.some(f => f.id === id)
  ).length;

  const canAnalyze = selectedMales > 0 && selectedFemales > 0 && selectedAnimalIds.length >= 2;

  const toggleAnimal = (id: string) => {
    setSelectedAnimalIds(prev => 
      prev.includes(id) 
        ? prev.filter(animalId => animalId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (animals) {
      setSelectedAnimalIds(animals.map(a => a.id));
    }
  };

  const deselectAll = () => {
    setSelectedAnimalIds([]);
  };

  if (animalsLoading) {
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

  if (!animals || animals.length === 0) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Herd Breeding Analysis</h1>
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">No Animals Available</h3>
              <p className="text-muted-foreground mt-1">
                Add animals to your herd to start generating breeding recommendations.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Herd Breeding Analysis</h1>
          <p className="text-muted-foreground text-lg mt-1">
            AI-powered breeding strategy for your entire herd
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="text-base px-3 py-1">
            <Users className="h-4 w-4 mr-2" />
            {selectedAnimalIds.length} Selected
          </Badge>
          {selectedMales > 0 && (
            <Badge className="text-base px-3 py-1">
              {selectedMales} Male{selectedMales !== 1 ? "s" : ""}
            </Badge>
          )}
          {selectedFemales > 0 && (
            <Badge variant="secondary" className="text-base px-3 py-1">
              {selectedFemales} Female{selectedFemales !== 1 ? "s" : ""}
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={selectAll}
            data-testid="button-select-all"
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deselectAll}
            data-testid="button-deselect-all"
          >
            Deselect All
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Animals for Herd Analysis</CardTitle>
          <CardDescription>
            Choose at least 2 animals (minimum 1 male and 1 female) to analyze breeding potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {animals.map((animal) => (
              <div
                key={animal.id}
                className={`flex items-center gap-4 p-4 rounded-lg border hover-elevate ${
                  selectedAnimalIds.includes(animal.id) ? "bg-accent/50 border-primary" : ""
                }`}
                data-testid={`animal-select-${animal.id}`}
              >
                <Checkbox
                  checked={selectedAnimalIds.includes(animal.id)}
                  onCheckedChange={() => toggleAnimal(animal.id)}
                  data-testid={`checkbox-animal-${animal.id}`}
                />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="font-semibold">{animal.name}</p>
                    <Badge 
                      variant={animal.sex === "Male" ? "default" : "secondary"}
                      className="text-xs mt-1"
                    >
                      {animal.sex}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Species:</span>
                    <span className="ml-2 font-medium">{animal.species}</span>
                  </div>
                  {animal.hornSize && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Horn:</span>
                      <span className="ml-2 font-medium">{animal.hornSize}"</span>
                    </div>
                  )}
                  {animal.healthNotes && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Health:</span>
                      <span className="ml-2 font-medium truncate">{animal.healthNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => recommendationsMutation.mutate(selectedAnimalIds)}
              disabled={!canAnalyze || recommendationsMutation.isPending}
              data-testid="button-analyze-herd"
            >
              {recommendationsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Herd...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Herd Breeding Potential
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!canAnalyze && selectedAnimalIds.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Select at least 1 male and 1 female to generate breeding analysis.
            Currently: {selectedMales} male(s), {selectedFemales} female(s)
          </AlertDescription>
        </Alert>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <Card
              key={index}
              data-testid={`card-herd-recommendation`}
              className="hover-elevate"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span>Herd Breeding Analysis</span>
                      <Badge variant="outline" className="font-mono">
                        Score: {rec.herdScore.toFixed(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Analysis of {rec.herdAnimals.length} selected animals
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {rec.analysis.hasRelatedAnimals && rec.analysis.relatedAnimalsWarning && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-semibold">Lineage Warning:</span> {rec.analysis.relatedAnimalsWarning}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-1">Est. Offspring</p>
                      <p className="text-2xl font-bold">
                        {rec.analysis.predictedOutcomes.estimatedOffspringCount}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-1">Trait Strength</p>
                      <p className="text-2xl font-bold">
                        {rec.analysis.predictedOutcomes.traitStrength}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-1">Genetic Diversity</p>
                      <p className="text-2xl font-bold">
                        {rec.analysis.predictedOutcomes.geneticDiversity}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                      <p className="text-2xl font-bold font-mono">
                        {(rec.analysis.confidence * 100).toFixed(0)}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {rec.analysis.predictedOutcomes.averageHornSize && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm">
                      <span className="font-semibold">Estimated Average Horn Size:</span>{" "}
                      {rec.analysis.predictedOutcomes.averageHornSize.toFixed(2)} inches
                    </p>
                  </div>
                )}

                <div className="border-t pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-lg">Breeding Strategy</h4>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-4 text-sm leading-relaxed">
                    {rec.analysis.breedingStrategy}
                  </div>
                </div>

                <Collapsible
                  open={expandedAnalysis}
                  onOpenChange={setExpandedAnalysis}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Detailed AI Analysis
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedAnalysis ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed">
                      {rec.analysis.explanation}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
