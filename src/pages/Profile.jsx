import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCityLabel } from "../utils/city";
import { useEffect, useState } from "react";
import { getReportCountByUser } from "../services/api";
import { toast } from "sonner";

export default function Profile() {
    const { logout, profile, user } = useAuth();
    const navigate = useNavigate();
    const [reportCount, setReportCount] = useState(0);
    const [isLoadingCount, setIsLoadingCount] = useState(true);

    useEffect(() => {
        const loadReportCount = async () => {
            if (!user) {
                setReportCount(0);
                setIsLoadingCount(false);
                return;
            }

            setIsLoadingCount(true);
            try {
                const count = await getReportCountByUser(user.id);
                setReportCount(count);
            } catch (error) {
                console.error("Error cargando total de reportes:", error);
                toast.error("No se pudo cargar tu total de reportes.");
                setReportCount(0);
            } finally {
                setIsLoadingCount(false);
            }
        };

        loadReportCount();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const fallBackAvatar = `https://ui-avatars.com/api/?name=${profile?.username || "U"}&background=random`;

    return (
        <div className="bg-bg min-h-screen">
            <header>
                <TopBar />
            </header>

            <main className="px-4 pb-24 lg:px-10 lg:pb-10 max-w-2xl mx-auto">
                <div className="flex flex-col items-center mt-6 mb-10">
                    <img
                        src={profile?.avatar_url || fallBackAvatar}
                        alt="Avatar"
                        className="w-28 h-28 rounded-full shadow-md border-4 border-white mb-4 object-cover"
                    />
                    <h2 className="text-3xl font-bold text-gray-800">
                        {profile?.username
                            ? `@${profile.username}`
                            : "Usuario Local"}
                    </h2>

                    <div className="flex items-center gap-2 mt-3 bg-tone/50 px-4 py-1.5 rounded-full">
                        <span>📍</span>
                        <span className="font-semibold text-primary uppercase text-sm">
                            {getCityLabel(profile?.city)}
                        </span>
                    </div>
                </div>

                <Link
                    to="/my-reports"
                    className="bg-white border-2 border-surface rounded-2xl p-6 shadow-sm mb-6 flex justify-between items-center cursor-pointer hover:border-primary transition-colors group"
                >
                    <div className="flex flex-col">
                        <span className="text-gray-500 font-semibold text-sm uppercase tracking-wide group-hover:text-primary transition-colors">
                            Precios Reportados
                        </span>
                        <span className="text-3xl font-bold text-gray-800 mt-1">
                            {isLoadingCount ? "..." : reportCount}
                        </span>
                    </div>
                    <div className="text-5xl group-hover:scale-110 transition-transform">
                        🏆
                    </div>
                </Link>

                <section className="flex flex-col gap-4">
                    <Link
                        to="/favorites"
                        className="w-full flex justify-between items-center bg-white border-2 border-surface p-4 rounded-xl hover:border-yellow-400 transition-colors text-gray-700 font-semibold group cursor-pointer"
                    >
                        <span className="flex items-center gap-3">
                            <span className="text-xl">⭐</span>
                            Mi Canasta Base
                        </span>
                        <span className="text-muted group-hover:text-yellow-500 transition-colors">
                            →
                        </span>
                    </Link>

                    <Link
                        to="/edit-profile"
                        className="w-full flex justify-between items-center bg-white border-2 border-surface p-4 rounded-xl hover:border-primary transition-colors text-gray-700 font-semibold group cursor-pointer"
                    >
                        <span className="flex items-center gap-3">
                            <span className="text-xl">⚙️</span>
                            Editar Perfil
                        </span>
                        <span className="text-muted group-hover:text-primary transition-colors">
                            →
                        </span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex justify-between items-center bg-white border-2 border-surface p-4 rounded-xl hover:border-red-400 hover:text-red-500 transition-colors text-gray-700 font-semibold group"
                    >
                        <span className="flex items-center gap-3">
                            <span className="text-xl">🚪</span>
                            Cerrar Sesión
                        </span>
                        <span className="text-muted group-hover:text-red-500 transition-colors">
                            →
                        </span>
                    </button>
                </section>
            </main>

            <NavBar />
        </div>
    );
}
