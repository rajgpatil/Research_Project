import { Link } from "react-router-dom";
import { getUser, logout } from "../store/auth";
import { getLang } from "../store/farmerProfile";
import { t } from "../i18n/translations";


export default function Navbar() {
    const user = getUser();
    const lang = getLang();

    return (
        <header className="bg-white border-b border-[#e8e6e0] sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-6 h-14 flex justify-between items-center">
                <Link
                    to="/"
                    className="font-semibold text-[15px] tracking-wide text-[#8b5a2b] hover:text-[#6b3f15] transition-colors duration-150"
                >
                    KRUSHIMITRA
                </Link>
                <nav className="flex items-center gap-6">
                    <Link
                        to="/knowledge"
                        className="text-sm text-[#5a5a5a] hover:text-[#1a1a1a] transition-colors duration-150"
                    >
                        {t("knowledge", lang)}
                    </Link>
                    {user?.role === "admin" && (
                        <Link
                            to="/admin"
                            className="text-sm text-[#5a5a5a] hover:text-[#1a1a1a] transition-colors duration-150"
                        >
                            {t("admin", lang)}
                        </Link>
                    )}
                    {/* Back to chat */}
                    <Link
                        to="/"
                        className="text-sm text-[#5a5a5a] hover:text-[#1a1a1a] transition-colors duration-150"
                    >
                        ← Chat
                    </Link>
                    {user ? (
                        <button
                            onClick={logout}
                            className="text-sm bg-[#1a1a1a] text-white px-4 py-1.5 rounded-full hover:bg-[#333] transition-colors duration-150"
                        >
                            {t("logout", lang)}
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-[#5a5a5a] hover:text-[#1a1a1a] transition-colors duration-150"
                            >
                                {t("login", lang)}
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm bg-[#1a1a1a] text-white px-4 py-1.5 rounded-full hover:bg-[#333] transition-colors duration-150"
                            >
                                {t("register", lang)}
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}