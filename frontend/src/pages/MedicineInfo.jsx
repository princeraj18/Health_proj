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
      // Simulate medicine identification
      await new Promise(resolve => setTimeout(resolve, 2500));
      const mockMedicineData = {
        name: "Paracetamol",
        genericName: "Acetaminophen",
        strength: "500mg",
        manufacturer: "Generic Pharma",
        type: "Tablet",
        uses: ["Pain relief", "Fever reduction", "Headache treatment", "Muscle pain relief"],
        dosage: {
          adults: "1-2 tablets every 4-6 hours",
          children: "Consult pediatrician for proper dosage",
          maxDaily: "8 tablets (4000mg) per day"
        },
        sideEffects: ["Nausea (rare)", "Allergic reactions (very rare)", "Liver damage (with overdose)"],
        contraindications: ["Severe liver disease", "Alcohol dependency", "Known allergy to acetaminophen"],
        interactions: ["Warfarin (blood thinner)", "Isoniazid (TB medication)", "Alcohol (increases liver toxicity risk)"],
        storage: "Store at room temperature, away from moisture and heat",
        warnings: ["Do not exceed recommended dose", "Consult doctor if symptoms persist", "Not recommended during pregnancy without medical advice"]
      };
      setMedicineInfo(mockMedicineData);
      toast({
        title: "Medicine Identified",
        description: "Successfully identified the medicine and retrieved information."
      });
    } catch (error) {
      toast({
        title: "Identification Error",
        description: "Failed to identify the medicine. Please try again.",
        variant: "destructive"
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
              {medicineInfo ? <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="border-b pb-4">
                    <h3 className="text-2xl font-bold text-foreground">{medicineInfo.name}</h3>
                    <p className="text-muted-foreground">Generic: {medicineInfo.genericName}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{medicineInfo.strength}</Badge>
                      <Badge variant="outline">{medicineInfo.type}</Badge>
                    </div>
                  </div>

                  {/* Uses */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1 text-blue-600" />
                      Uses
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {medicineInfo.uses.map((use, index) => <li key={index}>{use}</li>)}
                    </ul>
                  </div>

                  {/* Dosage */}
                  <div>
                    <h4 className="font-semibold mb-2">Dosage</h4>
                    <div className="text-sm space-y-1 bg-muted/50 p-3 rounded-lg">
                      <p><strong>Adults:</strong> {medicineInfo.dosage.adults}</p>
                      <p><strong>Children:</strong> {medicineInfo.dosage.children}</p>
                      <p><strong>Maximum Daily:</strong> {medicineInfo.dosage.maxDaily}</p>
                    </div>
                  </div>

                  {/* Side Effects */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />
                      Side Effects
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {medicineInfo.sideEffects.map((effect, index) => <li key={index}>{effect}</li>)}
                    </ul>
                  </div>

                  {/* Warnings */}
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center text-destructive">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Important Warnings
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {medicineInfo.warnings.map((warning, index) => <li key={index}>{warning}</li>)}
                    </ul>
                  </div>
                </div> : <div className="text-center py-12 text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Scan a medicine to see detailed information here</p>
                </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default MedicineInfo;