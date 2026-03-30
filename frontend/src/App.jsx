import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { getUser } from "./store/auth";
import { getFarmerProfile } from "./store/farmerProfile";
import ChatLayout from "./components/ChatLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import Knowledge from "./components/Knowledge";
import Admin from "./components/Admin";
import Protected from "./components/Protected";
import Onboarding from "./components/Onboarding";
import Navbar from "./components/Navbar";


/**
 * AuthGuard — redirect to /login if not authenticated.
 * If authenticated but onboarding not done (no farmerProfile), redirect to /onboarding.
 */
function AuthGuard({ children }) {
    const user = getUser();
    const profile = getFarmerProfile();

    if (!user) return <Navigate to="/login" replace />;
    // If they haven't completed onboarding yet
    if (!profile) return <Navigate to="/onboarding" replace />;

    return children;
}


/**
 * GuestGuard — redirect logged-in users away from /login and /register.
 */
function GuestGuard({ children }) {
    const user = getUser();
    const profile = getFarmerProfile();

    if (user) {
        if (!profile) return <Navigate to="/onboarding" replace />;
        return <Navigate to="/" replace />;
    }
    return children;
}


/**
 * Pages that keep the top Navbar (non-chat pages)
 */
function NavbarLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f4f0]">
            <Navbar />
            <div className="flex-1">{children}</div>
        </div>
    );
}


function App() {
    return (
        <Routes>
            {/* Guest-only */}
            <Route path="/login"    element={<GuestGuard><Login /></GuestGuard>} />
            <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />

            {/* Onboarding — auth required but no profile guard */}
            <Route path="/onboarding" element={
                (() => {
                    const user = getUser();
                    if (!user) return <Navigate to="/login" replace />;
                    return <Onboarding />;
                })()
            } />

            {/* Main chat (Claude-style layout — no Navbar, has sidebar) */}
            <Route path="/" element={
                <AuthGuard><ChatLayout /></AuthGuard>
            } />

            {/* Knowledge and Admin keep the Navbar */}
            <Route path="/knowledge" element={
                <AuthGuard>
                    <NavbarLayout><Knowledge /></NavbarLayout>
                </AuthGuard>
            } />

            <Route path="/admin" element={
                <Protected>
                    <NavbarLayout><Admin /></NavbarLayout>
                </Protected>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}


export default App;