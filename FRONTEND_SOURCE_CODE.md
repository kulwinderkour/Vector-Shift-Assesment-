# Frontend Components - Complete Source Code

## Main Application Files

**client/index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VectorShift Pipeline Builder</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**client/src/main.tsx**
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'reactflow/dist/style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**client/src/App.tsx**
```typescript
import { ReactFlowProvider } from 'reactflow';
import { PipelineToolbar } from './components/PipelineToolbar';
import { SubmitButton } from './components/SubmitButton';
import { PipelineCanvas } from './components/PipelineCanvas';
import { PipelineActions } from './components/PipelineActions';
import { NodeDocumentation } from './components/NodeDocumentation';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <div className="h-screen flex flex-col bg-slate-50">
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-800">VectorShift Pipeline Builder</h1>
            </div>
            <div className="flex items-center gap-2">
              <NodeDocumentation />
              <PipelineActions />
            </div>
          </header>
          <PipelineToolbar />
          <div className="flex-1">
            <PipelineCanvas />
          </div>
          <SubmitButton />
        </div>
        <Toaster />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}

export default App;
```

## Store Management

**client/src/store/useStore.ts**
```typescript
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
  deleteNode: (nodeId: string) => void;
  clearWorkflow: () => void;
  loadPipeline: (nodes: Node[], edges: Edge[]) => void;
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

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      nodeIDs: {},
    });
  },

  loadPipeline: (nodes: Node[], edges: Edge[]) => {
    set({
      nodes,
      edges,
    });
  },
}));
```

## Core Components

**client/src/components/BaseNode.tsx**
```typescript
import { memo, ReactNode } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

export interface BaseNodeProps {
  id: string;
  data: any;
}

export interface NodeConfig {
  title: string;
  color: string;
  icon?: ReactNode;
  inputs?: Array<{
    id: string;
    label?: string;
    position?: number;
  }>;
  outputs?: Array<{
    id: string;
    label?: string;
    position?: number;
  }>;
}

interface BaseNodeComponentProps extends BaseNodeProps {
  config: NodeConfig;
  children: ReactNode;
  height?: number;
  width?: number;
}

export const BaseNode = memo(({ id, data, config, children, height = 80, width = 200 }: BaseNodeComponentProps) => {
  const { deleteNode } = useStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <div 
      className="bg-white rounded-lg border border-slate-200 p-3 relative group hover:shadow-lg transition-shadow"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        style={{ width: '20px', height: '20px' }}
      >
        <X size={12} />
      </button>

      {config.inputs?.map((input, index) => (
        <Handle
          key={`${id}-${input.id}`}
          type="target"
          position={Position.Left}
          id={`${id}-${input.id}`}
          style={{ 
            top: input.position ? `${input.position}%` : `${((index + 1) * 100) / (config.inputs!.length + 1)}%` 
          }}
        />
      ))}

      {config.outputs?.map((output, index) => (
        <Handle
          key={`${id}-${output.id}`}
          type="source"
          position={Position.Right}
          id={`${id}-${output.id}`}
          style={{ 
            top: output.position ? `${output.position}%` : `${((index + 1) * 100) / (config.outputs!.length + 1)}%` 
          }}
        />
      ))}

      <div className="node-header">
        <div className={`node-indicator ${config.color}`}></div>
        <span className="node-title">{config.title}</span>
      </div>

      <div className="node-content">
        {children}
      </div>
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
```

**client/src/components/PipelineCanvas.tsx**
```typescript
import { useCallback, useRef, useState } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  MiniMap, 
  addEdge, 
  MarkerType,
  BackgroundVariant
} from 'reactflow';
import { useStore } from '../store/useStore';
import { nodeTypes } from '../utils/nodeTypes';

const proOptions = { hideAttribution: true };

export const PipelineCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    getNodeID
  } = useStore();

  const getInitNodeData = (nodeID: string, type: string) => {
    return { id: nodeID, nodeType: type };
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      if (event.dataTransfer.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params: any) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.Arrow,
          height: 20,
          width: 20,
        },
      };
      useStore.setState({
        edges: addEdge(newEdge, edges)
      });
    },
    [edges]
  );

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapToGrid={true}
        snapGrid={[20, 20]}
        connectionLineType="smoothstep"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background 
          color="#94a3b8" 
          gap={20} 
          variant={BackgroundVariant.Dots}
        />
        <Controls />
        <MiniMap />
      </ReactFlow>
      
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-pulse-soft">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">Start Building Your Pipeline</h3>
            <p className="text-slate-500">Drag nodes from the palette above to begin</p>
          </div>
        </div>
      )}
    </div>
  );
};
```

**client/src/components/DraggableNode.tsx**
```typescript
import { memo } from 'react';

interface DraggableNodeProps {
  type: string;
  label: string;
  color: string;
  icon: string;
}

export const DraggableNode = memo(({ type, label, color, icon }: DraggableNodeProps) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    const appData = { nodeType };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`${color} hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing p-3 rounded-lg border border-slate-200 text-sm select-none`}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="font-medium text-slate-700">{label}</span>
      </div>
    </div>
  );
});

DraggableNode.displayName = 'DraggableNode';
```

