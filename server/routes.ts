import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pipelineDataSchema, type PipelineResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Pipeline parsing endpoint
  app.post("/api/pipelines/parse", async (req, res) => {
    try {
      // Validate request body
      const pipelineData = pipelineDataSchema.parse(req.body);
      
      // Calculate number of nodes and edges
      const num_nodes = pipelineData.nodes.length;
      const num_edges = pipelineData.edges.length;
      
      // Check if pipeline forms a DAG
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

  const httpServer = createServer(app);
  return httpServer;
}

// Simple DAG validation function
function checkIsDAG(nodes: any[], edges: any[]): boolean {
  try {
    // Create adjacency list
    const graph: { [key: string]: string[] } = {};
    const inDegree: { [key: string]: number } = {};
    
    // Initialize all nodes
    for (const node of nodes) {
      graph[node.id] = [];
      inDegree[node.id] = 0;
    }
    
    // Build graph from edges
    for (const edge of edges) {
      if (graph[edge.source] && inDegree[edge.target] !== undefined) {
        graph[edge.source].push(edge.target);
        inDegree[edge.target]++;
      }
    }
    
    // Kahn's algorithm for topological sorting
    const queue: string[] = [];
    const result: string[] = [];
    
    // Find all nodes with no incoming edges
    for (const nodeId in inDegree) {
      if (inDegree[nodeId] === 0) {
        queue.push(nodeId);
      }
    }
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      
      // For each neighbor of current node
      for (const neighbor of graph[current]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    // If we processed all nodes, it's a DAG
    return result.length === nodes.length;
  } catch (error) {
    console.error("DAG validation error:", error);
    return false;
  }
}
