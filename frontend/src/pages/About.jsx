import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold">About Us</h1>
            <p className="text-muted-foreground mt-2">MedLens Assist — AI tools to help you understand medical reports, medicines and symptoms.</p>
          </div>
          <div>
            {/* <Button variant="secondary" onClick={() => navigate('/')}>Home</Button> */}
          </div>
        </div>

        <Card className="mb-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
            <p className="text-sm text-muted-foreground">We aim to make healthcare information accessible and understandable by combining AI with easy-to-use tools that summarize reports, identify medicines, analyze nutrition, and assist with symptom assessment.</p>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">What We Offer</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Report summarization and insights</li>
              <li>Medicine identification and usage information</li>
              <li>Disease/symptom preliminary analysis</li>
              <li>Nutrition analysis and recommendations</li>
              <li>Community health camps listing and management</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Team</h2>
            <p className="text-sm text-muted-foreground">A small team of engineers, designers, and healthcare advisors building tools to empower users with actionable medical information. For inquiries, reach out via the project repository or contact the site administrator.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