**client/src/components/PipelineToolbar.tsx**
```typescript
import { DraggableNode } from './DraggableNode';

export const PipelineToolbar = () => {
  const nodeTypes = [
    // Core Nodes
    { type: 'input', label: 'Input', color: 'bg-green-50 border-green-200', icon: '→' },
    { type: 'output', label: 'Output', color: 'bg-red-50 border-red-200', icon: '←' },
    
    // Processing Nodes
    { type: 'text', label: 'Text', color: 'bg-blue-50 border-blue-200', icon: 'T' },
    { type: 'llm', label: 'LLM', color: 'bg-purple-50 border-purple-200', icon: '🧠' },
    { type: 'math', label: 'Math', color: 'bg-yellow-50 border-yellow-200', icon: '📊' },
    
    // Custom Nodes
    { type: 'api', label: 'API', color: 'bg-cyan-50 border-cyan-200', icon: '🌐' },
    { type: 'condition', label: 'Condition', color: 'bg-orange-50 border-orange-200', icon: '🔀' },
    { type: 'loop', label: 'Loop', color: 'bg-indigo-50 border-indigo-200', icon: '🔄' },
    { type: 'data', label: 'Data Store', color: 'bg-pink-50 border-pink-200', icon: '💾' }
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-800">Node Library</h2>
        <p className="text-xs text-slate-500">Drag nodes to the canvas to build your workflow</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3">
        {nodeTypes.map((node) => (
          <DraggableNode
            key={node.type}
            type={node.type}
            label={node.label}
            color={node.color}
            icon={node.icon}
          />
        ))}
      </div>
    </div>
  );
};
```

## Node Type Definitions

**client/src/utils/nodeTypes.ts**
```typescript
import { InputNode } from '../nodes/InputNode';
import { OutputNode } from '../nodes/OutputNode';
import { TextNode } from '../nodes/TextNode';
import { LLMNode } from '../nodes/LLMNode';
import { MathNode } from '../nodes/MathNode';
import { APINode } from '../nodes/APINode';
import { ConditionNode } from '../nodes/ConditionNode';
import { LoopNode } from '../nodes/LoopNode';
import { DataNode } from '../nodes/DataNode';

export const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  text: TextNode,
  llm: LLMNode,
  math: MathNode,
  api: APINode,
  condition: ConditionNode,
  loop: LoopNode,
  data: DataNode,
};
```

## Individual Node Components

**client/src/nodes/InputNode.tsx**
```typescript
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { ArrowRight } from 'lucide-react';

export const InputNode = memo(({ id, data }: BaseNodeProps) => {
  const config: NodeConfig = useMemo(() => ({
    title: "Input Node",
    color: "bg-green-500",
    icon: <ArrowRight size={16} />,
    outputs: [
      { id: "output", label: "Output" }
    ]
  }), []);

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <div className="text-xs text-gray-600">Name</div>
        <input 
          type="text" 
          placeholder="input_" 
          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          defaultValue={data.name || "input_"}
        />
        <div className="text-xs text-gray-600">Type</div>
        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
          <option>Text</option>
          <option>Number</option>
          <option>File</option>
        </select>
      </div>
    </BaseNode>
  );
});

InputNode.displayName = 'InputNode';
```

**client/src/nodes/OutputNode.tsx**
```typescript
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { Eye } from 'lucide-react';

export const OutputNode = memo(({ id, data }: BaseNodeProps) => {
  const config: NodeConfig = useMemo(() => ({
    title: "Output Node",
    color: "bg-red-500",
    icon: <Eye size={16} />,
    inputs: [
      { id: "input", label: "Input" }
    ]
  }), []);

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <div className="text-xs text-gray-600">Name</div>
        <input 
          type="text" 
          placeholder="output_" 
          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          defaultValue={data.name || "output_"}
        />
        <div className="text-xs text-gray-600">Type</div>
        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
          <option>Text</option>
          <option>Number</option>
          <option>File</option>
        </select>
      </div>
    </BaseNode>
  );
});

OutputNode.displayName = 'OutputNode';
```

**client/src/nodes/TextNode.tsx**
```typescript
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { FileText } from 'lucide-react';

export const TextNode = memo(({ id, data }: BaseNodeProps) => {
  const config: NodeConfig = useMemo(() => ({
    title: "Text Node",
    color: "bg-blue-500",
    icon: <FileText size={16} />,
    inputs: [
      { id: "input", label: "Input" }
    ],
    outputs: [
      { id: "output", label: "Output" }
    ]
  }), []);

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <div className="text-xs text-gray-600">Operation</div>
        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
          <option>Format</option>
          <option>Uppercase</option>
          <option>Lowercase</option>
          <option>Replace</option>
        </select>
      </div>
    </BaseNode>
  );
});

TextNode.displayName = 'TextNode';
```

