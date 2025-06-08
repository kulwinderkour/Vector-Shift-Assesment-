# Complete VectorShift Pipeline Builder Source Code

## Quick Setup Commands

```bash
# 1. Create project directory
mkdir vectorshift-pipeline-builder
cd vectorshift-pipeline-builder

# 2. Copy all files from this guide into the directory structure below

# 3. Install dependencies
npm install

# 4. Setup PostgreSQL database
createdb vectorshift_db

# 5. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 6. Initialize database
npm run db:push

# 7. Start development server
npm run dev
```

## File Structure & Complete Source Code

### Root Configuration Files

**package.json**
```json
{
  "name": "vectorshift-pipeline-builder",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@neondatabase/serverless": "^0.10.4",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-toast": "^1.2.7",
    "@tanstack/react-query": "^5.60.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "drizzle-orm": "^0.39.1",
    "drizzle-zod": "^0.7.0",
    "express": "^4.21.2",
    "lucide-react": "^0.453.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.55.0",
    "reactflow": "^11.11.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "ws": "^8.18.0",
    "zod": "^3.24.2",
    "zustand": "^5.0.5"
  },
  "devDependencies": {
    "@types/express": "4.17.21",
    "@types/node": "20.16.11",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "drizzle-kit": "^0.30.4",
    "esbuild": "^0.25.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.1",
    "typescript": "5.6.3",
    "vite": "^5.4.14"
  }
}
```

**.env.example**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vectorshift_db"
NODE_ENV=development
PORT=5000
```

**vite.config.ts**
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  root: "./client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
});
```

**tailwind.config.ts**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./client/src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**postcss.config.js**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["client/src", "shared", "server"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**drizzle.config.ts**
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Shared Schema

**shared/schema.ts**
```typescript
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
```

### Backend Server Files

**server/index.ts**
```typescript
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      log(`Port ${port} is already in use. Trying port ${port + 1}...`);
      server.listen(port + 1, "0.0.0.0", () => {
        log(`serving on port ${port + 1}`);
      });
    } else {
      throw err;
    }
  });
})();
```

**server/db.ts**
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

**server/storage.ts**
```typescript
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
```

**server/routes.ts**
```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pipelineDataSchema, insertPipelineSchema, type PipelineResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Pipeline parsing endpoint
  app.post("/api/pipelines/parse", async (req, res) => {
    try {
      const pipelineData = pipelineDataSchema.parse(req.body);
      
      const num_nodes = pipelineData.nodes.length;
      const num_edges = pipelineData.edges.length;
      const is_dag = checkIsDAG(pipelineData.nodes, pipelineData.edges);
      
      const response: PipelineResponse = {
        num_nodes,
        num_edges,
        is_dag
      };
      
      res.json(response);
    } catch (error) {
      console.error("Pipeline parsing error:", error);
      res.status(400).json({ 
        message: "Invalid pipeline data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all pipelines
  app.get("/api/pipelines", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (userId) {
        const pipelines = await storage.getPipelinesByUser(userId);
        res.json(pipelines);
      } else {
        res.status(400).json({ message: "userId query parameter is required" });
      }
    } catch (error) {
      console.error("Get pipelines error:", error);
      res.status(500).json({ message: "Failed to retrieve pipelines" });
    }
  });

  // Get specific pipeline
  app.get("/api/pipelines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pipeline = await storage.getPipeline(id);
      
      if (pipeline) {
        res.json(pipeline);
      } else {
        res.status(404).json({ message: "Pipeline not found" });
      }
    } catch (error) {
      console.error("Get pipeline error:", error);
      res.status(500).json({ message: "Failed to retrieve pipeline" });
    }
  });

  // Create new pipeline
  app.post("/api/pipelines", async (req, res) => {
    try {
      const pipelineData = insertPipelineSchema.parse(req.body);
      const pipeline = await storage.createPipeline(pipelineData);
      res.status(201).json(pipeline);
    } catch (error) {
      console.error("Create pipeline error:", error);
      res.status(400).json({ 
        message: "Invalid pipeline data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update pipeline
  app.put("/api/pipelines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pipelineData = insertPipelineSchema.partial().parse(req.body);
      const pipeline = await storage.updatePipeline(id, pipelineData);
      
      if (pipeline) {
        res.json(pipeline);
      } else {
        res.status(404).json({ message: "Pipeline not found" });
      }
    } catch (error) {
      console.error("Update pipeline error:", error);
      res.status(400).json({ 
        message: "Invalid pipeline data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete pipeline
  app.delete("/api/pipelines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePipeline(id);
      
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Pipeline not found" });
      }
    } catch (error) {
      console.error("Delete pipeline error:", error);
      res.status(500).json({ message: "Failed to delete pipeline" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function checkIsDAG(nodes: any[], edges: any[]): boolean {
  try {
    const graph: { [key: string]: string[] } = {};
    const inDegree: { [key: string]: number } = {};
    
    for (const node of nodes) {
      graph[node.id] = [];
      inDegree[node.id] = 0;
    }
    
    for (const edge of edges) {
      if (graph[edge.source] && inDegree[edge.target] !== undefined) {
        graph[edge.source].push(edge.target);
        inDegree[edge.target]++;
      }
    }
    
    const queue: string[] = [];
    const result: string[] = [];
    
    for (const nodeId in inDegree) {
      if (inDegree[nodeId] === 0) {
        queue.push(nodeId);
      }
    }
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      
      for (const neighbor of graph[current]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    return result.length === nodes.length;
  } catch (error) {
    console.error("DAG validation error:", error);
    return false;
  }
}
```

This is part 1 of the complete source code. I'll continue with the frontend components in the next section to ensure you have everything needed for local development.