import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function ProductDetail() {
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
                <h1 className="text-xl font-bold text-gray-800">Detalle del Producto</h1>
            </header>
            
            <main className="px-4 lg:px-10 lg:pb-10 max-w-2xl mx-auto mt-6">
                <div className="flex bg-white border-2 border-surface p-4 rounded-2xl shadow-sm items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-surface/50 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-4xl">🍚</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Arroz Conejo 2KG</h2>
                        <span className="text-muted font-semibold text-sm">Categoría: Víveres</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white border-2 border-surface p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                        <p className="text-muted text-sm font-semibold mb-1">Precio Promedio</p>
                        <p className="text-2xl font-bold text-gray-800">$2.10</p>
                    </div>
                    <div className="bg-greenb border-2 border-greent/20 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                        <p className="text-greent text-sm font-semibold mb-1">Más Barato</p>
                        <p className="text-2xl font-bold text-greent">$1.85</p>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Precios Reportados Hoy</h3>
                
                <ul className="flex flex-col gap-3 bg-white border-2 border-surface p-5 rounded-2xl shadow-sm">
                    <li className="flex justify-between items-center group border-b border-surface pb-3">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">Mercado Sauces 9</span>
                            <span className="text-xs px-2 py-0.5 rounded-md w-max mt-1 text-greent bg-greenb">
                                Más barato
                            </span>
                        </div>
                        <div className="text-xl font-bold text-primary">
                            $1.85
                        </div>
                    </li>
                    <li className="flex justify-between items-center group pt-2 pb-3 border-b border-surface">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">Mercado Central</span>
                            <span className="text-xs px-2 py-0.5 rounded-md w-max mt-1 text-muted bg-surface/50">
                                Promedio
                            </span>
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                            $2.15
                        </div>
                    </li>
                    <li className="flex justify-between items-center group pt-2">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">Mercado Caraguay</span>
                            <span className="text-xs px-2 py-0.5 rounded-md w-max mt-1 text-redt bg-redb">
                                Caro
                            </span>
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                            $2.30
                        </div>
                    </li>
                </ul>
            </main>
            
            <NavBar />
        </div>
    );
}
