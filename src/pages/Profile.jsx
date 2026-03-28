import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";

export default function Profile() {
    const user = {
        fullName: "Juan Perez",
        username: "@juan_ahorrador",
        city: "Guayaquil",
        contributions: 14,
        avatarUrl: "https://ui-avatars.com/api/?name=Juan+Perez&background=random"
    };

    return (
        <>
            <header>
                <TopBar />
            </header>
            
            <main className="px-4 pb-24 lg:px-10 lg:pb-10 max-w-2xl mx-auto">
                <div className="flex flex-col items-center mt-6 mb-10">
                    <img 
                        src={user.avatarUrl} 
                        alt="Avatar" 
                        className="w-28 h-28 rounded-full shadow-md border-4 border-white mb-4"
                    />
                    <h2 className="text-3xl font-bold text-gray-800">{user.fullName}</h2>
                    <p className="text-muted text-lg">{user.username}</p>
                    
                    <div className="flex items-center gap-2 mt-2 bg-tone/50 px-4 py-1.5 rounded-full">
                        <span>📍</span>
                        <span className="font-semibold text-primary">{user.city}</span>
                    </div>
                </div>

                <section className="bg-white border-2 border-surface rounded-2xl p-6 shadow-sm mb-6 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-gray-500 font-semibold text-sm uppercase tracking-wide">
                            Precios Reportados
                        </span>
                        <span className="text-3xl font-bold text-gray-800 mt-1">
                            {user.contributions}
                        </span>
                    </div>
                    <div className="text-5xl">🏆</div>
                </section>

                <section className="flex flex-col gap-4">
                    <Link to="/edit-profile" className="w-full flex justify-between items-center bg-white border-2 border-surface p-4 rounded-xl hover:border-primary transition-colors text-gray-700 font-semibold group cursor-pointer">
                        <span className="flex items-center gap-3">
                            <span className="text-xl">⚙️</span>
                            Editar Perfil
                        </span>
                        <span className="text-muted group-hover:text-primary transition-colors">→</span>
                    </Link>

                    <button className="w-full flex justify-between items-center bg-white border-2 border-surface p-4 rounded-xl hover:border-red-400 hover:text-red-500 transition-colors text-gray-700 font-semibold group">
                        <span className="flex items-center gap-3">
                            <span className="text-xl">🚪</span>
                            Cerrar Sesión
                        </span>
                        <span className="text-muted group-hover:text-red-500 transition-colors">→</span>
                    </button>
                </section>
            </main>
            
            <NavBar />
        </>
    );
}
