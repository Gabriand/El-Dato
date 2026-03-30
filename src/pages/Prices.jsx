import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
    addFavorite,
    getCategories,
    getFavoriteProductIds,
    getRecentReports,
    removeFavorite,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { normalizeCityCode } from "../utils/city";
import useInfiniteCardLoader from "../hooks/useInfiniteCardLoader";

const normalizeText = (value) =>
    String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const inferCategory = (productName) => {
    const name = normalizeText(productName);

    if (
        ["leche", "queso", "yogurt", "mantequilla"].some((w) =>
            name.includes(w),
        )
    )
        return "Lácteos";
    if (["pollo", "res", "carne", "cerdo"].some((w) => name.includes(w)))
        return "Carnes";
    if (["atun", "pescado", "camaron"].some((w) => name.includes(w)))
        return "Pescados y mariscos";
    if (["arroz", "avena", "quinua", "trigo"].some((w) => name.includes(w)))
        return "Cereales";
    if (["lenteja", "frijol", "garbanzo"].some((w) => name.includes(w)))
        return "Legumbres";
    if (
        ["tomate", "cebolla", "zanahoria", "pimiento"].some((w) =>
            name.includes(w),
        )
    )
        return "Verduras";
    if (
        ["banana", "platano", "limon", "naranja", "manzana"].some((w) =>
            name.includes(w),
        )
    )
        return "Frutas";

    return "Abarrotes";
};

const getPricesPageSize = () => {
    if (typeof window === "undefined") return 80;

    const width = window.innerWidth;
    if (width < 640) return 28;
    if (width < 1024) return 50;
    return 80;
};

const mergeReportsById = (previousReports, incomingReports) => {
    if (!Array.isArray(incomingReports) || incomingReports.length === 0) {
        return previousReports;
    }

    const seenIds = new Set(previousReports.map((report) => report.id));
    const uniqueIncoming = incomingReports.filter((report) => {
        if (seenIds.has(report.id)) return false;
        seenIds.add(report.id);
        return true;
    });

    return [...previousReports, ...uniqueIncoming];
};

