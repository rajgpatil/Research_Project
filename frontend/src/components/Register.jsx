import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { setToken } from "../store/auth";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminCode, setAdminCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/auth/register", { name, email, password, adminCode });
            setToken(data.token);
            // New users always go to onboarding
            navigate("/onboarding", { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
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
                        <h1 className="text-xl font-semibold text-[#1a1a1a]">Create an account</h1>
                        <p className="text-sm text-[#8b8b8b] mt-1">Start your farming journey</p>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputCls}
                            required
                        />
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
                        <input
                            type="text"
                            placeholder="Admin Code (optional)"
                            value={adminCode}
                            onChange={(e) => setAdminCode(e.target.value)}
                            className={inputCls}
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <button
                            disabled={loading}
                            className="w-full bg-[#1a1a1a] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#333] disabled:opacity-50 transition-colors duration-150"
                        >
                            {loading ? "Creating account…" : "Register"}
                        </button>
                    </form>
                    <p className="text-center text-xs text-[#8b8b8b] mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#1a1a1a] font-medium hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}