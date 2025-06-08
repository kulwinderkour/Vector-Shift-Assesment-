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
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`draggable-node ${color}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      <i className={`${icon} text-sm mb-1`}></i>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
});

DraggableNode.displayName = 'DraggableNode';
