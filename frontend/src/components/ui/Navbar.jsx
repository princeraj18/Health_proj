import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";

const baseLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Health Services" },
  { to: "/about", label: "About us" },
  { to: "/camps", label: "Health Camps" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadUser = () => {
      try {
        const cur = localStorage.getItem("currentUser");
        setCurrentUser(cur ? JSON.parse(cur) : null);
      } catch (e) {
        console.warn("Failed to read currentUser:", e);
        setCurrentUser(null);
      }
    };

    loadUser();

    const onAuthChanged = () => loadUser();
    const onStorage = (e) => {
      if (e.key === "currentUser") loadUser();
    };

    window.addEventListener("authChanged", onAuthChanged);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("authChanged"));
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <nav className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Heart className="h-7 w-7 text-primary" />
          <NavLink
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            MedLens Assist
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {baseLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Admin ONLY when NOT logged in */}
          {!currentUser && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground"
                }`
              }
            >
              Admin
            </NavLink>
          )}

          {/* Create Event ONLY when logged in */}
          {currentUser && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground"
                }`
              }
            >
              Create Event
            </NavLink>
          )}

          {!currentUser ? (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md text-foreground/80 hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t">
          <div className="flex flex-col px-4 py-3 space-y-2">
            {baseLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/80 hover:text-foreground"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Admin ONLY when NOT logged in */}
            {!currentUser && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/80 hover:text-foreground"
                  }`
                }
              >
                Admin
              </NavLink>
            )}

            {/* Create Event ONLY when logged in */}
            {currentUser && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/80 hover:text-foreground"
                  }`
                }
              >
                Create Event
              </NavLink>
            )}

            {!currentUser ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-foreground/80 hover:text-foreground"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-foreground/80 hover:text-foreground"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="block text-sm font-medium text-foreground/80 hover:text-foreground text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
