import { GoogleGenAI } from "@google/genai";
import type { Animal, OffspringPrediction } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeBreedingPair(
  parent1: Animal,
  parent2: Animal
): Promise<OffspringPrediction> {
  try {
    const systemPrompt = `You are an expert animal breeding consultant specializing in hereditary tracking and trait optimization. 
Analyze the breeding pair and provide predictions about their offspring focusing on:
1. Weight and size potential
2. Breed characteristics and trait inheritance
3. Horn size potential (if applicable)
4. Overall breeding value

Respond with JSON in this exact format:
{
  "predictedTraits": {
    "estimatedWeight": number | null,
    "estimatedHornSize": number | null,
    "breedStrength": string
  },
  "confidence": number,
  "explanation": string
}`;

    const userPrompt = `Analyze this breeding pair:

Parent 1 (${parent1.sex}):
- Name: ${parent1.name}
- Species: ${parent1.species}
- Breed: ${parent1.breed}
- Age: ${parent1.age} years
- Weight: ${parent1.weight} lbs
- Horn Size: ${parent1.hornSize || "N/A"}

Parent 2 (${parent2.sex}):
- Name: ${parent2.name}
- Species: ${parent2.species}
- Breed: ${parent2.breed}
- Age: ${parent2.age} years
- Weight: ${parent2.weight} lbs
- Horn Size: ${parent2.hornSize || "N/A"}

Provide:
1. Estimated offspring weight based on parent weights
2. Breed strength assessment (e.g., "Excellent", "Strong", "Good", "Fair")
3. Estimated horn size if both parents have measurements (or null)
4. Confidence level (0.0 to 1.0)
5. A detailed explanation of why this is a good breeding pair, considering breed compatibility, trait inheritance, weight potential, and overall offspring quality`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            predictedTraits: {
              type: "object",
              properties: {
                estimatedWeight: { type: ["number", "null"] },
                estimatedHornSize: { type: ["number", "null"] },
                breedStrength: { type: "string" },
              },
              required: ["breedStrength"],
            },
            confidence: { type: "number" },
            explanation: { type: "string" },
          },
          required: ["predictedTraits", "confidence", "explanation"],
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;

    if (rawJson) {
      const data = JSON.parse(rawJson);
      return {
        predictedTraits: {
          estimatedWeight: data.predictedTraits.estimatedWeight,
          estimatedHornSize: data.predictedTraits.estimatedHornSize,
          breedStrength: data.predictedTraits.breedStrength,
        },
        confidence: Math.min(1, Math.max(0, data.confidence)),
        explanation: data.explanation,
      };
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Gemini AI error:", error);
    const avgWeight = (parseFloat(parent1.weight) + parseFloat(parent2.weight)) / 2;
    
    return {
      predictedTraits: {
        estimatedWeight: avgWeight,
        estimatedHornSize:
          parent1.hornSize && parent2.hornSize
            ? (parseFloat(parent1.hornSize) + parseFloat(parent2.hornSize)) / 2
            : undefined,
        breedStrength: parent1.breed === parent2.breed ? "Strong" : "Good",
      },
      confidence: 0.7,
      explanation: `This breeding pair shows good compatibility. ${
        parent1.breed === parent2.breed 
          ? `Both parents are ${parent1.breed}, which maintains breed purity and consistent trait inheritance.`
          : `This crossbreed pairing between ${parent1.breed} and ${parent2.breed} may introduce hybrid vigor.`
      } The estimated offspring weight is approximately ${avgWeight.toFixed(0)} lbs based on parental weights. ${
        parent1.hornSize && parent2.hornSize 
          ? `Horn size should average around ${((parseFloat(parent1.hornSize) + parseFloat(parent2.hornSize)) / 2).toFixed(1)} inches.`
          : ''
      }`,
    };
  }
}
