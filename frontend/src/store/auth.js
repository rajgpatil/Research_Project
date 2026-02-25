import { jwtDecode } from "jwt-decode";



export const setToken = (token) => {
    localStorage.setItem("token", token);
};


export const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch {
        return null;
    }
};


export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};