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
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        style={{ width: '20px', height: '20px' }}
      >
        <X size={12} />
      </button>

      {/* Input Handles */}
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

      {/* Output Handles */}
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

      {/* Node Header */}
      <div className="node-header">
        <div className={`node-indicator ${config.color}`}></div>
        <span className="node-title">{config.title}</span>
      </div>

      {/* Node Content */}
      <div className="node-content">
        {children}
      </div>
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
