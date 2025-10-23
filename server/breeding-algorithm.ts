import type { Animal, HerdBreedingRecommendation } from "@shared/schema";
import { analyzeHerd } from "./gemini";

export async function generateHerdBreedingRecommendations(
  selectedAnimals: Animal[]
): Promise<HerdBreedingRecommendation[]> {
  if (selectedAnimals.length < 2) {
    return [];
  }

  const males = selectedAnimals.filter((a) => a.sex === "Male");
  const females = selectedAnimals.filter((a) => a.sex === "Female");

  if (males.length === 0 || females.length === 0) {
    return [];
  }

  const hasRelatedAnimals = checkForRelatedAnimals(selectedAnimals);
  const relatedPairs = hasRelatedAnimals ? getRelatedPairs(selectedAnimals) : [];
  const herdScore = calculateHerdScore(selectedAnimals);

  const analysis = await analyzeHerd(selectedAnimals, hasRelatedAnimals, relatedPairs);

  const recommendation: HerdBreedingRecommendation = {
    herdAnimals: selectedAnimals,
    analysis,
    herdScore,
  };

  return [recommendation];
}

function getRelatedPairs(animals: Animal[]): Array<{ animal1: string; animal2: string; relationship: string }> {
  const pairs: Array<{ animal1: string; animal2: string; relationship: string }> = [];
  
  for (let i = 0; i < animals.length; i++) {
    for (let j = i + 1; j < animals.length; j++) {
      const a1 = animals[i];
      const a2 = animals[j];
      
      if (a1.sireId === a2.id || a1.damId === a2.id) {
        pairs.push({ 
          animal1: a1.name, 
          animal2: a2.name, 
          relationship: "parent-child" 
        });
      } else if (a2.sireId === a1.id || a2.damId === a1.id) {
        pairs.push({ 
          animal1: a2.name, 
          animal2: a1.name, 
          relationship: "parent-child" 
        });
      } else if (a1.sireId && a2.sireId && a1.sireId === a2.sireId) {
        pairs.push({ 
          animal1: a1.name, 
          animal2: a2.name, 
          relationship: "half-siblings (same sire)" 
        });
      } else if (a1.damId && a2.damId && a1.damId === a2.damId) {
        pairs.push({ 
          animal1: a1.name, 
          animal2: a2.name, 
          relationship: "half-siblings (same dam)" 
        });
      }
    }
  }
  
  return pairs;
}

function checkForRelatedAnimals(animals: Animal[]): boolean {
  for (let i = 0; i < animals.length; i++) {
    for (let j = i + 1; j < animals.length; j++) {
      if (areRelated(animals[i], animals[j], animals)) {
        return true;
      }
    }
  }
  return false;
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

function calculateHerdScore(animals: Animal[]): number {
  let score = 50;

  const species = new Set(animals.map(a => a.species));
  if (species.size === 1) {
    score += 30;
  } else {
    score += 10;
  }

  const withHorns = animals.filter(a => a.hornSize);
  if (withHorns.length > 0) {
    const avgHornSize = withHorns.reduce((sum, a) => sum + parseFloat(a.hornSize!), 0) / withHorns.length;
    score += Math.min(20, avgHornSize / 2);
  }

  const males = animals.filter(a => a.sex === "Male");
  const females = animals.filter(a => a.sex === "Female");
  const ratio = Math.min(males.length, females.length) / Math.max(males.length, females.length);
  score += ratio * 10;

  return Math.min(100, Math.max(0, score));
}
