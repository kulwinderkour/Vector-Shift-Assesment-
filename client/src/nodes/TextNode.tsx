import { useState, useCallback, memo, useEffect, useMemo } from 'react';
import { BaseNode, BaseNodeProps, NodeConfig } from '../components/BaseNode';
import { useStore } from '../store/useStore';

export const TextNode = memo(({ id, data }: BaseNodeProps) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [textareaHeight, setTextareaHeight] = useState(60);
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Extract variables from text
  const variables = useMemo(() => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = [];
    let match;
    while ((match = variableRegex.exec(currText)) !== null) {
      const variableName = match[1].trim();
      if (variableName && !matches.includes(variableName)) {
        matches.push(variableName);
      }
    }
    return matches;
  }, [currText]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCurrText(newValue);
    updateNodeField(id, 'text', newValue);
    
    // Auto-resize textarea
    const target = e.target;
    target.style.height = 'auto';
    const newHeight = Math.max(60, Math.min(200, target.scrollHeight));
    setTextareaHeight(newHeight);
    target.style.height = `${newHeight}px`;
  }, [id, updateNodeField]);

  // Dynamic node configuration based on variables
  const config: NodeConfig = useMemo(() => ({
    title: 'Text Node',
    color: 'bg-blue-500',
    inputs: variables.map(variable => ({ id: variable })),
    outputs: [{ id: 'output' }]
  }), [variables]);

  // Calculate dynamic height based on content and variables
  const nodeHeight = useMemo(() => {
    const baseHeight = 80;
    const textareaExtraHeight = Math.max(0, textareaHeight - 60);
    const variablesHeight = variables.length > 0 ? 20 : 0;
    return baseHeight + textareaExtraHeight + variablesHeight;
  }, [textareaHeight, variables.length]);

  return (
    <BaseNode id={id} data={data} config={config} height={nodeHeight}>
      <div className="space-y-2">
        <textarea
          placeholder="Enter text with {{variables}}"
          value={currText}
          onChange={handleTextChange}
          className="node-textarea resize-none"
          style={{ height: `${textareaHeight}px` }}
          rows={1}
        />
        {variables.length > 0 && (
          <div className="text-xs text-slate-500">
            Variables: {variables.join(', ')}
          </div>
        )}
      </div>
    </BaseNode>
  );
});

TextNode.displayName = 'TextNode';
