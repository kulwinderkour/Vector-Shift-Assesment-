import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  NodeChange, 
  EdgeChange 
} from 'reactflow';

interface StoreState {
  nodes: Node[];
  edges: Edge[];
  nodeIDs: { [key: string]: number };
  getNodeID: (type: string) => string;
  addNode: (node: Node) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  
  getNodeID: (type: string) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node]
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },
}));
