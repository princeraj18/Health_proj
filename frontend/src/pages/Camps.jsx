import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "medlens_admin_camps_v1";

const Camps = () => {
  const [camps, setCamps] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCamps(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load camps", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">HEALTH CAMPS</h1>
          <p className="text-muted-foreground mt-2">Community-organized health camps listed by site administrators.</p>
        </header>

        {camps.length === 0 ? (
          <div className="p-6 border rounded text-muted-foreground">No upcoming camps at the moment. Check back later.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {camps.map((camp) => (
              <Card key={camp.id} className="bg-card/80 border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>{camp.title}</div>
                    <div className="text-sm text-muted-foreground">{camp.date}</div>
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{camp.location} • Capacity: {camp.capacity || "—"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{camp.description}</p>
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => alert("To register: contact the organizers or the admin.")}>Register</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Camps;
