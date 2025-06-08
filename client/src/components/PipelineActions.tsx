import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Save, 
  Share, 
  Download, 
  Trash2, 
  FileJson,
  Eye,
  Loader2
} from 'lucide-react';

export const PipelineActions = () => {
  const { nodes, edges, clearWorkflow } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (nodes.length === 0) {
      toast({
        title: "Cannot save empty pipeline",
        description: "Add some nodes to your pipeline before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const pipelineData = {
        name: `Pipeline ${new Date().toLocaleDateString()}`,
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
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null
        })),
        userId: 1 // Demo user ID
      };

      await apiRequest('/api/pipelines', {
        method: 'POST',
        body: JSON.stringify(pipelineData),
      });

      toast({
        title: "Pipeline saved successfully",
        description: "Your pipeline has been saved to the database.",
      });
    } catch (error) {
      toast({
        title: "Failed to save pipeline",
        description: "There was an error saving your pipeline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (nodes.length === 0) {
      toast({
        title: "Cannot export empty pipeline",
        description: "Add some nodes to your pipeline before exporting.",
        variant: "destructive",
      });
      return;
    }

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
        sourceHandle: edge.sourceHandle || null,
        targetHandle: edge.targetHandle || null
      }))
    };

    const dataStr = JSON.stringify(pipelineData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pipeline-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Pipeline exported",
      description: "Your pipeline has been downloaded as a JSON file.",
    });
  };

  const handleShare = () => {
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
        sourceHandle: edge.sourceHandle || null,
        targetHandle: edge.targetHandle || null
      }))
    };

    const encodedData = btoa(JSON.stringify(pipelineData));
    const shareUrl = `${window.location.origin}?pipeline=${encodedData}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Share link copied",
        description: "The pipeline share link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy link",
        description: "Please copy the URL manually from your browser.",
        variant: "destructive",
      });
    });
  };

  const handleClear = () => {
    if (nodes.length === 0) {
      toast({
        title: "Pipeline is already empty",
        description: "There are no nodes to clear.",
      });
      return;
    }

    clearWorkflow();
    toast({
      title: "Pipeline cleared",
      description: "All nodes and connections have been removed.",
    });
  };

  const handlePreview = async () => {
    if (nodes.length === 0) {
      toast({
        title: "Cannot preview empty pipeline",
        description: "Add some nodes to your pipeline before previewing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
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
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null
        }))
      };

      const response = await apiRequest('/api/pipelines/parse', {
        method: 'POST',
        body: JSON.stringify(pipelineData),
      });

      toast({
        title: "Pipeline Analysis",
        description: `${response.num_nodes} nodes, ${response.num_edges} connections. ${response.is_dag ? 'Valid DAG' : 'Not a valid DAG'}`,
      });
    } catch (error) {
      toast({
        title: "Failed to analyze pipeline",
        description: "There was an error analyzing your pipeline structure.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleSave}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save
      </Button>

      <Button
        onClick={handleShare}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Share className="h-4 w-4" />
        Share
      </Button>

      <Button
        onClick={handleExport}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>

      <Button
        onClick={handlePreview}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
        Preview
      </Button>

      <Button
        onClick={handleClear}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
        Clear
      </Button>
    </div>
  );
};