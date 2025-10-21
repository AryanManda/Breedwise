import { type User, type InsertUser, type Animal, type InsertAnimal } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllAnimals(): Promise<Animal[]>;
  getAnimal(id: string): Promise<Animal | undefined>;
  createAnimal(animal: InsertAnimal): Promise<Animal>;
  updateAnimal(id: string, animal: InsertAnimal): Promise<Animal | undefined>;
  deleteAnimal(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private animals: Map<string, Animal>;

  constructor() {
    this.users = new Map();
    this.animals = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllAnimals(): Promise<Animal[]> {
    return Array.from(this.animals.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAnimal(id: string): Promise<Animal | undefined> {
    return this.animals.get(id);
  }

  async createAnimal(insertAnimal: InsertAnimal): Promise<Animal> {
    const id = randomUUID();
    const animal: Animal = {
      id,
      ...insertAnimal,
      geneticScore: insertAnimal.geneticScore.toString(),
      hornSize: insertAnimal.hornSize?.toString() || null,
      createdAt: new Date(),
    };
    this.animals.set(id, animal);
    return animal;
  }

  async updateAnimal(id: string, insertAnimal: InsertAnimal): Promise<Animal | undefined> {
    const existing = this.animals.get(id);
    if (!existing) {
      return undefined;
    }

    const animal: Animal = {
      ...existing,
      ...insertAnimal,
      geneticScore: insertAnimal.geneticScore.toString(),
      hornSize: insertAnimal.hornSize?.toString() || null,
    };
    this.animals.set(id, animal);
    return animal;
  }

  async deleteAnimal(id: string): Promise<boolean> {
    return this.animals.delete(id);
  }
}

export const storage = new MemStorage();
