import { GoogleGenAI } from "@google/genai";
import type { Animal, OffspringPrediction } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeBreedingPair(
  parent1: Animal,
  parent2: Animal,
  predictedScore: number
): Promise<OffspringPrediction> {
  try {
    const systemPrompt = `You are an expert animal breeding geneticist. Analyze the breeding pair and provide predictions about their offspring.
Focus on genetic compatibility, trait inheritance, and breeding outcomes.
Provide a clear, professional explanation suitable for ranchers.
Respond with JSON in this exact format:
{
  "predictedGeneticScore": number,
  "predictedTraits": {
    "estimatedHornSize": number | null,
    "breedStrength": string
  },
  "confidence": number,
  "explanation": string
}`;

    const userPrompt = `Analyze this breeding pair:

Parent 1 (${parent1.sex}):
- Name: ${parent1.name}
- Breed: ${parent1.breed}
- Age: ${parent1.age} years
- Genetic Score: ${parent1.geneticScore}
- Horn Size: ${parent1.hornSize || "N/A"}

Parent 2 (${parent2.sex}):
- Name: ${parent2.name}
- Breed: ${parent2.breed}
- Age: ${parent2.age} years
- Genetic Score: ${parent2.geneticScore}
- Horn Size: ${parent2.hornSize || "N/A"}

Predicted Offspring Genetic Score: ${predictedScore}

Provide:
1. A refined genetic score prediction (can adjust the ${predictedScore} if needed)
2. Breed strength assessment (e.g., "Excellent", "Strong", "Good", "Fair")
3. Estimated horn size if both parents have measurements (or null)
4. Confidence level (0.0 to 1.0)
5. A detailed explanation of why this is a good/bad breeding pair, considering genetic diversity, trait inheritance, and potential offspring quality`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            predictedGeneticScore: { type: "number" },
            predictedTraits: {
              type: "object",
              properties: {
                estimatedHornSize: { type: ["number", "null"] },
                breedStrength: { type: "string" },
              },
              required: ["breedStrength"],
            },
            confidence: { type: "number" },
            explanation: { type: "string" },
          },
          required: ["predictedGeneticScore", "predictedTraits", "confidence", "explanation"],
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;

    if (rawJson) {
      const data = JSON.parse(rawJson);
      return {
        predictedGeneticScore: data.predictedGeneticScore,
        predictedTraits: {
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
    // Fallback to rule-based prediction
    return {
      predictedGeneticScore: predictedScore,
      predictedTraits: {
        estimatedHornSize:
          parent1.hornSize && parent2.hornSize
            ? (parseFloat(parent1.hornSize) + parseFloat(parent2.hornSize)) / 2
            : undefined,
        breedStrength: predictedScore >= 75 ? "Excellent" : predictedScore >= 60 ? "Good" : "Fair",
      },
      confidence: 0.7,
      explanation: `This breeding pair shows ${
        predictedScore >= 70 ? "strong" : "moderate"
      } genetic compatibility based on their individual scores. The predicted offspring genetic score of ${predictedScore.toFixed(
        1
      )} indicates ${
        predictedScore >= 75 ? "excellent" : predictedScore >= 60 ? "good" : "fair"
      } potential for superior offspring.`,
    };
  }
}