**client/src/nodes/LLMNode.tsx**
```typescript
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { MessageSquare } from 'lucide-react';

export const LLMNode = memo(({ id, data }: BaseNodeProps) => {
  const config: NodeConfig = useMemo(() => ({
    title: "LLM Node",
    color: "bg-purple-500",
    icon: <MessageSquare size={16} />,
    inputs: [
      { id: "input", label: "Input" }
    ],
    outputs: [
      { id: "output", label: "Output" }
    ]
  }), []);

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <div className="text-xs text-gray-600">Model</div>
        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
          <option>GPT-4</option>
          <option>GPT-3.5</option>
          <option>Claude</option>
        </select>
      </div>
    </BaseNode>
  );
});

LLMNode.displayName = 'LLMNode';
```

**client/src/nodes/MathNode.tsx**
```typescript
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { Calculator } from 'lucide-react';

export const MathNode = memo(({ id, data }: BaseNodeProps) => {
  const config: NodeConfig = useMemo(() => ({
    title: "Math Node",
    color: "bg-yellow-500",
    icon: <Calculator size={16} />,
    inputs: [
      { id: "inputA", label: "Input A", position: 30 },
      { id: "inputB", label: "Input B", position: 70 }
    ],
    outputs: [
      { id: "output", label: "Output" }
    ]
  }), []);

  return (
    <BaseNode id={id} data={data} config={config} height={100}>
      <div className="space-y-2">
        <div className="text-xs text-gray-600">Operation</div>
        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
          <option>Add (+)</option>
          <option>Subtract (-)</option>
          <option>Multiply (×)</option>
          <option>Divide (÷)</option>
        </select>
        <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
          Inputs: Input A, Input B
        </div>
      </div>
    </BaseNode>
  );
});

MathNode.displayName = 'MathNode';
```

**client/src/nodes/APINode.tsx**
```typescript
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { Globe } from 'lucide-react';

export const APINode = memo(({ id, data }: BaseNodeProps) => {
  const config: NodeConfig = useMemo(() => ({
    title: "API Node",
    color: "bg-cyan-500",
    icon: <Globe size={16} />,
    inputs: [
      { id: "input", label: "Input" }
    ],
    outputs: [
      { id: "output", label: "Output" }
    ]
  }), []);

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <div className="text-xs text-gray-600">Method</div>
        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
      </div>
    </BaseNode>
  );
});

APINode.displayName = 'APINode';
```

**client/src/nodes/ConditionNode.tsx**
```typescript
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { GitBranch } from 'lucide-react';

export const ConditionNode = memo(({ id, data }: BaseNodeProps) => {
  const config: NodeConfig = useMemo(() => ({
    title: "Condition Node",
    color: "bg-orange-500",
    icon: <GitBranch size={16} />,
    inputs: [
      { id: "input", label: "Input" }
    ],
    outputs: [
      { id: "true", label: "True", position: 30 },
      { id: "false", label: "False", position: 70 }
    ]
  }), []);

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <div className="text-xs text-gray-600">Condition</div>
        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
          <option>Equal to</option>
          <option>Greater than</option>
          <option>Less than</option>
          <option>Contains</option>
        </select>
      </div>
    </BaseNode>
  );
});

ConditionNode.displayName = 'ConditionNode';
```

**client/src/nodes/LoopNode.tsx**
```typescript
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { RotateCcw } from 'lucide-react';

export const LoopNode = memo(({ id, data }: BaseNodeProps) => {
  const config: NodeConfig = useMemo(() => ({
    title: "Loop Node",
    color: "bg-indigo-500",
    icon: <RotateCcw size={16} />,
    inputs: [
      { id: "input", label: "Input" }
    ],
    outputs: [
      { id: "output", label: "Output" }
    ]
  }), []);

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <div className="text-xs text-gray-600">Type</div>
        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
          <option>For Each</option>
          <option>While</option>
          <option>Repeat</option>
        </select>
      </div>
    </BaseNode>
  );
});

LoopNode.displayName = 'LoopNode';
```

**client/src/nodes/DataNode.tsx**
```typescript
import { memo, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { Database } from 'lucide-react';

export const DataNode = memo(({ id, data }: BaseNodeProps) => {
  const config: NodeConfig = useMemo(() => ({
    title: "Data Store",
    color: "bg-pink-500",
    icon: <Database size={16} />,
    inputs: [
      { id: "input", label: "Input" }
    ],
    outputs: [
      { id: "output", label: "Output" }
    ]
  }), []);

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <div className="text-xs text-gray-600">Operation</div>
        <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
          <option>Store</option>
          <option>Retrieve</option>
          <option>Update</option>
          <option>Delete</option>
        </select>
      </div>
    </BaseNode>
  );
});

DataNode.displayName = 'DataNode';
```

This completes the frontend source code package. I'll now create the remaining utility files and UI components to complete your local setup.