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
  species: text("species").notNull(),
  sex: text("sex").notNull(),
  healthNotes: text("health_notes"),
  hornSize: decimal("horn_size", { precision: 5, scale: 2 }),
  sireId: varchar("sire_id"),
  damId: varchar("dam_id"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertAnimalSchema = createInsertSchema(animals).omit({
  id: true,
  createdAt: true,
}).extend({
  sex: z.enum(["Male", "Female"]),
  healthNotes: z.string().optional(),
  hornSize: z.number().min(0).optional(),
  sireId: z.string().optional(),
  damId: z.string().optional(),
});

export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type Animal = typeof animals.$inferSelect;

export const breedingRecommendations = pgTable("breeding_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalIds: text("animal_ids").notNull(),
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

export interface HerdAnalysis {
  predictedOutcomes: {
    estimatedOffspringCount: number;
    averageHornSize?: number;
    traitStrength: string;
    geneticDiversity: string;
  };
  confidence: number;
  explanation: string;
  breedingStrategy: string;
  hasRelatedAnimals: boolean;
  relatedAnimalsWarning?: string;
}

export interface HerdBreedingRecommendation {
  herdAnimals: Animal[];
  analysis: HerdAnalysis;
  herdScore: number;
}
