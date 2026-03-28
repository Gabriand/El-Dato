import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast } from "sonner";

export default function MyReports() {
    const navigate = useNavigate();

    const handleDelete = () => {
        toast.info("Aporte eliminado permanentemente");
    };

    return (
        <div className="bg-bg min-h-screen pb-24">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-surface px-4 py-4 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 bg-surface/50 rounded-full text-gray-700 hover:text-primary transition-colors cursor-pointer"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Mis Aportes</h1>
            </header>
            
            <main className="px-4 lg:px-10 max-w-2xl mx-auto mt-6">
                <p className="text-muted mb-6">Aquí tienes el historial de precios que has ayudado a recolectar. ¡Gracias por contribuir!</p>

                <ul className="flex flex-col gap-4">
                    <li className="bg-white border-2 border-surface p-4 rounded-2xl flex justify-between items-center shadow-sm">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-lg">Arroz Conejo</span>
                            <span className="text-sm text-muted">Hace 2 horas</span>
                            <span className="text-sm font-semibold text-gray-600 mt-0.5">📍 Mercado Sauces 9</span>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                                <span className="text-xl font-bold text-primary block">$1.85</span>
                                <span className="text-xs text-muted font-bold bg-surface/50 px-2 py-0.5 rounded-md">2 KG</span>
                            </div>
                            <button onClick={() => handleDelete(1)} className="p-1.5 px-3 flex items-center gap-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer font-semibold text-sm">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </li>
                    <li className="bg-white border-2 border-surface p-4 rounded-2xl flex justify-between items-center shadow-sm">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-lg">Tomate Riñón</span>
                            <span className="text-sm text-muted">Ayer</span>
                            <span className="text-sm font-semibold text-gray-600 mt-0.5">📍 Mercado Central</span>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="text-right">
                                <span className="text-xl font-bold text-primary block">$1.20</span>
                                <span className="text-xs text-muted font-bold bg-surface/50 px-2 py-0.5 rounded-md">1 LB</span>
                            </div>
                            <button onClick={() => handleDelete(2)} className="p-1.5 px-3 flex items-center gap-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer font-semibold text-sm">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </li>
                </ul>
            </main>
            <NavBar />
        </div>
    );
}
