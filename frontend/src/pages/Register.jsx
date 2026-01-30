import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save user to localStorage (simple local registration)
    // Defensive: ensure localStorage is available
    if (typeof window === "undefined" || !window.localStorage) {
      alert("Local storage is not available in this environment. Registration cannot proceed.");
      return;
    }

    // read existing users (non-fatal)
    let users = [];
    try {
      const stored = localStorage.getItem("users");
      if (stored) users = JSON.parse(stored) || [];
    } catch (err) {
      console.warn("Could not read existing users from localStorage, continuing with empty list:", err);
      users = [];
    }

    // prevent duplicate email
    if (users.find((u) => u.email === email)) {
      alert("An account with this email already exists.");
      return;
    }

    // hash password before storing (client-side SHA-256). Use fallback if hashing fails.
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
      if (!hashedPassword) throw new Error("Empty hash returned");
    } catch (err) {
      console.warn("Password hashing failed, falling back to base64 (insecure):", err);
      try {
        hashedPassword = btoa(password);
      } catch (b64err) {
        console.error("Base64 fallback failed:", b64err);
        alert("Unable to process password for registration.");
        return;
      }
    }

    const admin = "admin"
    const newUser = { name, email, password: hashedPassword , admin };
    users.push(newUser);

    try {
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      // notify other components in this tab to update auth state
      try { window.dispatchEvent(new Event('authChanged')); } catch (e) {}
      console.log("Registered user:", newUser);
    } catch (err) {
      console.error("Failed to write user to localStorage:", err);
      alert("Registration failed: cannot save data locally.");
      return;
    }

    // clear inputs (optional)
    setName("");
    setEmail("");
    setPassword("");

    navigate("/");
  };

  // simple SHA-256 hash using Web Crypto API; returns hex string
  async function hashPassword(pwd) {
    try {
      if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
        const enc = new TextEncoder();
        const data = enc.encode(pwd);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (e) {
      console.warn("Web Crypto digest failed, falling back to JS implementation:", e);
    }

    // Fallback: use the simpleHexHash fallback declared below
    return simpleHexHash(pwd);
  }

  // Fallback: simple (non-cryptographic) hex hash for environments without Web Crypto
  function simpleHexHash(str) {
    let h1 = 0xdeadbeef ^ str.length;
    let h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761) >>> 0;
      h2 = Math.imul(h2 ^ ch, 1597334677) >>> 0;
    }
    // combine to 64-bit-like hex string
    return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-md bg-card/95 backdrop-blur p-8 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Create an account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full">Register</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
