import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { toast } from "sonner";

export default function Report() {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("¡Mil gracias! Has ayudado a la comunidad del Guayas 🏆");
        e.target.reset(); // Limpia los inputs para dar la sensación completa de envío
    };

    return (
        <>
            <header>
                <TopBar />
            </header>
            
            <main className="px-4 pb-24 lg:px-10 lg:pb-10 max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Pasar el Dato</h2>
                    <p className="text-muted text-sm">
                        Ayuda a la comunidad reportando el precio real que acabas de ver.
                    </p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="product" className="font-semibold text-gray-700">
                            ¿Qué producto viste?
                        </label>
                        <select 
                            id="product" 
                            className="w-full bg-surface/30 border-2 border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-700"
                        >
                            <option value="">Selecciona un producto...</option>
                            <option value="1">Arroz Conejo</option>
                            <option value="2">Tomate Riñón</option>
                            <option value="3">Cebolla</option>
                            <option value="4">Limón (Malla)</option>
                        </select>
                        <button type="button" onClick={() => toast.info("El modal de nuevo producto estará disponible la próxima semana.")} className="text-left mt-0.5 text-primary text-sm font-semibold hover:underline w-max">
                            + Agregar nuevo producto
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2 w-1/3">
                            <label htmlFor="quantity" className="font-semibold text-gray-700">Cant.</label>
                            <input 
                                type="number" 
                                id="quantity" 
                                defaultValue="1"
                                min="0.1"
                                step="any"
                                required
                                className="w-full bg-surface/30 border-2 border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800 text-center font-bold"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-2/3">
                            <label htmlFor="unit" className="font-semibold text-gray-700">Medida</label>
                            <select 
                                id="unit" 
                                required
                                className="w-full bg-surface/30 border-2 border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            >
                                <option value="lb">Libras (lb)</option>
                                <option value="kg">Kilos (kg)</option>
                                <option value="unidad">Unidades</option>
                                <option value="litro">Litros (L)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="price" className="font-semibold text-gray-700">
                            ¿A cómo está? ($)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold text-lg">
                                $
                            </span>
                            <input 
                                type="number" 
                                id="price" 
                                step="0.01"
                                placeholder="0.00"
                                className="w-full bg-surface/30 border-2 border-surface p-3 pl-8 rounded-xl outline-none focus:border-primary transition-colors text-gray-800 font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="market" className="font-semibold text-gray-700 flex justify-between items-end">
                            <span>¿En qué mercado?</span>
                            <button type="button" className="text-primary text-xs font-bold hover:underline">
                                📍 Usar mi ubicación
                            </button>
                        </label>
                        <select 
                            id="market" 
                            className="w-full bg-surface/30 border-2 border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-700"
                        >
                            <option value="">Selecciona un mercado...</option>
                            <option value="1">Mercado Sauces 9</option>
                            <option value="2">Mercado Central</option>
                            <option value="3">Mercado Caraguay</option>
                        </select>
                        <button type="button" onClick={() => toast.info("El modal de nuevo mercado estará disponible la próxima semana.")} className="text-left mt-0.5 text-primary text-sm font-semibold hover:underline w-max">
                            + Agregar un lugar no listado
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl mt-4 shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Subir Precio
                    </button>
                </form>
            </main>
            
            <NavBar />
        </>
    );
}
