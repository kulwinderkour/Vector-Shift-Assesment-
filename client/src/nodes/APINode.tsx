import { useState, useCallback, memo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { useStore } from '../store/useStore';

export const APINode = memo(({ id, data }: BaseNodeProps) => {
  const [endpoint, setEndpoint] = useState(data?.endpoint || '');
  const [method, setMethod] = useState(data?.method || 'GET');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleEndpointChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEndpoint(newValue);
    updateNodeField(id, 'endpoint', newValue);
  }, [id, updateNodeField]);

  const handleMethodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setMethod(newValue);
    updateNodeField(id, 'method', newValue);
  }, [id, updateNodeField]);

  const config: NodeConfig = {
    title: 'API Node',
    color: 'bg-teal-500',
    inputs: [{ id: 'data' }],
    outputs: [{ id: 'response' }]
  };

  return (
    <BaseNode id={id} data={data} config={config} height={100}>
      <div className="space-y-2">
        <select value={method} onChange={handleMethodChange} className="node-select">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input
          type="text"
          placeholder="API endpoint URL"
          value={endpoint}
          onChange={handleEndpointChange}
          className="node-input"
        />
      </div>
    </BaseNode>
  );
});

APINode.displayName = 'APINode';
