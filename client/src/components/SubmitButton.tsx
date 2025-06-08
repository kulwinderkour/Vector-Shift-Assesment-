import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export const SubmitButton = () => {
  const { nodes, edges } = useStore();
  const [showAlert, setShowAlert] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (pipelineData: any) => {
      const response = await apiRequest('POST', '/api/pipelines/parse', pipelineData);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setShowAlert(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit pipeline. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    const pipelineData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      }))
    };

    submitMutation.mutate(pipelineData);
  };

  const clearPipeline = () => {
    useStore.setState({ nodes: [], edges: [] });
    toast({
      title: "Pipeline Cleared",
      description: "All nodes and connections have been removed.",
    });
  };

  return (
    <>
      <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        {/* Canvas Controls */}
        <div className="flex items-center space-x-4">
          <button className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Zoom Out
          </button>
          <button className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Zoom In
          </button>
          <button className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Fit View
          </button>
          <div className="text-sm text-slate-600">
            {nodes.length} nodes, {edges.length} connections
          </div>
        </div>

        {/* Pipeline Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={clearPipeline}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending || nodes.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {submitMutation.isPending ? (
              <>
                <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Pipeline
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Result Modal */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Pipeline Analysis Complete
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Number of Nodes:</span>
                  <span className="font-medium text-slate-800">{analysisResult?.num_nodes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Number of Edges:</span>
                  <span className="font-medium text-slate-800">{analysisResult?.num_edges}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Valid DAG:</span>
                  <span className={`font-medium ${analysisResult?.is_dag ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisResult?.is_dag ? (
                      <>
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Yes
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        No
                      </>
                    )}
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
