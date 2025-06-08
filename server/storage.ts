import { users, pipelines, type User, type InsertUser, type Pipeline, type InsertPipeline } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPipeline(id: number): Promise<Pipeline | undefined>;
  getPipelinesByUser(userId: number): Promise<Pipeline[]>;
  createPipeline(pipeline: InsertPipeline): Promise<Pipeline>;
  updatePipeline(id: number, pipeline: Partial<InsertPipeline>): Promise<Pipeline | undefined>;
  deletePipeline(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPipeline(id: number): Promise<Pipeline | undefined> {
    const [pipeline] = await db.select().from(pipelines).where(eq(pipelines.id, id));
    return pipeline || undefined;
  }

  async getPipelinesByUser(userId: number): Promise<Pipeline[]> {
    return await db.select().from(pipelines).where(eq(pipelines.userId, userId));
  }

  async createPipeline(pipeline: InsertPipeline): Promise<Pipeline> {
    const [newPipeline] = await db
      .insert(pipelines)
      .values(pipeline)
      .returning();
    return newPipeline;
  }

  async updatePipeline(id: number, pipeline: Partial<InsertPipeline>): Promise<Pipeline | undefined> {
    const [updatedPipeline] = await db
      .update(pipelines)
      .set(pipeline)
      .where(eq(pipelines.id, id))
      .returning();
    return updatedPipeline || undefined;
  }

  async deletePipeline(id: number): Promise<boolean> {
    const result = await db.delete(pipelines).where(eq(pipelines.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
