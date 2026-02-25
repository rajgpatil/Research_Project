import { getUser } from "../store/auth";


export default function Protected({ children }) {
    const user = getUser();


    if (!user) return <div className="p-6">Please login to access this page.</div>;
    if (user.role !== "admin") return <div className="p-6">Access denied. Admins only.</div>;


    return children;
}