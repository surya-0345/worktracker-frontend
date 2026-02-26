import React, { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast.success("Account created! Please login.");
        navigate("/login");
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Registration failed.");
      }
    } catch (error) {
      toast.error("Registration failed. Check server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-emerald-100 border border-emerald-50">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-emerald-200">W</div>
          <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">Create an account</h2>
          <p className="text-emerald-600/80 text-sm mt-2">Start tracking your work journey today.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
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
            <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-emerald-400" size={18} />
              <input
                type="password"
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-2 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-emerald-50/30 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-emerald-500/70 mt-1 ml-1">Must be at least 6 characters.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5"
          >
            Create Account <UserPlus size={16} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-emerald-600 hover:underline decoration-2 underline-offset-4 decoration-emerald-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
