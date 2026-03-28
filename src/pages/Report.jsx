import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { toast } from "sonner";
import { getProducts, getMarkets, submitReport } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Report() {
    const { profile, user } = useAuth();
    
    const [products, setProducts] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedMarket, setSelectedMarket] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [price, setPrice] = useState("");

    useEffect(() => {
        const loadFormData = async () => {
            setIsLoadingData(true);
            try {
                const userCity = profile?.city || 'gye';
                const [productsData, marketsData] = await Promise.all([
                    getProducts(),
                    getMarkets(userCity)
                ]);
                setProducts(productsData || []);
                setMarkets(marketsData || []);
            } catch (error) {
                console.error("Error cargando base de datos:", error);
                toast.error("Error al cargar los productos.");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (profile !== undefined) {
             loadFormData();
        }
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedProduct || !selectedMarket) {
            return toast.error("Selecciona un producto y un mercado.");
        }

        setIsSubmitting(true);
        try {
            await submitReport({
                product_id: parseInt(selectedProduct),
                market_id: parseInt(selectedMarket),
                user_id: user.id, // AuthContext proporciona al usuario logueado
                price: parseFloat(price),
                quantity: parseFloat(quantity)
            });

            toast.success("¡Mil gracias! Has ayudado a tu comunidad 🏆");
            
            // Reset form (dejamos el mercado asumiendo que el usuario podría reportar más cosas en el mismo mercado)
            setSelectedProduct("");
            setQuantity("1");
            setPrice("");

        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al subir el precio. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-bg min-h-screen">
            <header>
                <TopBar />
            </header>
            
            <main className="px-4 pb-24 lg:px-10 lg:pb-10 max-w-2xl mx-auto">
                <div className="mb-8 text-center mt-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Pasar el Dato</h2>
                    <p className="text-muted text-sm px-2">
                        Ayuda a tus vecinos reportando el precio real que acabas de ver en tu localidad.
                    </p>
                </div>

                {isLoadingData ? (
                    <div className="flex justify-center text-primary font-bold py-10">
                        Cargando catálogo...
                    </div>
                ) : (
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="product" className="font-semibold text-gray-700">
                                ¿Qué producto viste?
                            </label>
                            <select 
                                id="product" 
                                required
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            >
                                <option value="" disabled>Selecciona un producto...</option>
                                {products.map(prod => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.name} ({prod.unit})
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={() => toast.info("Contacta al soporte para agregar productos.")} className="text-left mt-0.5 text-primary text-sm font-semibold hover:underline w-max transition-colors">
                                + Agregar nuevo producto
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="quantity" className="font-semibold text-gray-700">
                                ¿Qué cantidad o peso viste? <span className="text-xs text-muted font-normal">(Ejem: 1, 2.5)</span>
                            </label>
                            <input 
                                type="number" 
                                id="quantity" 
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="0.1"
                                step="any"
                                required
                                className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800 font-bold"
                            />
                            {selectedProduct && (
                                <p className="text-xs text-primary font-bold">
                                    Midiendo en: {products.find(p => p.id.toString() === selectedProduct)?.unit}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="price" className="font-semibold text-gray-700">
                                ¿A cómo estaba? ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold text-lg">
                                    $
                                </span>
                                <input 
                                    type="number" 
                                    id="price" 
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    step="0.01"
                                    min="0.05"
                                    required
                                    placeholder="0.00"
                                    className="w-full bg-surface/30 border-2 border-surface p-3.5 pl-8 rounded-xl outline-none focus:border-primary transition-colors text-gray-800 font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="market" className="font-semibold text-gray-700 flex justify-between items-end">
                                <span>¿En qué lugar?</span>
                                <button type="button" onClick={() => toast.info("Autocompletando en MVP v2")} className="text-primary text-xs font-bold hover:underline">
                                    📍 Usar GPS
                                </button>
                            </label>
                            <select 
                                id="market" 
                                required
                                value={selectedMarket}
                                onChange={(e) => setSelectedMarket(e.target.value)}
                                className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            >
                                <option value="" disabled>Selecciona un lugar...</option>
                                {markets.map(mkt => (
                                    <option key={mkt.id} value={mkt.id}>
                                        {mkt.name}
                                    </option>
                                ))}
                            </select>
                            <button type="button" onClick={() => toast.info("El modal de nuevo mercado estará disponible pronto.")} className="text-left mt-0.5 text-primary text-sm font-semibold hover:underline w-max">
                                + Agregar lugar no listado
                            </button>
                        </div>

                        <button 
                            disabled={isSubmitting}
                            type="submit" 
                            className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl mt-4 shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                        >
                            {isSubmitting ? "Subiendo..." : "Subir Precio"}
                        </button>
                    </form>
                )}
            </main>
            
            <NavBar />
        </div>
    );
}
