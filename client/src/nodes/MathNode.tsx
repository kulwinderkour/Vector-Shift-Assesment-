import { useState, useCallback, memo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { useStore } from '../store/useStore';

export const MathNode = memo(({ id, data }: BaseNodeProps) => {
  const [operation, setOperation] = useState(data?.operation || 'add');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleOperationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setOperation(newValue);
    updateNodeField(id, 'operation', newValue);
  }, [id, updateNodeField]);

  const config: NodeConfig = {
    title: 'Math Node',
    color: 'bg-orange-500',
    inputs: [
      { id: 'input1', position: 33 },
      { id: 'input2', position: 67 }
    ],
    outputs: [{ id: 'result' }]
  };

  return (
    <BaseNode id={id} data={data} config={config}>
      <select value={operation} onChange={handleOperationChange} className="node-select">
        <option value="add">Add (+)</option>
        <option value="subtract">Subtract (-)</option>
        <option value="multiply">Multiply (×)</option>
        <option value="divide">Divide (÷)</option>
        <option value="power">Power (^)</option>
        <option value="average">Average</option>
        <option value="min">Minimum</option>
        <option value="max">Maximum</option>
      </select>
    </BaseNode>
  );
});

MathNode.displayName = 'MathNode';
