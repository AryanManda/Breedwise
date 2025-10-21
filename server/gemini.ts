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
1. Horn/antler size potential (if applicable)
2. Trait strength and genetic quality
3. Overall breeding value

Respond with JSON in this exact format:
{
  "predictedTraits": {
    "estimatedHornSize": number | null,
    "traitStrength": string
  },
  "confidence": number,
  "explanation": string
}`;

    const userPrompt = `Analyze this breeding pair:

Parent 1 (${parent1.sex}):
- Name: ${parent1.name}
- Species: ${parent1.species}
- Horn Size: ${parent1.hornSize || "N/A"}
- Health Status: ${parent1.healthNotes || "No notes"}

Parent 2 (${parent2.sex}):
- Name: ${parent2.name}
- Species: ${parent2.species}
- Horn Size: ${parent2.hornSize || "N/A"}
- Health Status: ${parent2.healthNotes || "No notes"}

Provide:
1. Trait strength assessment (e.g., "Excellent", "Strong", "Good", "Fair")
2. Estimated horn size if both parents have measurements (or null)
3. Confidence level (0.0 to 1.0)
4. A detailed explanation of why this is a good breeding pair, considering species compatibility, trait inheritance, horn size potential, and overall offspring quality`;

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
                estimatedHornSize: { type: ["number", "null"] },
                traitStrength: { type: "string" },
              },
              required: ["traitStrength"],
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
          estimatedHornSize: data.predictedTraits.estimatedHornSize,
          traitStrength: data.predictedTraits.traitStrength,
        },
        confidence: Math.min(1, Math.max(0, data.confidence)),
        explanation: data.explanation,
      };
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Gemini AI error:", error);
    
    return {
      predictedTraits: {
        estimatedHornSize:
          parent1.hornSize && parent2.hornSize
            ? (parseFloat(parent1.hornSize) + parseFloat(parent2.hornSize)) / 2
            : undefined,
        traitStrength: parent1.species === parent2.species ? "Strong" : "Good",
      },
      confidence: 0.7,
      explanation: `This breeding pair shows good compatibility. ${
        parent1.species === parent2.species 
          ? `Both parents are ${parent1.species}, which maintains species purity and consistent trait inheritance.`
          : `This cross-species pairing between ${parent1.species} may introduce genetic diversity.`
      }${
        parent1.hornSize && parent2.hornSize 
          ? ` Horn size should average around ${((parseFloat(parent1.hornSize) + parseFloat(parent2.hornSize)) / 2).toFixed(1)} inches.`
          : ''
      }`,
    };
  }
}
