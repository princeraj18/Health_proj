import { useState, useRef } from "react";
import { Upload, Pill, ArrowLeft, Loader2, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
const MedicineInfo = () => {
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
  const [medicineInfo, setMedicineInfo] = useState(null);
  // Camera functionality removed — upload-only flow
  const handleFileSelect = event => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
 const identifyMedicine = async () => {
  if (!selectedFile) return;

  setIsProcessing(true);

  try {
    const formData = new FormData();
    formData.append("medicine_image", selectedFile); // MUST match backend

    const response = await fetch("http://localhost:8080/api/medicine", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    // Backend returns { answer: "text..." }
    setMedicineInfo(data.answer);

    toast({
      title: "Medicine Analysis Complete",
      description: "Medicine details retrieved successfully.",
    });
  } catch (error) {
    console.error(error);
    toast({
      title: "Analysis Error",
      description: "Failed to analyze the medicine image.",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMedicineInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Medicine Information</h1>
            <p className="text-muted-foreground">Scan medicines to get detailed information and usage instructions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-6 w-6 mr-2 text-green-600" />
                Scan Medicine
              </CardTitle>
              <CardDescription>
                Upload an image of medicine bottle, tablet, or packaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!previewUrl && <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <Button onClick={() => fileInputRef.current?.click()} className="h-24 bg-gradient-to-r from-green-500 to-emerald-500" size="lg">
                    <Upload className="h-6 w-6 mr-2" />
                    Upload Image
                  </Button>
                </div>}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {/* Camera View */}
              {/* Camera removed; upload-only flow */}

              {/* Preview */}
              {previewUrl && <div className="space-y-4">
                  <img src={previewUrl} alt="Selected medicine" className="w-full rounded-lg border" />
                  <div className="flex gap-4">
                    <Button onClick={identifyMedicine} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                      {isProcessing ? <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Identifying...
                        </> : <>
                          <Pill className="h-5 w-5 mr-2" />
                          Identify Medicine
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
              <CardTitle>Medicine Information</CardTitle>
              <CardDescription>
                Detailed information about the identified medicine
              </CardDescription>
            </CardHeader>
           <CardContent>
  {medicineInfo ? (
    <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg leading-relaxed">
      {medicineInfo}
    </div>
  ) : (
    <div className="text-center py-12 text-muted-foreground">
      <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>Scan a medicine image to see details here</p>
    </div>
  )}
</CardContent>

          </Card>
        </div>
      </div>
    </div>;
};
export default MedicineInfo;