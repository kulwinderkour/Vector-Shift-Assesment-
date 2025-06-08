import { useState, useCallback, memo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { useStore } from '../store/useStore';

export const InputNode = memo(({ id, data }: BaseNodeProps) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCurrName(newValue);
    updateNodeField(id, 'inputName', newValue);
  }, [id, updateNodeField]);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setInputType(newValue);
    updateNodeField(id, 'inputType', newValue);
  }, [id, updateNodeField]);

  const config: NodeConfig = {
    title: 'Input Node',
    color: 'bg-emerald-500',
    outputs: [{ id: 'value' }]
  };

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Variable name"
          value={currName}
          onChange={handleNameChange}
          className="node-input"
        />
        <select value={inputType} onChange={handleTypeChange} className="node-select">
          <option value="Text">Text</option>
          <option value="File">File</option>
          <option value="Number">Number</option>
        </select>
      </div>
    </BaseNode>
  );
});

InputNode.displayName = 'InputNode';
