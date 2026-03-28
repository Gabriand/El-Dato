import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { getFavoritesByUser, removeFavorite } from "../services/api";
import { normalizeCityCode } from "../utils/city";

export default function Favorites() {
    const { user, profile } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            if (!user) {
                setFavorites([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const userCity = normalizeCityCode(profile?.city);
                const data = await getFavoritesByUser(user.id, userCity);
                setFavorites(data || []);
            } catch (error) {
                console.error("Error cargando canasta:", error);
                toast.error("No se pudo cargar tu canasta.");
            } finally {
                setIsLoading(false);
            }
        };

        if (profile !== undefined) {
            loadFavorites();
        }
    }, [user, profile]);

    const handleRemoveFavorite = async (productId) => {
        if (!user) return;

        try {
            await removeFavorite(user.id, productId);
            setFavorites((prev) =>
                prev.filter((item) => item.product_id !== productId),
            );
            toast.info("Producto eliminado de tu Canasta Base");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo quitar el producto de tu canasta.");
        }
    };

    return (
        <div className="bg-bg min-h-screen pb-24">
            <header>
                <TopBar />
                <div className="pt-6 px-6 lg:px-10">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Mi Canasta Base ⭐
                    </h1>
                    <p className="text-muted mt-2">
                        Los productos vitales que sigues para ahorrar todos los
                        días.
                    </p>
                </div>
            </header>
            <main>
                <section className="pb-10 pt-2 px-6 lg:px-10 flex flex-col gap-4">
                    {isLoading ? (
                        <div className="w-full pt-8 text-center text-primary font-bold">
                            Cargando tu canasta...
                        </div>
                    ) : favorites.length > 0 ? (
                        favorites.map((item) => {
                            const product = item.product;
                            const latest = item.latest_report;

                            return (
                                <article
                                    key={item.favorite_id}
                                    className="bg-white border-2 border-surface p-4 rounded-2xl flex gap-4 justify-between items-center shadow-sm"
                                >
                                    <Link
                                        to={`/product/${item.product_id}`}
                                        className="flex items-center gap-4 min-w-0 flex-1 hover:opacity-90 transition-opacity"
                                    >
                                        <img
                                            className="w-20 h-20 shrink-0 object-cover rounded-xl bg-surface/40"
                                            src={
                                                product.image_url ||
                                                "https://placehold.co/160x160?text=Producto"
                                            }
                                            alt={product.name}
                                        />

                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-800 text-lg truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-muted">
                                                Unidad: {product.unit}
                                            </p>

                                            {latest ? (
                                                <>
                                                    <p className="text-primary font-extrabold text-2xl mt-1">
                                                        $
                                                        {Number(
                                                            latest.price,
                                                        ).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-muted truncate">
                                                        Último reporte:{" "}
                                                        {latest.markets.name}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-muted mt-2">
                                                    Sin reportes recientes en tu
                                                    localidad.
                                                </p>
                                            )}
                                        </div>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveFavorite(
                                                item.product_id,
                                            )
                                        }
                                        className="p-2.5 rounded-full text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                                        title="Quitar de canasta"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
                                        </svg>
                                    </button>
                                </article>
                            );
                        })
                    ) : (
                        <div className="pt-6">
                            <EmptyState
                                title="Tu canasta está vacía"
                                description="Guarda productos desde Comparar Precios o desde su detalle para hacer seguimiento rápido."
                            />
                        </div>
                    )}
                </section>
            </main>
            <NavBar />
        </div>
    );
}
