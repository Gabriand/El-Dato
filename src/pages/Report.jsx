import { useState, useEffect, useMemo } from "react";
import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { toast } from "sonner";
import { getProducts, getMarkets, submitReport } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { normalizeCityCode } from "../utils/city";

const normalizeText = (value) =>
    String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

export default function Report() {
    const { profile, user } = useAuth();

    const [products, setProducts] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedMarket, setSelectedMarket] = useState("");
    const [price, setPrice] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [marketSearch, setMarketSearch] = useState("");

    const filteredProducts = useMemo(() => {
        const term = normalizeText(productSearch);
        if (!term) return products;

        return products.filter((prod) => {
            const name = normalizeText(prod.name);
            const unit = normalizeText(prod.unit);
            return name.includes(term) || unit.includes(term);
        });
    }, [products, productSearch]);

    const filteredMarkets = useMemo(() => {
        const term = normalizeText(marketSearch);
        if (!term) return markets;

        return markets.filter((mkt) => {
            const name = normalizeText(mkt.name);
            const location = normalizeText(mkt.location);
            return name.includes(term) || location.includes(term);
        });
    }, [markets, marketSearch]);

    useEffect(() => {
        const loadFormData = async () => {
            setIsLoadingData(true);
            try {
                const userCity = normalizeCityCode(profile?.city);
                const [productsData, marketsData] = await Promise.all([
                    getProducts(),
                    getMarkets(userCity),
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
            });

            toast.success("¡Mil gracias! Has ayudado a tu comunidad 🏆");

            // Reset form (dejamos el mercado asumiendo que el usuario podría reportar más cosas en el mismo mercado)
            setSelectedProduct("");
            setPrice("");
        } catch (error) {
            console.error(error);
            toast.error(
                "Ocurrió un error al subir el precio. Inténtalo de nuevo.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-bg min-h-screen">
            <header>
                <TopBar />
            </header>

            <main
                className="px-4 pb-24 lg:px-10 lg:pb-10 max-w-2xl mx-auto"
                aria-busy={isLoadingData}
            >
                <div className="mb-8 text-center mt-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Pasar el Dato
                    </h2>
                    <p className="text-muted text-sm px-2">
                        Ayuda a tus vecinos reportando el precio real que acabas
                        de ver en tu localidad.
                    </p>
                </div>

                {isLoadingData ? (
                    <div
                        className="flex justify-center text-primary font-bold py-10"
                        role="status"
                        aria-live="polite"
                    >
                        Cargando catálogo...
                    </div>
                ) : (
                    <form
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="productSearch"
                                className="font-semibold text-gray-700"
                            >
                                Buscar producto
                            </label>
                            <input
                                id="productSearch"
                                type="search"
                                value={productSearch}
                                onChange={(e) =>
                                    setProductSearch(e.target.value)
                                }
                                placeholder="Ej: arroz, tomate, queso"
                                className="w-full bg-surface/20 border border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            />

                            <label
                                htmlFor="product"
                                className="font-semibold text-gray-700"
                            >
                                ¿Qué producto viste?
                            </label>
                            <select
                                id="product"
                                required
                                value={selectedProduct}
                                onChange={(e) =>
                                    setSelectedProduct(e.target.value)
                                }
                                className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            >
                                {filteredProducts.length === 0 ? (
                                    <option value="" disabled>
                                        No hay productos para ese filtro
                                    </option>
                                ) : (
                                    <>
                                        <option value="" disabled>
                                            Selecciona un producto...
                                        </option>
                                        {filteredProducts.map((prod) => (
                                            <option
                                                key={prod.id}
                                                value={prod.id}
                                            >
                                                {prod.name} ({prod.unit})
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            <p
                                className="text-xs text-muted"
                                aria-live="polite"
                            >
                                {filteredProducts.length} de {products.length}{" "}
                                productos visibles
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    toast.info(
                                        "Contacta al soporte para agregar productos.",
                                    )
                                }
                                className="text-left mt-0.5 text-primary text-sm font-semibold hover:underline w-max transition-colors"
                            >
                                + Agregar nuevo producto
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="price"
                                className="font-semibold text-gray-700"
                            >
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
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0.05"
                                    required
                                    placeholder="0.00"
                                    className="w-full bg-surface/30 border-2 border-surface p-3.5 pl-8 rounded-xl outline-none focus:border-primary transition-colors text-gray-800 font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="marketSearch"
                                className="font-semibold text-gray-700"
                            >
                                Buscar lugar
                            </label>
                            <input
                                id="marketSearch"
                                type="search"
                                value={marketSearch}
                                onChange={(e) =>
                                    setMarketSearch(e.target.value)
                                }
                                placeholder="Ej: central, caraguay, sauces"
                                className="w-full bg-surface/20 border border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            />

                            <label
                                htmlFor="market"
                                className="font-semibold text-gray-700 flex justify-between items-end"
                            >
                                <span>¿En qué lugar?</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        toast.info("Autocompletando en MVP v2")
                                    }
                                    className="text-primary text-xs font-bold hover:underline"
                                >
                                    📍 Usar GPS
                                </button>
                            </label>
                            <select
                                id="market"
                                required
                                value={selectedMarket}
                                onChange={(e) =>
                                    setSelectedMarket(e.target.value)
                                }
                                className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            >
                                {filteredMarkets.length === 0 ? (
                                    <option value="" disabled>
                                        No hay lugares para ese filtro
                                    </option>
                                ) : (
                                    <>
                                        <option value="" disabled>
                                            Selecciona un lugar...
                                        </option>
                                        {filteredMarkets.map((mkt) => (
                                            <option key={mkt.id} value={mkt.id}>
                                                {mkt.name}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            <p
                                className="text-xs text-muted"
                                aria-live="polite"
                            >
                                {filteredMarkets.length} de {markets.length}{" "}
                                lugares visibles
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    toast.info(
                                        "El modal de nuevo mercado estará disponible pronto.",
                                    )
                                }
                                className="text-left mt-0.5 text-primary text-sm font-semibold hover:underline w-max"
                            >
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
