import { useState, useCallback, memo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { useStore } from '../store/useStore';

export const LLMNode = memo(({ id, data }: BaseNodeProps) => {
  const [selectedModel, setSelectedModel] = useState(data?.model || 'GPT-4');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleModelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedModel(newValue);
    updateNodeField(id, 'model', newValue);
  }, [id, updateNodeField]);

  const config: NodeConfig = {
    title: 'LLM Node',
    color: 'bg-purple-500',
    inputs: [
      { id: 'system', position: 33 },
      { id: 'prompt', position: 67 }
    ],
    outputs: [{ id: 'response' }]
  };

  return (
    <BaseNode id={id} data={data} config={config}>
      <select value={selectedModel} onChange={handleModelChange} className="node-select">
        <option value="GPT-4">GPT-4</option>
        <option value="GPT-3.5">GPT-3.5</option>
        <option value="Claude">Claude</option>
        <option value="Llama">Llama</option>
        <option value="Gemini">Gemini</option>
      </select>
    </BaseNode>
  );
});

LLMNode.displayName = 'LLMNode';
