import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function TopBar() {
    const { user } = useAuth();

    const handleProtectedClick = (e) => {
        if (!user) {
            e.preventDefault();
            toast.error(
                "Para poder acceder aquí debes iniciar sesión primero.",
                { position: "top-center" },
            );
        }
    };
    const navItemClass = ({ isActive }) =>
        `cursor-pointer transition-colors py-1 ${isActive ? "text-primary border-b-2 border-primary" : "hover:text-primary"}`;

    return (
        <div className="flex justify-between items-center mt-5 mb-4 px-4 lg:px-10">
            <Link
                to="/"
                className="group flex items-center gap-2.5 text-primary transition-transform hover:scale-105"
            >
                <img
                    src="/brand/logo-64.webp"
                    srcSet="/brand/logo-48.webp 48w, /brand/logo-64.webp 64w"
                    sizes="(max-width: 640px) 40px, 52px"
                    alt="Logo de El Dato"
                    className="h-10 w-10 rounded-xl border border-surface/80 object-cover shadow-sm sm:h-12 sm:w-12"
                />
                <div className="leading-none">
                    <p className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                        El Dato
                    </p>
                    <p className="mt-1 hidden text-xs font-semibold text-muted sm:block">
                        Compara y ahorra en Ecuador
                    </p>
                </div>
            </Link>
            <ul className="hidden md:flex gap-8 font-bold text-gray-500 text-lg items-center mt-2">
                <NavLink to="/" end className={navItemClass}>
                    Inicio
                </NavLink>
                <NavLink to="/prices" className={navItemClass}>
                    Precios
                </NavLink>
                <NavLink
                    to="/report"
                    onClick={handleProtectedClick}
                    className={navItemClass}
                >
                    Aportar
                </NavLink>
                <NavLink
                    to={user ? "/profile" : "/login"}
                    className={navItemClass}
                >
                    {user ? "Perfil" : "Ingresar"}
                </NavLink>
            </ul>
        </div>
    );
}
