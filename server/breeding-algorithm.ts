import type { Animal, BreedingPairRecommendation } from "@shared/schema";
import { analyzeBreedingPair } from "./gemini";

export async function generateBreedingRecommendations(
  animals: Animal[]
): Promise<BreedingPairRecommendation[]> {
  const males = animals.filter((a) => a.sex === "Male");
  const females = animals.filter((a) => a.sex === "Female");

  if (males.length === 0 || females.length === 0) {
    return [];
  }

  const pairs: Array<{
    parent1: Animal;
    parent2: Animal;
    compatibilityScore: number;
  }> = [];

  for (const male of males) {
    for (const female of females) {
      if (areRelated(male, female, animals)) {
        continue;
      }

      const compatibility = calculateCompatibilityScore(male, female);

      pairs.push({
        parent1: male,
        parent2: female,
        compatibilityScore: compatibility,
      });
    }
  }

  pairs.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  const topPairs = pairs.slice(0, Math.min(5, pairs.length));

  const recommendations: BreedingPairRecommendation[] = [];

  for (const pair of topPairs) {
    const prediction = await analyzeBreedingPair(
      pair.parent1,
      pair.parent2
    );

    recommendations.push({
      parent1: pair.parent1,
      parent2: pair.parent2,
      compatibilityScore: pair.compatibilityScore,
      prediction,
    });
  }

  return recommendations;
}

function areRelated(animal1: Animal, animal2: Animal, allAnimals: Animal[]): boolean {
  if (animal1.sireId === animal2.id || animal1.damId === animal2.id) {
    return true;
  }
  if (animal2.sireId === animal1.id || animal2.damId === animal1.id) {
    return true;
  }

  if (animal1.sireId && animal2.sireId && animal1.sireId === animal2.sireId) {
    return true;
  }
  if (animal1.damId && animal2.damId && animal1.damId === animal2.damId) {
    return true;
  }

  return false;
}

function calculateCompatibilityScore(parent1: Animal, parent2: Animal): number {
  let score = 50;

  if (parent1.species === parent2.species) {
    score += 30;
  } else {
    score += 5;
  }

  if (parent1.hornSize && parent2.hornSize) {
    const hornDiff = Math.abs(
      parseFloat(parent1.hornSize) - parseFloat(parent2.hornSize)
    );
    score += Math.max(0, 20 - hornDiff);
  } else if (parent1.hornSize || parent2.hornSize) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}
