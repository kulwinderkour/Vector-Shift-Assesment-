import { useState, useCallback, memo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { useStore } from '../store/useStore';

export const ConditionNode = memo(({ id, data }: BaseNodeProps) => {
  const [condition, setCondition] = useState(data?.condition || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleConditionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCondition(newValue);
    updateNodeField(id, 'condition', newValue);
  }, [id, updateNodeField]);

  const config: NodeConfig = {
    title: 'Condition Node',
    color: 'bg-yellow-500',
    inputs: [{ id: 'input' }],
    outputs: [
      { id: 'true', position: 33 },
      { id: 'false', position: 67 }
    ]
  };

  return (
    <BaseNode id={id} data={data} config={config}>
      <input
        type="text"
        placeholder="if condition..."
        value={condition}
        onChange={handleConditionChange}
        className="node-input"
      />
    </BaseNode>
  );
});

ConditionNode.displayName = 'ConditionNode';
