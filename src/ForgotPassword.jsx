import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    const formattedEmail = email.trim();

    if (!formattedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formattedEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, { duration: 6000 });
        navigate("/reset-password", { state: { email: formattedEmail } });
      } else {
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("Network error. Could not connect to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-emerald-100 border border-emerald-50">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-emerald-200">W</div>
          <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">Recover Password</h2>
          <p className="text-emerald-600/80 text-sm mt-2">Enter your email to receive recovery instructions.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
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

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5"
          >
            Send OTP <ArrowRight size={16} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link to="/login" className="font-semibold text-emerald-600 hover:underline decoration-2 underline-offset-4 decoration-emerald-200 flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
