import { InputNode } from '../nodes/InputNode';
import { OutputNode } from '../nodes/OutputNode';
import { TextNode } from '../nodes/TextNode';
import { LLMNode } from '../nodes/LLMNode';
import { MathNode } from '../nodes/MathNode';
import { APINode } from '../nodes/APINode';
import { ConditionNode } from '../nodes/ConditionNode';
import { LoopNode } from '../nodes/LoopNode';
import { DataNode } from '../nodes/DataNode';

export const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  text: TextNode,
  llm: LLMNode,
  math: MathNode,
  api: APINode,
  condition: ConditionNode,
  loop: LoopNode,
  data: DataNode,
};
