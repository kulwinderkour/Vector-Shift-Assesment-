import { useState, useCallback, memo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { useStore } from '../store/useStore';

export const LoopNode = memo(({ id, data }: BaseNodeProps) => {
  const [iterations, setIterations] = useState(data?.iterations || 1);
  const [loopType, setLoopType] = useState(data?.loopType || 'for');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleIterationsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 1;
    setIterations(newValue);
    updateNodeField(id, 'iterations', newValue);
  }, [id, updateNodeField]);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setLoopType(newValue);
    updateNodeField(id, 'loopType', newValue);
  }, [id, updateNodeField]);

  const config: NodeConfig = {
    title: 'Loop Node',
    color: 'bg-indigo-500',
    inputs: [{ id: 'input' }],
    outputs: [{ id: 'output' }]
  };

  return (
    <BaseNode id={id} data={data} config={config} height={100}>
      <div className="space-y-2">
        <select value={loopType} onChange={handleTypeChange} className="node-select">
          <option value="for">For Loop</option>
          <option value="while">While Loop</option>
          <option value="forEach">For Each</option>
        </select>
        <input
          type="number"
          placeholder="Iterations"
          value={iterations}
          onChange={handleIterationsChange}
          min="1"
          className="node-input"
        />
      </div>
    </BaseNode>
  );
});

LoopNode.displayName = 'LoopNode';
