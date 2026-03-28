import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MarketDetail() {
    const navigate = useNavigate();

    return (
        <div className="bg-bg min-h-screen pb-24">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-surface px-4 py-4 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 bg-surface/50 rounded-full text-gray-700 hover:text-primary transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">Detalle del Mercado</h1>
            </header>
            
            <main className="px-4 lg:px-10 lg:pb-10 max-w-2xl mx-auto mt-6">
                <div className="flex bg-white border-2 border-surface p-4 rounded-2xl shadow-sm items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Mercado Sauces 9</h2>
                        <span className="text-muted font-semibold text-sm">Norte de Guayaquil</span>
                    </div>
                </div>

                <div className="bg-tone/50 border border-tone p-4 rounded-2xl shadow-sm flex items-center justify-between mb-8">
                    <span className="text-gray-700 font-bold">14 aportes hoy</span>
                    <span className="text-xs px-2 py-1 rounded-md text-greent bg-greenb font-semibold">Abierto</span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Mejores Precios ("Regalados")</h3>
                
                <ul className="flex flex-col gap-3 bg-white border-2 border-surface p-5 rounded-2xl shadow-sm">
                    <li className="flex justify-between items-center group border-b border-surface pb-3">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">Arroz Conejo 2KG</span>
                            <span className="text-xs text-muted mt-1">
                                Categoría: Víveres
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 mt-1">
                            <span className="text-xl font-bold text-primary">$1.85</span>
                            <div className="flex items-center gap-2 mt-2">
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg border border-surface text-gray-700 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all cursor-pointer font-bold shadow-sm text-sm active:scale-95">
                                    <span className="text-lg">👍</span> Cierto
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg border border-surface text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer font-bold shadow-sm text-sm active:scale-95">
                                    <span className="text-lg">👎</span> Falso
                                </button>
                            </div>
                        </div>
                    </li>
                    <li className="flex justify-between items-center group pt-2 pb-3 border-b border-surface">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">Tomate Riñón 1KG</span>
                            <span className="text-xs text-muted mt-1">
                                Categoría: Vegetales
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 mt-1">
                            <span className="text-xl font-bold text-gray-800">$1.20</span>
                            <div className="flex items-center gap-2 mt-2">
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg border border-surface text-gray-700 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all cursor-pointer font-bold shadow-sm text-sm active:scale-95">
                                    <span className="text-lg">👍</span> Cierto
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg border border-surface text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer font-bold shadow-sm text-sm active:scale-95">
                                    <span className="text-lg">👎</span> Falso
                                </button>
                            </div>
                        </div>
                    </li>
                    <li className="flex justify-between items-center group pt-2">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">Queso Fresco 500g</span>
                            <span className="text-xs text-muted mt-1">
                                Categoría: Lácteos
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 mt-1">
                            <span className="text-xl font-bold text-gray-800">$2.50</span>
                            <div className="flex items-center gap-1 bg-surface/40 rounded-lg px-1 py-0.5">
                                <button className="p-1 rounded text-sm text-gray-500 hover:text-green-600 hover:bg-white transition-colors cursor-pointer">👍</button>
                                <button className="p-1 rounded text-sm text-gray-500 hover:text-red-600 hover:bg-white transition-colors cursor-pointer">👎</button>
                            </div>
                        </div>
                    </li>
                </ul>
            </main>
            
            <NavBar />
        </div>
    );
}
