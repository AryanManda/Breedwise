// Vercel serverless function - exports Express app
import express, { type Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";
import { insertAnimalSchema, insertHerdSchema } from "@shared/schema";
import { generateHerdBreedingRecommendations } from "../server/breeding-algorithm";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get all animals
app.get("/api/animals", async (_req, res) => {
  try {
    const animals = await storage.getAllAnimals();
    res.json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    res.status(500).json({ error: "Failed to fetch animals" });
  }
});

// Get single animal
app.get("/api/animals/:id", async (req, res) => {
  try {
    const animal = await storage.getAnimal(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }
    res.json(animal);
  } catch (error) {
    console.error("Error fetching animal:", error);
    res.status(500).json({ error: "Failed to fetch animal" });
  }
});

// Create animal
app.post("/api/animals", async (req, res) => {
  try {
    const validatedData = insertAnimalSchema.parse(req.body);
    const animal = await storage.createAnimal(validatedData);
    res.status(201).json(animal);
  } catch (error) {
    console.error("Error creating animal:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid animal data", details: error });
    }
    res.status(500).json({ error: "Failed to create animal" });
  }
});

// Update animal
app.put("/api/animals/:id", async (req, res) => {
  try {
    const validatedData = insertAnimalSchema.parse(req.body);
    const animal = await storage.updateAnimal(req.params.id, validatedData);
    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }
    res.json(animal);
  } catch (error) {
    console.error("Error updating animal:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid animal data", details: error });
    }
    res.status(500).json({ error: "Failed to update animal" });
  }
});

// Delete animal
app.delete("/api/animals/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteAnimal(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Animal not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting animal:", error);
    res.status(500).json({ error: "Failed to delete animal" });
  }
});

// Get all herds
app.get("/api/herds", async (_req, res) => {
  try {
    const herds = await storage.getAllHerds();
    res.json(herds);
  } catch (error) {
    console.error("Error fetching herds:", error);
    res.status(500).json({ error: "Failed to fetch herds" });
  }
});

// Get single herd
app.get("/api/herds/:id", async (req, res) => {
  try {
    const herd = await storage.getHerd(req.params.id);
    if (!herd) {
      return res.status(404).json({ error: "Herd not found" });
    }
    res.json(herd);
  } catch (error) {
    console.error("Error fetching herd:", error);
    res.status(500).json({ error: "Failed to fetch herd" });
  }
});

// Create herd
app.post("/api/herds", async (req, res) => {
  try {
    const validatedData = insertHerdSchema.parse(req.body);
    const herd = await storage.createHerd(validatedData);
    res.status(201).json(herd);
  } catch (error) {
    console.error("Error creating herd:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid herd data", details: error });
    }
    res.status(500).json({ error: "Failed to create herd" });
  }
});

// Update herd
app.put("/api/herds/:id", async (req, res) => {
  try {
    const validatedData = insertHerdSchema.parse(req.body);
    const herd = await storage.updateHerd(req.params.id, validatedData);
    if (!herd) {
      return res.status(404).json({ error: "Herd not found" });
    }
    res.json(herd);
  } catch (error) {
    console.error("Error updating herd:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid herd data", details: error });
    }
    res.status(500).json({ error: "Failed to update herd" });
  }
});

// Delete herd
app.delete("/api/herds/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteHerd(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Herd not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting herd:", error);
    res.status(500).json({ error: "Failed to delete herd" });
  }
});

// Generate herd breeding recommendations
app.post("/api/recommendations", async (req, res) => {
  try {
    const schema = z.object({
      animalIds: z.array(z.string()).min(2, "At least 2 animals required for breeding analysis"),
    });
    
    const { animalIds } = schema.parse(req.body);
    
    const allAnimals = await storage.getAllAnimals();
    const selectedAnimals = allAnimals.filter(a => animalIds.includes(a.id));
    
    if (selectedAnimals.length < 2) {
      return res.status(400).json({ error: "At least 2 valid animals required" });
    }

    const recommendations = await generateHerdBreedingRecommendations(selectedAnimals);
    res.json(recommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid request data", details: error });
    }
    res.status(500).json({ error: "Failed to generate breeding recommendations" });
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;

