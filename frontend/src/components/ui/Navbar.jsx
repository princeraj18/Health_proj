import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, X, User, LogOut, Stethoscope, FileText, BarChart3, Calendar, User2Icon } from "lucide-react";

const baseLinks = [
  { to: "/", label: "Home", icon: Heart },
  { to: "/services", label: "Services", icon: Stethoscope },
  { to: "/reports", label: "Report Analyzer", icon: FileText },
  { to: "/camps", label: "Health Camps", icon: Calendar },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
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

    // Scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("scroll", handleScroll);
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

  // Check if user is admin
  const isAdmin = currentUser?.admin === "admin" || currentUser?.role === "admin";

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-md" 
        : "bg-gradient-to-r from-blue-50 via-white to-teal-50 border-b border-gray-100"
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg">
              <Heart className="h-6 w-6 text-white" fill="white" />
            </div>
            <div>
              <NavLink to="/" className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">MedLens Assist</span>
                <span className="text-xs text-gray-600 font-medium">AI-Powered Medical Report Analyzer</span>
              </NavLink>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {baseLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}

            {/* Admin Panel Link (Visible only to admins) */}
            {isAdmin && (
              <NavLink
                to="/admin-panel"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <User2Icon className="h-4 w-4" />
                <span>Admin Panel</span>
              </NavLink>
            )}

            {/* Admin/Create Event Links */}
            {!currentUser ? (
              <NavLink
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <span>Admin</span>
              </NavLink>
            ) : (
              <NavLink
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <span>Create Event</span>
              </NavLink>
            )}

            {/* Auth Buttons */}
            <div className="ml-4 pl-4 border-l border-gray-300">
              {!currentUser ? (
                <div className="flex items-center space-x-3">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all shadow-sm"
                  >
                    Get Started
                  </NavLink>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${isAdmin ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-100'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isAdmin ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-teal-500'}`}>
                      {isAdmin ? (
                        <User2Icon className="h-4 w-4 text-white" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-600">
                        {isAdmin ? (
                          <span className="text-purple-700 font-semibold">Administrator</span>
                        ) : (
                          "Patient"
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {baseLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}

            {/* Admin Panel Link (Visible only to admins) */}
            {isAdmin && (
              <NavLink
                to="/admin-panel"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <User2Icon className="h-5 w-5" />
                <span>Admin Panel</span>
              </NavLink>
            )}

            {/* Admin/Create Event Links */}
            {!currentUser ? (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Admin</span>
              </NavLink>
            ) : (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Create Event</span>
              </NavLink>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 pt-3">
              {!currentUser ? (
                <div className="space-y-2">
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center px-3 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all"
                  >
                    Create Account
                  </NavLink>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isAdmin ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isAdmin ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-teal-500'}`}>
                      {isAdmin ? (
                        <User2Icon className="h-5 w-5 text-white" />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-600">{currentUser.email}</p>
                      {isAdmin && (
                        <p className="text-xs text-purple-700 font-semibold mt-1">Administrator</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;