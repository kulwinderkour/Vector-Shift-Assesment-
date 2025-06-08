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

        const position = reactFlowInstance.project({
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
