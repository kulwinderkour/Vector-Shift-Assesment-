import { DraggableNode } from './DraggableNode';

export const PipelineToolbar = () => {
  return (
    <div className="pipeline-toolbar">
      <div className="px-6 py-4">
        <h2 className="text-sm font-medium text-slate-700 mb-3">Node Palette</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          <DraggableNode 
            type="customInput" 
            label="Input" 
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            icon="fas fa-sign-in-alt"
          />
          <DraggableNode 
            type="text" 
            label="Text" 
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            icon="fas fa-font"
          />
          <DraggableNode 
            type="customOutput" 
            label="Output" 
            color="bg-gradient-to-br from-red-500 to-red-600"
            icon="fas fa-sign-out-alt"
          />
          <DraggableNode 
            type="llm" 
            label="LLM" 
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            icon="fas fa-brain"
          />
          <DraggableNode 
            type="math" 
            label="Math" 
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            icon="fas fa-calculator"
          />
          <DraggableNode 
            type="api" 
            label="API" 
            color="bg-gradient-to-br from-teal-500 to-teal-600"
            icon="fas fa-plug"
          />
          <DraggableNode 
            type="condition" 
            label="Condition" 
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            icon="fas fa-code-branch"
          />
          <DraggableNode 
            type="loop" 
            label="Loop" 
            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
            icon="fas fa-redo"
          />
          <DraggableNode 
            type="data" 
            label="Data" 
            color="bg-gradient-to-br from-gray-500 to-gray-600"
            icon="fas fa-database"
          />
        </div>
      </div>
    </div>
  );
};
