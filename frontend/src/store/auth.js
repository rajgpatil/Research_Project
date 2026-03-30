import { jwtDecode } from "jwt-decode";
import { clearFarmerProfile } from "./farmerProfile";


export const setToken = (token) => {
    localStorage.setItem("token", token);
};


export const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        // Check expiry
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return null;
        }
        return decoded;
    } catch {
        return null;
    }
};


export const logout = () => {
    localStorage.removeItem("token");
    // Also clear farmer profile so onboarding runs again on next login
    clearFarmerProfile();
    window.location.href = "/login";
};