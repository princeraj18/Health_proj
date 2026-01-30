import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/admin", label: "Admin" },
 
  { to: "/services", label: "Health Services" },
  { to: "/about", label: "About us" },
  { to: "/camps", label: "Health Camps" }, { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];
// Navbar
const Navbar = () => {
  const [open, setOpen] = useState(false);
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
          {links.map(link => (
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
            {links.map(link => (
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;