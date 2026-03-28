import { Link } from "react-router-dom";

export default function TopBar() {
    return (
        <div className="flex justify-between items-center mt-5 mb-4 px-4 lg:px-10">
            <h1 className="text-primary text-4xl lg:text-5xl font-bold">
                El Dato
            </h1>
            <ul className="hidden lg:flex gap-6 font-semibold text-muted">
                <Link to="/" className="hover:text-primary cursor-pointer transition-colors">Inicio</Link>
                <Link to="/prices" className="hover:text-primary cursor-pointer transition-colors">Precios</Link>
                <Link to="/report" className="hover:text-primary cursor-pointer transition-colors">Aportar</Link>
                <Link to="/profile" className="hover:text-primary cursor-pointer transition-colors">Perfil</Link>
            </ul>
        </div>
    );
}
