import { useNavigate } from "react-router-dom";

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="bg-bg min-h-screen flex flex-col justify-between p-6 pb-10">
            <div className="flex justify-end pt-4">
                <button 
                    onClick={() => navigate("/")} 
                    className="text-muted font-bold tracking-wide text-sm hover:text-primary transition-colors cursor-pointer"
                >
                    Saltar
                </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center max-w-sm mx-auto gap-8 mt-4 mb-8">
                <div className="bg-white border-4 border-surface w-32 h-32 rounded-[2rem] flex items-center justify-center shadow-lg shadow-surface/50 rotate-3">
                    <span className="text-6xl transform -rotate-3">📱</span>
                </div>
                
                <div className="flex flex-col gap-3 px-2">
                    <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">Bienvenidos a El Dato</h1>
                    <p className="text-muted text-lg font-medium leading-relaxed">
                        La primera red ciudadana de Guayaquil para ganarle a la especulación.
                    </p>
                </div>

                <ul className="text-left w-full flex flex-col gap-4 bg-white p-6 rounded-2xl border-2 border-surface shadow-sm">
                    <li className="flex items-start gap-4">
                        <span className="text-2xl mt-0.5">🔍</span>
                        <p className="text-gray-700 font-semibold text-sm leading-snug">Busca los precios más baratos en tu barrio o mercado favorito.</p>
                    </li>
                    <li className="flex items-start gap-4">
                        <span className="text-2xl mt-0.5">🤝</span>
                        <p className="text-gray-700 font-semibold text-sm leading-snug">Aporta reportando los precios reales que tú encuentras.</p>
                    </li>
                    <li className="flex items-start gap-4">
                        <span className="text-2xl mt-0.5">🏆</span>
                        <p className="text-gray-700 font-semibold text-sm leading-snug">Gana medallas por ser el mejor Guayaco ahorrador.</p>
                    </li>
                </ul>
            </div>

            <button 
                onClick={() => navigate("/")} 
                className="w-full max-w-sm mx-auto bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
            >
                Empezar a Ahorrar
            </button>
        </div>
    );
}
