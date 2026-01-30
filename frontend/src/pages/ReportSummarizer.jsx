import { useState, useRef } from "react";
import { Upload, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
const ReportSummarizer = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  // Camera functionality removed — upload-only flow
  const handleFileSelect = event => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
 const analyzeReport = async () => {
  if (!selectedFile) return;

  setIsProcessing(true);

  try {
    const formData = new FormData();
    formData.append("report", selectedFile); // ✅ MUST be "report"

    const response = await fetch("http://localhost:8080/api/report", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    setAnalysisResult(data.answer); // ✅ backend returns "answer"

    toast({
      title: "Analysis Complete",
      description: "Your medical report has been successfully analyzed.",
    });

  } catch (error) {
    console.error(error);

    toast({
      title: "Analysis Error",
      description: "Failed to analyze the report. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};


  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Report Summarizer</h1>
            <p className="text-muted-foreground">Upload or capture medical reports for AI-powered analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Upload Medical Report
              </CardTitle>
              <CardDescription>
                Upload an image of your medical report for AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!previewUrl && <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <Button onClick={() => fileInputRef.current?.click()} className="h-24 bg-gradient-to-r from-blue-500 to-cyan-500" size="lg">
                    <Upload className="h-6 w-6 mr-2" />
                    Upload File
                  </Button>
                </div>}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {/* Camera View */}
              {/* Camera removed; upload-only flow */}

              {/* Preview */}
              {previewUrl && <div className="space-y-4">
                  <img src={previewUrl} alt="Selected report" className="w-full rounded-lg border" />
                  <div className="flex gap-4">
                    <Button onClick={analyzeReport} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500">
                      {isProcessing ? <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Analyzing...
                        </> : <>
                          <FileText className="h-5 w-5 mr-2" />
                          Analyze Report
                        </>}
                    </Button>
                    <Button onClick={resetAnalysis} variant="outline">
                      Reset
                    </Button>
                  </div>
                </div>}

              {/* canvas removed */}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AI-powered summary and insights from your medical report
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult ? <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg">
                    {analysisResult}
                  </div>
                </div> : <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and analyze a medical report to see results here</p>
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default ReportSummarizer;