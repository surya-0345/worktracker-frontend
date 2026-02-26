import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        } else {
            toast.error("Please request an OTP first.");
            navigate("/forgot-password");
        }
    }, [location, navigate]);

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/reset-password-confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message, { duration: 5000 });
                navigate("/login");
            } else {
                toast.error(data.message || "Failed to update password.");
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
                    <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">Create New Password</h2>
                    <p className="text-emerald-600/80 text-sm mt-2">Enter the OTP sent to {email} and your new password.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">6-Digit OTP</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-emerald-400" size={18} />
                            <input
                                type="text"
                                placeholder="123456"
                                maxLength="6"
                                className="w-full pl-10 pr-4 py-2 text-center tracking-widest font-bold border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-emerald-50/30 focus:bg-white"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-emerald-400" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-emerald-50/30 focus:bg-white"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-emerald-400" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 border border-emerald-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-emerald-50/30 focus:bg-white"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!otp || !newPassword || !confirmPassword}
                        className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                    >
                        Reset Password <ArrowRight size={16} />
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
