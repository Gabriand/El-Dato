import { NavLink, Link } from "react-router-dom";

export default function TopBar() {
    const navItemClass = ({ isActive }) => 
        `cursor-pointer transition-colors py-1 ${isActive ? 'text-primary border-b-2 border-primary' : 'hover:text-primary'}`;

    return (
        <div className="flex justify-between items-center mt-5 mb-4 px-4 lg:px-10">
            <Link to="/" className="text-primary text-4xl lg:text-5xl font-bold hover:scale-105 transition-transform">
                El Dato
            </Link>
            <ul className="hidden md:flex gap-8 font-bold text-gray-500 text-lg items-center mt-2">
                <NavLink to="/" end className={navItemClass}>Inicio</NavLink>
                <NavLink to="/prices" className={navItemClass}>Precios</NavLink>
                <NavLink to="/report" className={navItemClass}>Aportar</NavLink>
                <NavLink to="/profile" className={navItemClass}>Perfil</NavLink>
            </ul>
        </div>
    );
}
