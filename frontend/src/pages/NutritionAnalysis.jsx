import { useState } from "react";
import { Utensils, ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
const NutritionAnalysis = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [healthConditions, setHealthConditions] = useState([]);
  const [newCondition, setNewCondition] = useState("");
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const commonConditions = ["Diabetes Type 2", "Hypertension", "Heart Disease", "High Cholesterol", "Pregnancy", "Obesity", "Anemia", "Osteoporosis", "Kidney Disease", "Liver Disease"];
  const addCondition = condition => {
    if (condition && !healthConditions.includes(condition)) {
      setHealthConditions([...healthConditions, condition]);
      setNewCondition("");
    }
  };
  const removeCondition = condition => {
    setHealthConditions(healthConditions.filter(c => c !== condition));
  };
 const generateNutritionPlan = async () => {
  if (!age || !gender || !weight || !height || !activityLevel) {
    toast({
      title: "Missing Information",
      description: "Please fill in all basic information fields.",
      variant: "destructive",
    });
    return;
  }

  setIsGenerating(true);

  try {
    const payload = {
      age: Number(age),
      gender,
      weight: Number(weight),
      height: Number(height),
      activity: activityLevel, // ✅ backend key
      conditions: healthConditions.length
        ? healthConditions.join(", ")
        : "none",
    };

    const response = await fetch("http://localhost:8080/api/nutrition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    // Backend returns: { answer: "text..." }
    setNutritionPlan(data.answer);

    toast({
      title: "Nutrition Plan Generated",
      description: "Your personalized nutrition plan is ready.",
    });
  } catch (error) {
    console.error(error);
    toast({
      title: "Generation Error",
      description: "Failed to generate nutrition plan.",
      variant: "destructive",
    });
  } finally {
    setIsGenerating(false);
  }
};

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setActivityLevel("");
    setHealthConditions([]);
    setNutritionPlan(null);
  };
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nutrition Analysis</h1>
            <p className="text-muted-foreground">Get personalized diet plans based on your health profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="h-6 w-6 mr-2 text-purple-600" />
                Health Profile
              </CardTitle>
              <CardDescription>
                Provide your health information for personalized nutrition recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="25" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="70" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="175" value={height} onChange={e => setHeight(e.target.value)} />
                </div>
              </div>

              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Sedentary)</SelectItem>
                    <SelectItem value="moderate">Moderate (Light exercise)</SelectItem>
                    <SelectItem value="high">High (Regular exercise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Health Conditions */}
              <div>
                <Label>Health Conditions</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {healthConditions.map(condition => <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                      {condition}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeCondition(condition)} />
                    </Badge>)}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add health condition" value={newCondition} onChange={e => setNewCondition(e.target.value)} onKeyPress={e => e.key === 'Enter' && addCondition(newCondition)} />
                  <Button variant="outline" size="sm" onClick={() => addCondition(newCondition)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonConditions.map(condition => <Button key={condition} variant="ghost" size="sm" className="text-xs" onClick={() => addCondition(condition)} disabled={healthConditions.includes(condition)}>
                      + {condition}
                    </Button>)}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={generateNutritionPlan} disabled={isGenerating} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  {isGenerating ? <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </> : <>
                      <Utensils className="h-5 w-5 mr-2" />
                      Generate Plan
                    </>}
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Nutrition Plan</CardTitle>
              <CardDescription>
                Your customized diet and nutrition recommendations
              </CardDescription>
            </CardHeader>
           <CardContent>
  {nutritionPlan ? (
    <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg leading-relaxed">
      {nutritionPlan}
    </div>
  ) : (
    <div className="text-center py-12 text-muted-foreground">
      <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>Fill in your health profile to generate a nutrition plan</p>
    </div>
  )}
</CardContent>

          </Card>
        </div>
      </div>
    </div>;
};
export default NutritionAnalysis;