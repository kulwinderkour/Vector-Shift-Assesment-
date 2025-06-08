import { pgTable, text, serial, json, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const pipelines = pgTable("pipelines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nodes: json("nodes").notNull(),
  edges: json("edges").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPipelineSchema = createInsertSchema(pipelines).pick({
  name: true,
  nodes: true,
  edges: true,
  userId: true,
});

// Pipeline validation schemas
export const nodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.any()),
});

export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable(),
  targetHandle: z.string().nullable(),
});

export const pipelineDataSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

export const pipelineResponseSchema = z.object({
  num_nodes: z.number(),
  num_edges: z.number(),
  is_dag: z.boolean(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPipeline = z.infer<typeof insertPipelineSchema>;
export type Pipeline = typeof pipelines.$inferSelect;
export type PipelineData = z.infer<typeof pipelineDataSchema>;
export type PipelineResponse = z.infer<typeof pipelineResponseSchema>;
