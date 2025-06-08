import { useState, useCallback, memo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { useStore } from '../store/useStore';

export const DataNode = memo(({ id, data }: BaseNodeProps) => {
  const [dataSource, setDataSource] = useState(data?.dataSource || 'CSV');
  const [dataPath, setDataPath] = useState(data?.dataPath || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleSourceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setDataSource(newValue);
    updateNodeField(id, 'dataSource', newValue);
  }, [id, updateNodeField]);

  const handlePathChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDataPath(newValue);
    updateNodeField(id, 'dataPath', newValue);
  }, [id, updateNodeField]);

  const config: NodeConfig = {
    title: 'Data Node',
    color: 'bg-gray-500',
    outputs: [{ id: 'data' }]
  };

  return (
    <BaseNode id={id} data={data} config={config} height={100}>
      <div className="space-y-2">
        <select value={dataSource} onChange={handleSourceChange} className="node-select">
          <option value="CSV">CSV File</option>
          <option value="JSON">JSON File</option>
          <option value="Database">Database</option>
          <option value="API">API Endpoint</option>
          <option value="Text">Text File</option>
        </select>
        <input
          type="text"
          placeholder="Data path/URL"
          value={dataPath}
          onChange={handlePathChange}
          className="node-input"
        />
      </div>
    </BaseNode>
  );
});

DataNode.displayName = 'DataNode';
