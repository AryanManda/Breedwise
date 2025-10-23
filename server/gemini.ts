import { GoogleGenAI } from "@google/genai";
import type { Animal, HerdAnalysis } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeHerd(
  herdAnimals: Animal[],
  hasRelatedAnimals: boolean = false,
  relatedPairs: Array<{ animal1: string; animal2: string; relationship: string }> = []
): Promise<HerdAnalysis> {
  try {
    const males = herdAnimals.filter(a => a.sex === "Male");
    const females = herdAnimals.filter(a => a.sex === "Female");
    
    const systemPrompt = `You are an expert animal breeding consultant specializing in herd management and breeding strategies. 
Analyze the entire herd and provide comprehensive breeding recommendations focusing on:
1. Genetic diversity and trait strength across the herd
2. Estimated offspring production potential
3. Horn/antler size trends and improvement potential
4. Overall herd quality and breeding strategy
5. Health considerations across the herd

Respond with JSON in this exact format:
{
  "predictedOutcomes": {
    "estimatedOffspringCount": number,
    "averageHornSize": number | null,
    "traitStrength": string,
    "geneticDiversity": string
  },
  "confidence": number,
  "explanation": string,
  "breedingStrategy": string
}`;

    const animalDescriptions = herdAnimals.map((animal, idx) => 
      `Animal ${idx + 1} (${animal.sex}):
- Name: ${animal.name}
- Species: ${animal.species}
- Horn Size: ${animal.hornSize || "N/A"}
- Health Status: ${animal.healthNotes || "No notes"}`
    ).join("\n\n");

    const lineageWarning = hasRelatedAnimals
      ? `\n\nWARNING: This herd contains related animals that should not breed together:\n${relatedPairs.map(p => `- ${p.animal1} and ${p.animal2} (${p.relationship})`).join('\n')}\n\nYour breeding strategy MUST address separating these related animals to avoid inbreeding.`
      : '';

    const userPrompt = `Analyze this breeding herd:

Total Animals: ${herdAnimals.length}
Males: ${males.length}
Females: ${females.length}

${animalDescriptions}${lineageWarning}

Provide:
1. Estimated offspring count this herd could produce in one breeding season
2. Genetic diversity assessment (e.g., "Excellent", "Good", "Fair", "Limited")
3. Overall trait strength (e.g., "Excellent", "Strong", "Good", "Fair")
4. Average horn size prediction for offspring (or null if not applicable)
5. Confidence level (0.0 to 1.0)
6. A detailed explanation of the herd's breeding potential, genetic diversity, and health considerations
7. A recommended breeding strategy for this herd to optimize offspring quality${hasRelatedAnimals ? ' while avoiding inbreeding between related animals' : ''}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            predictedOutcomes: {
              type: "object",
              properties: {
                estimatedOffspringCount: { type: "number" },
                averageHornSize: { type: ["number", "null"] },
                traitStrength: { type: "string" },
                geneticDiversity: { type: "string" },
              },
              required: ["estimatedOffspringCount", "traitStrength", "geneticDiversity"],
            },
            confidence: { type: "number" },
            explanation: { type: "string" },
            breedingStrategy: { type: "string" },
          },
          required: ["predictedOutcomes", "confidence", "explanation", "breedingStrategy"],
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;

    if (rawJson) {
      const data = JSON.parse(rawJson);
      
      const relatedWarning = hasRelatedAnimals
        ? `Related animals detected: ${relatedPairs.map(p => `${p.animal1} & ${p.animal2} (${p.relationship})`).join(', ')}. Avoid breeding these pairs to prevent inbreeding.`
        : undefined;
      
      return {
        predictedOutcomes: {
          estimatedOffspringCount: data.predictedOutcomes.estimatedOffspringCount,
          averageHornSize: data.predictedOutcomes.averageHornSize,
          traitStrength: data.predictedOutcomes.traitStrength,
          geneticDiversity: data.predictedOutcomes.geneticDiversity,
        },
        confidence: Math.min(1, Math.max(0, data.confidence)),
        explanation: data.explanation,
        breedingStrategy: data.breedingStrategy,
        hasRelatedAnimals,
        relatedAnimalsWarning: relatedWarning,
      };
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Gemini AI error:", error);
    
    const males = herdAnimals.filter(a => a.sex === "Male");
    const females = herdAnimals.filter(a => a.sex === "Female");
    const estimatedOffspring = Math.min(males.length, females.length);
    
    const withHorns = herdAnimals.filter(a => a.hornSize);
    const avgHornSize = withHorns.length > 0
      ? withHorns.reduce((sum, a) => sum + parseFloat(a.hornSize!), 0) / withHorns.length
      : undefined;
    
    const species = new Set(herdAnimals.map(a => a.species));
    const geneticDiversity = species.size > 1 ? "Good" : "Limited";
    
    const relatedWarning = hasRelatedAnimals
      ? `Related animals detected: ${relatedPairs.map(p => `${p.animal1} & ${p.animal2} (${p.relationship})`).join(', ')}. Avoid breeding these pairs to prevent inbreeding.`
      : undefined;
    
    return {
      predictedOutcomes: {
        estimatedOffspringCount: estimatedOffspring,
        averageHornSize: avgHornSize,
        traitStrength: "Good",
        geneticDiversity,
      },
      confidence: 0.7,
      explanation: `This herd of ${herdAnimals.length} animals (${males.length} males, ${females.length} females) shows ${geneticDiversity.toLowerCase()} genetic diversity with ${species.size} species represented. ${
        avgHornSize 
          ? `The average horn size is ${avgHornSize.toFixed(1)} inches, which should produce strong offspring traits.`
          : ''
      }${hasRelatedAnimals ? ' WARNING: This herd contains related animals - see breeding strategy for guidance.' : ''}`,
      breedingStrategy: `With ${males.length} males and ${females.length} females, focus on rotating breeding pairs to maximize genetic diversity while maintaining strong traits. Expected offspring: approximately ${estimatedOffspring} per season.${
        hasRelatedAnimals 
          ? ' IMPORTANT: Separate related animals to avoid inbreeding - do not breed parent-child pairs or half-siblings together.'
          : ''
      }`,
      hasRelatedAnimals,
      relatedAnimalsWarning: relatedWarning,
    };
  }
}
