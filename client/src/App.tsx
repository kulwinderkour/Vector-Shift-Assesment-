import { ReactFlowProvider } from 'reactflow';
import { PipelineToolbar } from './components/PipelineToolbar';
import { SubmitButton } from './components/SubmitButton';
import { PipelineCanvas } from './components/PipelineCanvas';
import { PipelineActions } from './components/PipelineActions';
import { NodeDocumentation } from './components/NodeDocumentation';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <div className="h-screen flex flex-col bg-slate-50">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-800">VectorShift Pipeline Builder</h1>
            </div>
            <div className="flex items-center gap-2">
              <NodeDocumentation />
              <PipelineActions />
            </div>
          </header>

          {/* Toolbar */}
          <PipelineToolbar />

          {/* Canvas */}
          <div className="flex-1">
            <PipelineCanvas />
          </div>

          {/* Bottom Controls */}
          <SubmitButton />
        </div>
        <Toaster />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}

export default App;
