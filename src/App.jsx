import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Dashboard from "./Dashboard";
import AdminPage from "./AdminPage";
import { Toaster } from "react-hot-toast";
import { LogOut, User } from "lucide-react";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      setUser({ email });
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setUser({ email });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-emerald-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-emerald-50 text-gray-900 font-sans selection:bg-emerald-500 selection:text-white">
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#064e3b',
            color: '#fff',
            fontSize: '14px',
          },
        }} />

        <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                {/* User Logo/Picture - Replace src with your actual image URL */}
                <img
                  src="https://ui-avatars.com/api/?name=Daily+Work&background=059669&color=fff"
                  alt="Logo"
                  className="w-10 h-10 rounded-lg shadow-emerald-200 shadow-md object-cover border-2 border-emerald-50"
                />
                <span className="font-bold text-xl tracking-tight text-emerald-950">Daily Work Tracker</span>
              </div>

              {user && (
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-100/50 px-3 py-1 rounded-full">
                    <User size={16} />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/login"
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to="/" />}
            />
            <Route
              path="/reset-password"
              element={!user ? <ResetPassword /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={
                user ? (
                  user.email === "suryaprakash0345@gmail.com" ? (
                    <AdminPage />
                  ) : (
                    <Dashboard userEmail={user.email} />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
