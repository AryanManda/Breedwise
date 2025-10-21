import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnimalSchema } from "@shared/schema";
import { generateBreedingRecommendations } from "./breeding-algorithm";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Generate breeding recommendations
  app.post("/api/recommendations", async (_req, res) => {
    try {
      const animals = await storage.getAllAnimals();

      if (animals.length < 2) {
        return res.json([]);
      }

      const recommendations = await generateBreedingRecommendations(animals);
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate breeding recommendations" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
