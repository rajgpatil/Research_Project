import React, { useState } from "react";

import api from "../api";
import { setToken } from "../store/auth";


export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminCode, setAdminCode] = useState("");
    const [error, setError] = useState("");
    const submit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/auth/register", { name, email, password, adminCode });
            setToken(data.token);
            window.location.href = "/";
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };


    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Register</h1>
            <form onSubmit={submit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Admin Code (optional)"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button className="w-full bg-green-600 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}