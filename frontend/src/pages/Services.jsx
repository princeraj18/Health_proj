import React from "react";
import { FileText, Pill, Utensils, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  const services = [
    { id: "medicine", title: "Medicine Information", desc: "Scan medicine bottles and tablets to get details and usage guidance.", icon: Pill, path: "/medicine", gradient: "from-green-500 to-emerald-500" },
    { id: "nutrition", title: "Nutrition Analysis", desc: "Personalized diet plans based on conditions and needs.", icon: Utensils, path: "/nutrition", gradient: "from-purple-500 to-pink-500" },
    { id: "reports", title: "Report Summarizer", desc: "Upload medical reports for AI-powered analysis and summaries.", icon: FileText, path: "/reports", gradient: "from-blue-500 to-cyan-500" },
    { id: "diagnosis", title: "Disease Identification", desc: "Analyze symptoms and images for preliminary condition assessment.", icon: Stethoscope, path: "/diagnosis", gradient: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">OUR SERVICES</h1>
          <p className="text-muted-foreground mt-2">Explore our core features to assist with medical insights and wellness.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(s => (
            <Card key={s.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/60 backdrop-blur">
              <CardHeader className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${s.gradient} flex items-center justify-center shadow-lg`}> 
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">{s.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{s.desc}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="mt-4 bg-gradient-to-r from-primary to-accent" onClick={() => navigate(s.path)}>Open</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
