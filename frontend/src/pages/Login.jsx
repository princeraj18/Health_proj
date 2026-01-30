import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeof window === "undefined" || !window.localStorage) {
      alert("Local storage is not available. Cannot login.");
      return;
    }

    // read users
    let users = [];
    try {
      const stored = localStorage.getItem("users");
      if (stored) users = JSON.parse(stored) || [];
    } catch (err) {
      console.warn("Failed to read users from localStorage:", err);
      users = [];
    }

    // hash entered password the same way as Register
    let hashed;
    try {
      if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
        const enc = new TextEncoder();
        const data = enc.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashed = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      } else {
        hashed = simpleHexHash(password);
      }
    } catch (err) {
      console.warn("Hashing failed, falling back to base64:", err);
      try {
        hashed = btoa(password);
      } catch (e) {
        alert("Unable to process password for login.");
        return;
      }
    }

    const found = users.find((u) => u.email === email && u.password === hashed);
    if (!found) {
      alert("Invalid email or password.");
      return;
    }
    else{
      console.log("login");
      
    }

    try {
      localStorage.setItem("currentUser", JSON.stringify(found));
      // notify other components in this tab to update auth state
      try { window.dispatchEvent(new Event('authChanged')); } catch (e) {}
    } catch (err) {
      console.warn("Failed to set currentUser:", err);
    }

    navigate("/");
  };

  // Fallback: simple (non-cryptographic) hex hash used by Register.jsx fallback
  function simpleHexHash(str) {
    let h1 = 0xdeadbeef ^ str.length;
    let h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761) >>> 0;
      h2 = Math.imul(h2 ^ ch, 1597334677) >>> 0;
    }
    return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-md bg-card/95 backdrop-blur p-8 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full">Sign in</Button>
          </div>
          <div className="pt-2 text-center">
            <Button variant="ghost" onClick={() => navigate('/admin-login')} className="w-full">Admin Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
