import { memo, ReactNode } from 'react';
import { Handle, Position } from 'reactflow';

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
  return (
    <div 
      className="bg-white rounded-lg border border-slate-200 p-3 relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
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
