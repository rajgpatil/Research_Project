import { Navigate } from "react-router-dom";
import { getUser } from "../store/auth";


export default function Protected({ children }) {
    const user = getUser();

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "admin") return <Navigate to="/" replace />;

    return children;
}