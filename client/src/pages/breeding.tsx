import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sparkles, TrendingUp, ChevronDown, Loader2, Info } from "lucide-react";
import type { Animal, BreedingPairRecommendation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Breeding() {
  const [expandedPair, setExpandedPair] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: animals, isLoading: animalsLoading } = useQuery<Animal[]>({
    queryKey: ["/api/animals"],
  });

  const recommendationsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/recommendations");
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
    ? (recommendationsMutation.data as BreedingPairRecommendation[]) 
    : undefined;

  const males = animals?.filter((a) => a.sex === "Male") || [];
  const females = animals?.filter((a) => a.sex === "Female") || [];

  const canBreed = males.length > 0 && females.length > 0;

  if (animalsLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Breeding Recommendations</h1>
          <p className="text-muted-foreground text-lg mt-1">
            AI-powered optimal breeding pair suggestions
          </p>
        </div>
        {canBreed && (
          <Button
            onClick={() => recommendationsMutation.mutate()}
            disabled={recommendationsMutation.isPending}
            data-testid="button-generate-recommendations"
          >
            {recommendationsMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Recommendations
              </>
            )}
          </Button>
        )}
      </div>

      {!canBreed ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Insufficient Animals</h3>
              <p className="text-muted-foreground mt-1">
                You need at least one male and one female animal to generate breeding recommendations.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Current: {males.length} male(s), {females.length} female(s)
              </p>
            </div>
          </div>
        </Card>
      ) : !recommendations ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Ready to Generate Recommendations</h3>
              <p className="text-muted-foreground mt-1">
                Click the button above to get AI-powered breeding pair suggestions based on genetic compatibility.
              </p>
            </div>
          </div>
        </Card>
      ) : recommendations.length === 0 ? (
        <Alert>
          <AlertDescription>
            No suitable breeding pairs found. This may be due to genetic incompatibility or insufficient data.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Found {recommendations.length} optimal breeding pair{recommendations.length !== 1 ? "s" : ""} based on genetic analysis.
            </AlertDescription>
          </Alert>

          {recommendations.map((rec, index) => (
            <Card
              key={`${rec.parent1.id}-${rec.parent2.id}`}
              data-testid={`card-recommendation-${index}`}
              className="hover-elevate"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <span>Breeding Pair #{index + 1}</span>
                      <Badge variant="outline" className="font-mono">
                        Score: {rec.compatibilityScore.toFixed(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Compatibility score based on genetic analysis
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        PARENT 1 (MALE)
                      </h4>
                      <Badge>Male</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold">{rec.parent1.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Breed:</span>
                          <span className="ml-2 font-medium">{rec.parent1.breed}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Age:</span>
                          <span className="ml-2 font-medium">{rec.parent1.age} yrs</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Genetic:</span>
                          <span className="ml-2 font-mono font-semibold text-chart-1">
                            {rec.parent1.geneticScore}
                          </span>
                        </div>
                        {rec.parent1.hornSize && (
                          <div>
                            <span className="text-muted-foreground">Horn:</span>
                            <span className="ml-2 font-medium">{rec.parent1.hornSize}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        PARENT 2 (FEMALE)
                      </h4>
                      <Badge variant="secondary">Female</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold">{rec.parent2.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Breed:</span>
                          <span className="ml-2 font-medium">{rec.parent2.breed}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Age:</span>
                          <span className="ml-2 font-medium">{rec.parent2.age} yrs</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Genetic:</span>
                          <span className="ml-2 font-mono font-semibold text-chart-1">
                            {rec.parent2.geneticScore}
                          </span>
                        </div>
                        {rec.parent2.hornSize && (
                          <div>
                            <span className="text-muted-foreground">Horn:</span>
                            <span className="ml-2 font-medium">{rec.parent2.hornSize}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-lg">Predicted Offspring</h4>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          Predicted Genetic Score
                        </p>
                        <p className="text-2xl font-bold font-mono text-chart-1">
                          {rec.prediction.predictedGeneticScore.toFixed(1)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Breed Strength</p>
                        <p className="text-2xl font-bold">
                          {rec.prediction.predictedTraits.breedStrength}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                        <p className="text-2xl font-bold font-mono">
                          {(rec.prediction.confidence * 100).toFixed(0)}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {rec.prediction.predictedTraits.estimatedHornSize && (
                    <p className="text-sm text-muted-foreground mb-4">
                      <span className="font-medium">Estimated Horn Size:</span>{" "}
                      {rec.prediction.predictedTraits.estimatedHornSize.toFixed(2)} inches
                    </p>
                  )}

                  <Collapsible
                    open={expandedPair === index}
                    onOpenChange={() => setExpandedPair(expandedPair === index ? null : index)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          AI Analysis & Explanation
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedPair === index ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed">
                        {rec.prediction.explanation}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
