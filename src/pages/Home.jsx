import { useState, useEffect, useMemo } from "react";
import FilterBar from "../components/FilterBar";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import TopBar from "../components/TopBar";
import EmptyState from "../components/EmptyState";
import { getRecentReports } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { normalizeCityCode } from "../utils/city";
import { toast } from "sonner";

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
        return "lacteos";
    if (["pollo", "res", "carne", "cerdo"].some((w) => name.includes(w)))
        return "carnes";
    if (["atun", "pescado", "camaron"].some((w) => name.includes(w)))
        return "pescados y mariscos";
    if (["arroz", "avena", "quinua", "trigo"].some((w) => name.includes(w)))
        return "cereales";
    if (["lenteja", "frijol", "garbanzo"].some((w) => name.includes(w)))
        return "legumbres";
    if (
        ["tomate", "cebolla", "zanahoria", "pimiento"].some((w) =>
            name.includes(w),
        )
    )
        return "verduras";
    if (
        ["banana", "platano", "limon", "naranja", "manzana"].some((w) =>
            name.includes(w),
        )
    )
        return "frutas";

    return "abarrotes";
};

export default function Home() {
    const { profile } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Simplificaremos las categorías iniciales al MVP
    // Más adelante se pueden cargar desde supabase.from('categories')
    const [activeCategory, setActiveCategory] = useState("Todos");

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                // Default 'gye', pero usa la del perfil si existe
                const userCity = normalizeCityCode(profile?.city);
                const data = await getRecentReports(userCity);
                setReports(data || []);
            } catch (error) {
                console.error("Error cargando reportes:", error);
                toast.error("No se pudieron cargar los reportes en Inicio.");
            } finally {
                setIsLoading(false);
            }
        };

        // Solo carga si profile ya se ha inicializado o si estamos como invitados (null)
        if (profile !== undefined) {
            fetchReports();
        }
    }, [profile]);

    const productCards = useMemo(() => {
        const grouped = {};

        reports.forEach((report) => {
            if (!report.products || !report.markets) return;

            const productId = report.products.id;
            const parsedPrice = Number(report.price);
            if (!Number.isFinite(parsedPrice)) return;

            const categoryName =
                report.products.categories?.name ||
                inferCategory(report.products.name);

            if (!grouped[productId]) {
                grouped[productId] = {
                    idProd: productId,
                    urlImg: report.products.image_url,
                    nombreImg: report.products.name,
                    nombreProd: `${report.products.name} (1 ${report.products.unit})`,
                    categoryName,
                    marketNames: new Set([report.markets.name]),
                    cheapestPrice: parsedPrice,
                    expensivePrice: parsedPrice,
                    cheapestMarket: report.markets.name,
                    latestAt: report.created_at,
                };
                return;
            }

            const current = grouped[productId];
            current.marketNames.add(report.markets.name);

            if (parsedPrice < current.cheapestPrice) {
                current.cheapestPrice = parsedPrice;
                current.cheapestMarket = report.markets.name;
            }

            if (parsedPrice > current.expensivePrice) {
                current.expensivePrice = parsedPrice;
            }
        });

        return Object.values(grouped)
            .map((item) => ({
                ...item,
                marketNames: Array.from(item.marketNames),
            }))
            .sort((a, b) => new Date(b.latestAt) - new Date(a.latestAt));
    }, [reports]);

    const filteredCards = productCards.filter((card) => {
        const normalizedProduct = normalizeText(card.nombreProd);
        const normalizedCategory = normalizeText(card.categoryName);
        const normalizedMarket = normalizeText(card.marketNames.join(" "));
        const normalizedActiveCategory = normalizeText(activeCategory);
        const searchTokens = normalizeText(searchTerm)
            .split(/\s+/)
            .filter(Boolean);

        const matchesCategory =
            activeCategory === "Todos" ||
            normalizedProduct.includes(normalizedActiveCategory) ||
            normalizedCategory.includes(normalizedActiveCategory);

        const matchesSearch =
            searchTokens.length === 0 ||
            searchTokens.every(
                (token) =>
                    normalizedProduct.includes(token) ||
                    normalizedMarket.includes(token) ||
                    normalizedCategory.includes(token),
            );

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-bg min-h-screen">
            <header>
                <TopBar />

                <div className="px-5 lg:px-10 mt-2 mb-4">
                    <p className="text-muted text-sm">
                        Explora los precios reportados por la comunidad y
                        encuentra la mejor opción para ahorrar hoy.
                    </p>
                </div>

                <div className="m-5 lg:mx-10 py-3 p-4 border-2 border-surface rounded-2xl flex gap-3 has-focus:border-primary has-focus:bg-tone">
                    <svg
                        className="text-primary"
                        width="22px"
                        height="22px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="¿Qué buscas ahorrar hoy?"
                        className="flex-1 outline-none bg-transparent"
                    />
                </div>
            </header>
            <main>
                <div>
                    <FilterBar
                        categories={[
                            "Todos",
                            "Arroz",
                            "Azúcar",
                            "Aceite",
                            "Huevos",
                            "Leche",
                            "Pollo",
                            "Carne",
                            "Atún",
                            "Papa",
                            "Queso",
                            "Tomate",
                            "Cebolla",
                            "Plátano",
                            "Pan",
                            "Fideo",
                            "Lenteja",
                            "Frijol",
                            "Harina",
                            "Limón",
                        ]}
                        activeCategory={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>

                <section className="pb-10 lg:flex lg:flex-wrap">
                    {isLoading ? (
                        <div className="w-full pt-10 flex justify-center text-muted font-bold">
                            Cargando reportes de tu localidad...
                        </div>
                    ) : filteredCards.length > 0 ? (
                        filteredCards.map((card) => {
                            const hasComparison =
                                card.expensivePrice > card.cheapestPrice;
                            const savings =
                                card.expensivePrice - card.cheapestPrice;

                            return (
                                <ProductCard
                                    key={card.idProd}
                                    idProd={card.idProd}
                                    urlImg={card.urlImg}
                                    nombreImg={card.nombreImg}
                                    disponible={
                                        hasComparison && savings >= 0.4
                                            ? "Regalado"
                                            : "En algo"
                                    }
                                    nombreProd={card.nombreProd}
                                    lugar={card.cheapestMarket}
                                    precioActual={card.cheapestPrice}
                                    precioAnterior={
                                        hasComparison
                                            ? card.expensivePrice
                                            : null
                                    }
                                />
                            );
                        })
                    ) : (
                        <div className="w-full pt-10">
                            <EmptyState
                                title="No hay reportes recientes"
                                description={
                                    searchTerm
                                        ? `Aún nadie ha reportado precios para "${searchTerm}" el día de hoy en tu localidad.`
                                        : `Aún no hay reportes en tu localidad de esta categoría.`
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
