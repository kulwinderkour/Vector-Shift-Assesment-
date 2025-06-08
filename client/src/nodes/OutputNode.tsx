import { useState, useCallback, memo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { useStore } from '../store/useStore';

export const OutputNode = memo(({ id, data }: BaseNodeProps) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCurrName(newValue);
    updateNodeField(id, 'outputName', newValue);
  }, [id, updateNodeField]);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setOutputType(newValue);
    updateNodeField(id, 'outputType', newValue);
  }, [id, updateNodeField]);

  const config: NodeConfig = {
    title: 'Output Node',
    color: 'bg-red-500',
    inputs: [{ id: 'value' }]
  };

  return (
    <BaseNode id={id} data={data} config={config}>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Output name"
          value={currName}
          onChange={handleNameChange}
          className="node-input"
        />
        <select value={outputType} onChange={handleTypeChange} className="node-select">
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
});

OutputNode.displayName = 'OutputNode';
