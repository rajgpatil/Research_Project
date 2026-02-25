import { Link } from "react-router-dom";
import { getUser, logout } from "../store/auth";


export default function Navbar() {
    const user = getUser();


    return (
        <div className="bg-white shadow mb-6">
            <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
                <Link to="/" className="font-bold text-lg">KRUSHIMITRA</Link>
                <div className="space-x-4">
                    <Link to="/knowledge">Knowledge</Link>
                    {user?.role === "admin" && <Link to="/admin">Admin</Link>}
                    {user ? (
                        <button onClick={logout} className="bg-gray-900 text-white px-3 py-1 rounded">Logout</button>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}