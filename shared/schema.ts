import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const animals = pgTable("animals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  sex: text("sex").notNull(),
  breed: text("breed").notNull(),
  geneticScore: decimal("genetic_score", { precision: 4, scale: 1 }).notNull(),
  hornSize: decimal("horn_size", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertAnimalSchema = createInsertSchema(animals).omit({
  id: true,
  createdAt: true,
}).extend({
  age: z.number().int().min(0).max(30),
  sex: z.enum(["Male", "Female"]),
  geneticScore: z.number().min(0).max(100),
  hornSize: z.number().min(0).optional(),
});

export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type Animal = typeof animals.$inferSelect;

export const breedingRecommendations = pgTable("breeding_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parent1Id: varchar("parent1_id").notNull(),
  parent2Id: varchar("parent2_id").notNull(),
  predictedScore: decimal("predicted_score", { precision: 4, scale: 1 }).notNull(),
  aiExplanation: text("ai_explanation"),
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertBreedingRecommendationSchema = createInsertSchema(breedingRecommendations).omit({
  id: true,
  createdAt: true,
});

export type InsertBreedingRecommendation = z.infer<typeof insertBreedingRecommendationSchema>;
export type BreedingRecommendation = typeof breedingRecommendations.$inferSelect;

export interface OffspringPrediction {
  predictedGeneticScore: number;
  predictedTraits: {
    estimatedHornSize?: number;
    breedStrength: string;
  };
  confidence: number;
  explanation: string;
}

export interface BreedingPairRecommendation {
  parent1: Animal;
  parent2: Animal;
  prediction: OffspringPrediction;
  compatibilityScore: number;
}
