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

  const weight1 = parseFloat(parent1.weight);
  const weight2 = parseFloat(parent2.weight);
  const avgWeight = (weight1 + weight2) / 2;
  
  if (avgWeight >= 1200) {
    score += 15;
  } else if (avgWeight >= 1000) {
    score += 10;
  }

  if (parent1.breed === parent2.breed) {
    score += 20;
  } else {
    score += 5;
  }

  if (parent1.hornSize && parent2.hornSize) {
    const hornDiff = Math.abs(
      parseFloat(parent1.hornSize) - parseFloat(parent2.hornSize)
    );
    score += Math.max(0, 15 - hornDiff);
  }

  const avgAge = (parent1.age + parent2.age) / 2;
  if (avgAge <= 6) {
    score += 15;
  } else if (avgAge <= 10) {
    score += 10;
  } else {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}
