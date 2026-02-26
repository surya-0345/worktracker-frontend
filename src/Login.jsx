import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Welcome back!");
        onLogin(data.token, email);
        navigate("/");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      toast.error("Login failed. Check server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-emerald-100 border border-emerald-50">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-emerald-200">W</div>
          <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">Welcome back</h2>
          <p className="text-emerald-600/80 text-sm mt-2">Enter your credentials to access your account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-emerald-400" size={18} />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-emerald-50/30 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-emerald-600 hover:text-emerald-800 transition">Forgot details?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-emerald-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-emerald-50/30 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5"
          >
            Sign In <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-emerald-600 hover:underline decoration-2 underline-offset-4 decoration-emerald-200">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
