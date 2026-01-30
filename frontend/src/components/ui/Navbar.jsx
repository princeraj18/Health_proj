import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";

const baseLinks = [
  { to: "/", label: "Home" },
  { to: "/admin", label: "Admin" },
  { to: "/services", label: "Health Services" },
  { to: "/about", label: "About us" },
  { to: "/camps", label: "Health Camps" },
];
// Navbar
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      const cur = localStorage.getItem("currentUser");
      if (cur) setCurrentUser(JSON.parse(cur));
    } catch (e) {
      console.warn("Failed to read currentUser from localStorage:", e);
    }

    // Listen for auth changes dispatched within the same tab
    const onAuthChanged = () => {
      try {
        const cur = localStorage.getItem("currentUser");
        setCurrentUser(cur ? JSON.parse(cur) : null);
      } catch (e) {
        console.warn("Failed to parse currentUser on authChanged:", e);
        setCurrentUser(null);
      }
    };

    // Listen for storage events from other tabs
    const onStorage = (e) => {
      if (e.key === "currentUser") onAuthChanged();
    };

    window.addEventListener("authChanged", onAuthChanged);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.removeItem("currentUser");
      } catch (e) {
        console.warn("Failed to remove currentUser:", e);
      }
    }
    setCurrentUser(null);
    // notify other components in this tab
    try { window.dispatchEvent(new Event('authChanged')); } catch (e) {}
    navigate("/");
  };
  return (
    <nav className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="h-7 w-7 text-primary" />
          <NavLink to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MedLens Assist
          </NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {baseLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"}`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {!currentUser ? (
            <>
              <NavLink to="/login" className="text-sm font-medium text-foreground/80 hover:text-foreground">Login</NavLink>
              <NavLink to="/register" className="text-sm font-medium text-foreground/80 hover:text-foreground">Register</NavLink>
            </>
          ) : (
            <button onClick={handleLogout} className="text-sm font-medium text-foreground/80 hover:text-foreground">Logout</button>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-md text-foreground/80 hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <div className="flex flex-col px-4 py-3 space-y-2">
            {baseLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium ${isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {!currentUser ? (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground/80 hover:text-foreground">Login</NavLink>
                <NavLink to="/register" onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground/80 hover:text-foreground">Register</NavLink>
              </>
            ) : (
              <button onClick={() => { setOpen(false); handleLogout(); }} className="block text-sm font-medium text-foreground/80 hover:text-foreground text-left">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;