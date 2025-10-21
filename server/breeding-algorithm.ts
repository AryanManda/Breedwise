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
    predictedScore: number;
  }> = [];

  // Calculate compatibility for all possible pairs
  for (const male of males) {
    for (const female of females) {
      const compatibility = calculateCompatibilityScore(male, female);
      const predictedScore = predictOffspringScore(male, female);

      pairs.push({
        parent1: male,
        parent2: female,
        compatibilityScore: compatibility,
        predictedScore,
      });
    }
  }

  // Sort by compatibility score (descending) and take top 5
  pairs.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  const topPairs = pairs.slice(0, Math.min(5, pairs.length));

  // Get AI analysis for each pair
  const recommendations: BreedingPairRecommendation[] = [];

  for (const pair of topPairs) {
    const prediction = await analyzeBreedingPair(
      pair.parent1,
      pair.parent2,
      pair.predictedScore
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

function calculateCompatibilityScore(parent1: Animal, parent2: Animal): number {
  const score1 = parseFloat(parent1.geneticScore);
  const score2 = parseFloat(parent2.geneticScore);

  // Genetic similarity component (0.5 weight)
  // Prefer pairs with high scores, but also consider genetic diversity
  const avgScore = (score1 + score2) / 2;
  const scoreDifference = Math.abs(score1 - score2);
  const geneticSimilarity = avgScore * 0.8 - scoreDifference * 0.2;

  // Trait match component (0.3 weight)
  let traitMatch = 50; // base score

  // Same breed gets bonus
  if (parent1.breed === parent2.breed) {
    traitMatch += 20;
  }

  // Horn size compatibility (if both have measurements)
  if (parent1.hornSize && parent2.hornSize) {
    const hornDiff = Math.abs(
      parseFloat(parent1.hornSize) - parseFloat(parent2.hornSize)
    );
    traitMatch += Math.max(0, 30 - hornDiff * 2);
  }

  // Age factor component (0.2 weight)
  // Prefer younger animals for breeding
  const avgAge = (parent1.age + parent2.age) / 2;
  const ageFactor = Math.max(0, 100 - avgAge * 5);

  // Calculate weighted compatibility score
  const compatibility =
    geneticSimilarity * 0.5 + traitMatch * 0.3 + ageFactor * 0.2;

  return Math.min(100, Math.max(0, compatibility));
}

function predictOffspringScore(parent1: Animal, parent2: Animal): number {
  const score1 = parseFloat(parent1.geneticScore);
  const score2 = parseFloat(parent2.geneticScore);

  // Base prediction: average of parents
  const baseScore = (score1 + score2) / 2;

  // Add random modifier for genetic variation (-5 to +5)
  const modifier = (Math.random() - 0.5) * 10;

  // Bonus for high-scoring parents (regression to the mean)
  let bonus = 0;
  if (baseScore >= 80) {
    bonus = 2;
  } else if (baseScore >= 70) {
    bonus = 1;
  }

  const predictedScore = baseScore + modifier + bonus;

  return Math.min(100, Math.max(0, predictedScore));
}
