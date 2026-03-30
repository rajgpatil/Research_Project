import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { setToken } from "../store/auth";
import { getFarmerProfile } from "../store/farmerProfile";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/auth/login", { email, password });
            setToken(data.token);

            // If farmerProfile already exists in localStorage (returning user on same browser),
            // go straight to chat. Otherwise check backend onboardingDone flag.
            const localProfile = getFarmerProfile();
            if (localProfile) {
                navigate("/", { replace: true });
            } else if (data.user?.onboardingDone && data.user?.farmerProfile?.crop) {
                // Restore profile from server data
                const { setFarmerProfile } = await import("../store/farmerProfile");
                setFarmerProfile(data.user.farmerProfile);
                navigate("/", { replace: true });
            } else {
                navigate("/onboarding", { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full border border-[#dbd8d0] bg-[#f9f8f5] text-sm text-[#1a1a1a] placeholder-[#aaa] px-4 py-2.5 rounded-xl outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/10 transition";

    return (
        <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="bg-white border border-[#e8e6e0] rounded-2xl shadow-sm p-8">
                    <div className="mb-6">
                        <p className="text-xs font-semibold tracking-widest text-[#8b5a2b] uppercase mb-2">KRUSHIMITRA</p>
                        <h1 className="text-xl font-semibold text-[#1a1a1a]">Welcome back</h1>
                        <p className="text-sm text-[#8b8b8b] mt-1">Sign in to your account</p>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputCls}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputCls}
                            required
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <button
                            disabled={loading}
                            className="w-full bg-[#1a1a1a] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#333] disabled:opacity-50 transition-colors duration-150"
                        >
                            {loading ? "Signing in…" : "Login"}
                        </button>
                    </form>
                    <p className="text-center text-xs text-[#8b8b8b] mt-6">
                        No account?{" "}
                        <Link to="/register" className="text-[#1a1a1a] font-medium hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}