export default function Prices() {
    const { profile, user } = useAuth();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterCategories, setFilterCategories] = useState(["Todos"]);
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [nextOffset, setNextOffset] = useState(0);
    const [hasMoreReports, setHasMoreReports] = useState(false);
    const [isLoadingMoreReports, setIsLoadingMoreReports] = useState(false);
    const [reportsPageSize, setReportsPageSize] = useState(getPricesPageSize);
    const backendSentinelRef = useRef(null);

    const userCity = normalizeCityCode(profile?.city || "gye");

    useEffect(() => {
        const handleResize = () => {
            const nextPageSize = getPricesPageSize();
            setReportsPageSize((currentSize) =>
                currentSize === nextPageSize ? currentSize : nextPageSize,
            );
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const loadInitialReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getRecentReports(userCity, {
                offset: 0,
                limit: reportsPageSize,
                withMeta: true,
            });

            setReports(result.data || []);
            setNextOffset(result.nextOffset || 0);
            setHasMoreReports(Boolean(result.hasMore));
        } catch (error) {
            console.error("Error cargando comparaciones:", error);
            toast.error("No se pudieron cargar los precios.");
            setReports([]);
            setNextOffset(0);
            setHasMoreReports(false);
        } finally {
            setIsLoading(false);
        }
    }, [reportsPageSize, userCity]);

    const loadFilterCategories = useCallback(async () => {
        try {
            const categoriesData = await getCategories();

            const seen = new Set();
            const nextCategories = ["Todos"];

            for (const category of categoriesData || []) {
                const name = String(category?.name || "").trim();
                if (!name) continue;

                const key = normalizeText(name);
                if (!key || key === "todos" || seen.has(key)) continue;

                seen.add(key);
                nextCategories.push(name);
            }

            setFilterCategories(nextCategories);
        } catch (error) {
            console.error("Error cargando categorias:", error);
            setFilterCategories(["Todos"]);
        }
    }, []);

    useEffect(() => {
        if (profile === undefined) return;

        loadInitialReports();
        loadFilterCategories();
    }, [loadFilterCategories, loadInitialReports, profile]);

    useEffect(() => {
        const loadFavorites = async () => {
            if (!user) {
                setFavoriteIds([]);
                return;
            }

            try {
                const ids = await getFavoriteProductIds(user.id);
                setFavoriteIds(ids);
            } catch (error) {
                console.error("Error cargando favoritos:", error);
            }
        };

        loadFavorites();
    }, [user]);

    const handleSaveFavorite = async (productId) => {
        if (!user) {
            toast.info(
                "Inicia sesión para poder guardar productos en tu canasta",
            );
            return;
        }

        const alreadyFavorite = favoriteIds.includes(productId);

        try {
            if (alreadyFavorite) {
                await removeFavorite(user.id, productId);
                setFavoriteIds((prev) => prev.filter((id) => id !== productId));
                toast.info("Producto eliminado de tu Canasta Base");
                return;
            }

            await addFavorite(user.id, productId);
            setFavoriteIds((prev) => [...prev, productId]);
            toast.success("Producto agregado a tu Canasta Base");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar tu canasta.");
        }
    };

    const loadMoreReports = useCallback(async () => {
        if (isLoading || isLoadingMoreReports || !hasMoreReports) return;

        setIsLoadingMoreReports(true);
        try {
            const result = await getRecentReports(userCity, {
                offset: nextOffset,
                limit: reportsPageSize,
                withMeta: true,
            });

            setReports((previous) =>
                mergeReportsById(previous, result.data || []),
            );
            setNextOffset(result.nextOffset || nextOffset);
            setHasMoreReports(Boolean(result.hasMore));
        } catch (error) {
            console.error("Error cargando más comparaciones:", error);
            toast.error("No se pudieron cargar más precios.");
        } finally {
            setIsLoadingMoreReports(false);
        }
    }, [
        hasMoreReports,
        isLoading,
        isLoadingMoreReports,
        nextOffset,
        reportsPageSize,
        userCity,
    ]);

    const comparisons = useMemo(() => {
        const grouped = {};

        reports.forEach((report) => {
            if (!report.products || !report.markets) return;

            const parsedPrice = Number(report.price);
            if (!Number.isFinite(parsedPrice)) return;

            const pId = report.products.id;
            const categoryName =
                report.products.categories?.name ||
                inferCategory(report.products.name);

            if (!grouped[pId]) {
                grouped[pId] = {
                    id: pId,
                    product: `${report.products.name || "Producto"} (1 ${report.products.unit || ""})`,
                    category: categoryName,
                    markets: [],
                };
            }

            const existingMarket = grouped[pId].markets.find(
                (market) => market.id === report.markets.id,
            );
            if (!existingMarket) {
                grouped[pId].markets.push({
                    id: report.markets.id,
                    name: report.markets.name,
                    price: parsedPrice,
                    tag: "",
                    color: "",
                });
            }
        });

        const comparisonsArray = Object.values(grouped).map((group) => {
            const sortedMarkets = group.markets.sort(
                (a, b) => a.price - b.price,
            );

            sortedMarkets.forEach((market, idx) => {
                if (idx === 0) {
                    market.tag = "Más barato";
                    market.color = "text-greent bg-greenb";
                } else if (
                    idx === sortedMarkets.length - 1 &&
                    sortedMarkets.length > 2
                ) {
                    market.tag = "Caro";
                    market.color = "text-redt bg-redb";
                } else {
                    market.tag = "Promedio";
                    market.color = "text-muted bg-surface/50";
                }
            });

            return { ...group, markets: sortedMarkets };
        });

        comparisonsArray.sort((a, b) => a.product.localeCompare(b.product));
        return comparisonsArray;
    }, [reports]);

    const filteredComparisons = useMemo(() => {
        if (activeCategory === "Todos") return comparisons;

        const selected = normalizeText(activeCategory);

        return comparisons.filter((item) => {
            const category = normalizeText(item.category);
            const product = normalizeText(item.product);

            return (
                category.includes(selected) ||
                selected.includes(category) ||
                product.includes(selected)
            );
        });
    }, [activeCategory, comparisons]);

    const {
        visibleItems: visibleComparisons,
        hasMore,
        sentinelRef,
    } = useInfiniteCardLoader({
        items: filteredComparisons,
        initialCount: 10,
        incrementCount: 10,
        resetKey: normalizeText(activeCategory),
    });

    useEffect(() => {
        if (isLoading || isLoadingMoreReports || !hasMoreReports || hasMore) {
            return undefined;
        }

        const sentinel = backendSentinelRef.current;
        if (!sentinel) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!entry?.isIntersecting) return;

                observer.unobserve(entry.target);
                loadMoreReports();
            },
            {
                root: null,
                rootMargin: "420px",
                threshold: 0.01,
            },
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [
        hasMore,
        hasMoreReports,
        isLoading,
        isLoadingMoreReports,
        loadMoreReports,
    ]);

    return (
        <div className="bg-bg min-h-screen">
            <header>
                <TopBar />
            </header>

            <main className="pb-24 lg:pb-10">
                <div className="mb-6 px-4 lg:px-10 mt-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Comparar Precios
                    </h2>
                    <p className="text-muted text-sm">
                        Encuentra dónde está más barato cada producto hoy en tu
                        localidad.
                    </p>
                </div>

                <div className="mb-6">
                    <FilterBar
                        categories={filterCategories}
                        activeCategory={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>

                <section className="flex flex-col gap-6 px-4 lg:px-10 lg:grid lg:grid-cols-2">
                    {isLoading ? (
                        <div className="w-full text-center py-10 text-primary font-bold lg:col-span-2">
                            Analizando precios en tu localidad...
                        </div>
                    ) : filteredComparisons.length > 0 ? (
                        <>
                            {visibleComparisons.map((item) => {
                                const isFavorite = favoriteIds.includes(
                                    item.id,
                                );
                                const visibleMarkets = item.markets.slice(0, 2);
                                const nextMarket = item.markets[2] || null;
                                const hiddenMarketsCount = Math.max(
                                    item.markets.length - 2,
                                    0,
                                );

                                return (
                                    <div
                                        key={item.id}
                                        className="border-2 border-surface rounded-2xl p-5 shadow-sm bg-white"
                                    >
                                        <div className="flex justify-between items-start border-b border-surface pb-3 mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {item.product}
                                                </h3>
                                                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-md bg-surface/60 text-muted font-semibold">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleSaveFavorite(item.id)
                                                }
                                                className={`p-2 rounded-full transition-colors ${isFavorite ? "text-red-500 bg-red-50" : "text-muted hover:text-red-500 hover:bg-red-50"}`}
                                                title={
                                                    isFavorite
                                                        ? "Quitar de canasta"
                                                        : "Guardar en canasta"
                                                }
                                            >
                                                <svg
                                                    width="24px"
                                                    height="24px"
                                                    viewBox="0 0 24 24"
                                                    fill={
                                                        isFavorite
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <ul className="flex flex-col gap-3">
                                            {visibleMarkets.map((market) => (
                                                <li
                                                    key={market.id}
                                                    className="flex justify-between items-center group"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-700">
                                                            {market.name}
                                                        </span>
                                                        <span
                                                            className={`text-xs px-2 py-0.5 rounded-md w-max mt-1 ${market.color} font-bold`}
                                                        >
                                                            {market.tag}
                                                        </span>
                                                    </div>
                                                    <div className="text-xl font-bold text-primary">
                                                        $
                                                        {market.price.toFixed(
                                                            2,
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        {nextMarket && (
                                            <Link
                                                to={`/product/${item.id}`}
                                                className="group block mt-3"
                                            >
                                                <div className="relative overflow-hidden rounded-xl bg-white">
                                                    <div className="py-2 flex justify-between items-center opacity-65">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-gray-700">
                                                                {
                                                                    nextMarket.name
                                                                }
                                                            </span>
                                                            <span
                                                                className={`text-xs px-2 py-0.5 rounded-md w-max mt-1 ${nextMarket.color} font-bold`}
                                                            >
                                                                {nextMarket.tag}
                                                            </span>
                                                        </div>
                                                        <div className="text-xl font-bold text-primary">
                                                            $
                                                            {nextMarket.price.toFixed(
                                                                2,
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-white/70 to-white" />
                                                </div>
                                                <p className="mt-2 text-sm font-semibold text-primary group-hover:underline">
                                                    Ver {hiddenMarketsCount}{" "}
                                                    mercado
                                                    {hiddenMarketsCount === 1
                                                        ? ""
                                                        : "s"}{" "}
                                                    más en detalle →
                                                </p>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                            {hasMore && (
                                <div
                                    ref={sentinelRef}
                                    className="col-span-1 lg:col-span-2 py-2 text-center text-sm text-muted"
                                >
                                    Cargando más comparaciones...
                                </div>
                            )}
                            {!hasMore && hasMoreReports && (
                                <div
                                    ref={backendSentinelRef}
                                    className="col-span-1 lg:col-span-2 py-2 text-center text-sm text-muted"
                                >
                                    {isLoadingMoreReports
                                        ? "Cargando más comparaciones desde el servidor..."
                                        : "Desplázate para cargar más comparaciones..."}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="col-span-1 lg:col-span-2">
                            <EmptyState
                                title="No hay datos suficientes"
                                description={
                                    activeCategory === "Todos"
                                        ? "Aún no se han reportado suficientes precios en tu localidad para hacer una comparación hoy."
                                        : `Aún no se han reportado precios para la categoría "${activeCategory}" hoy.`
                                }
                            />
                        </div>
                    )}
                </section>
            </main>

            <NavBar />
        </div>
    );
}
