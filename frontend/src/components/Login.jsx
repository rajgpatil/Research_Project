import React, { useState } from "react";
import api from "../api";
import { setToken } from "../store/auth";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const submit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/auth/login", { email, password });
            setToken(data.token);
            window.location.href = "/";
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };


    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Login</h1>
            <form onSubmit={submit} className="space-y-3">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button className="w-full bg-green-600 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}