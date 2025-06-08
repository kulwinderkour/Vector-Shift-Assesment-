import { useState } from 'react';
import { Button } from './ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog';
import { 
  HelpCircle, 
  ArrowRight, 
  Database, 
  MessageSquare, 
  Calculator, 
  Zap, 
  GitBranch, 
  RotateCcw, 
  Eye, 
  FileText,
  Globe
} from 'lucide-react';

const nodeDocumentation = {
  input: {
    icon: ArrowRight,
    title: "Input Node",
    description: "Entry point for data into your pipeline",
    usage: "Use this to define the starting data for your workflow. You can specify input types like text, numbers, or files.",
    examples: ["User input text", "File uploads", "API parameters", "Form data"],
    outputs: ["Raw input data"]
  },
  output: {
    icon: Eye,
    title: "Output Node",
    description: "Final destination for processed data",
    usage: "Displays or exports the final result of your pipeline processing.",
    examples: ["Generated reports", "Processed text", "Analysis results", "Formatted data"],
    outputs: ["Final processed output"]
  },
  text: {
    icon: FileText,
    title: "Text Node",
    description: "Text processing and manipulation",
    usage: "Process, transform, or analyze text data using various text operations.",
    examples: ["Text formatting", "String concatenation", "Text cleaning", "Content extraction"],
    outputs: ["Processed text", "Text metrics", "Formatted strings"]
  },
  llm: {
    icon: MessageSquare,
    title: "LLM Node",
    description: "Large Language Model integration",
    usage: "Connect to AI language models for text generation, analysis, and conversation.",
    examples: ["Text generation", "Language translation", "Content summarization", "Q&A systems"],
    outputs: ["Generated text", "AI responses", "Analysis results"]
  },
  math: {
    icon: Calculator,
    title: "Math Node",
    description: "Mathematical operations and calculations",
    usage: "Perform arithmetic, statistical, or complex mathematical operations on your data.",
    examples: ["Addition/subtraction", "Statistical analysis", "Data aggregation", "Formula calculations"],
    outputs: ["Calculated results", "Statistical metrics", "Processed numbers"]
  },
  api: {
    icon: Globe,
    title: "API Node",
    description: "External API integration",
    usage: "Connect to external web services and APIs to fetch or send data.",
    examples: ["REST API calls", "Database queries", "Third-party integrations", "Data synchronization"],
    outputs: ["API responses", "External data", "Service results"]
  },
  condition: {
    icon: GitBranch,
    title: "Condition Node",
    description: "Conditional logic and branching",
    usage: "Create decision points in your pipeline based on data conditions or rules.",
    examples: ["If-then logic", "Data validation", "Route selection", "Quality checks"],
    outputs: ["Boolean results", "Filtered data", "Branch selection"]
  },
  loop: {
    icon: RotateCcw,
    title: "Loop Node",
    description: "Iteration and repetitive operations",
    usage: "Repeat operations on datasets or iterate through collections of data.",
    examples: ["Data processing batches", "List iteration", "Bulk operations", "Sequential processing"],
    outputs: ["Processed collections", "Iteration results", "Aggregated data"]
  },
  data: {
    icon: Database,
    title: "Data Store Node",
    description: "Data storage and retrieval",
    usage: "Store, cache, or retrieve data during pipeline execution.",
    examples: ["Temporary storage", "Data caching", "State management", "Result persistence"],
    outputs: ["Stored data", "Retrieved values", "Cache hits"]
  }
};

export const NodeDocumentation = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pipeline Builder Guide</DialogTitle>
          <DialogDescription>
            Learn how to use the VectorShift Pipeline Builder and understand each node type.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Start Guide */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Start Guide</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Drag nodes from the left sidebar to the canvas</li>
              <li>Connect nodes by dragging from output handles (right) to input handles (left)</li>
              <li>Configure each node by editing its properties</li>
              <li>Use the Submit Pipeline button to validate your workflow</li>
              <li>Save, Share, or Export your completed pipeline</li>
            </ol>
          </div>

          {/* Key Features */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
              <li><strong>Node Deletion:</strong> Hover over any node and click the red X button to delete it</li>
              <li><strong>Auto-save:</strong> Your work is automatically saved as you build</li>
              <li><strong>DAG Validation:</strong> Ensures your pipeline forms a valid directed acyclic graph</li>
              <li><strong>Database Integration:</strong> All pipelines are stored in PostgreSQL for persistence</li>
              <li><strong>Export/Import:</strong> Share pipelines as JSON files or shareable links</li>
            </ul>
          </div>

          {/* API Integration Info */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">API Integration</h3>
            <p className="text-sm text-purple-800 mb-2">
              The pipeline builder includes a robust REST API for pipeline management:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
              <li><code>POST /api/pipelines/parse</code> - Validate and analyze pipeline structure</li>
              <li><code>GET /api/pipelines</code> - Retrieve saved pipelines</li>
              <li><code>POST /api/pipelines</code> - Save new pipelines</li>
              <li><code>PUT /api/pipelines/:id</code> - Update existing pipelines</li>
              <li><code>DELETE /api/pipelines/:id</code> - Remove pipelines</li>
            </ul>
          </div>

          {/* Node Types */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Available Node Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(nodeDocumentation).map(([key, node]) => {
                const IconComponent = node.icon;
                return (
                  <div
                    key={key}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedNode(selectedNode === key ? null : key)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">{node.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{node.description}</p>
                    
                    {selectedNode === key && (
                      <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-700 text-sm mb-1">Usage:</h5>
                          <p className="text-sm text-gray-600">{node.usage}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-700 text-sm mb-1">Examples:</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {node.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-700 text-sm mb-1">Outputs:</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {node.outputs.map((output, index) => (
                              <li key={index}>{output}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">Pro Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
              <li>Start with Input nodes and end with Output nodes for clear data flow</li>
              <li>Use Preview to validate your pipeline structure before saving</li>
              <li>Connect nodes in logical order - data flows from left to right</li>
              <li>Save frequently to avoid losing your work</li>
              <li>Use the Clear button to start fresh when needed</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};