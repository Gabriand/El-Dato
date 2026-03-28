import { useState, useEffect } from "react";
import FilterBar from "../components/FilterBar";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import TopBar from "../components/TopBar";
import EmptyState from "../components/EmptyState";
import { getRecentReports } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
                const userCity = profile?.city || 'gye';
                const data = await getRecentReports(userCity);
                setReports(data || []);
            } catch (error) {
                console.error("Error cargando reportes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Solo carga si profile ya se ha inicializado o si estamos como invitados (null)
        if (profile !== undefined) {
             fetchReports();
        }
    }, [profile]);

    const filteredReports = reports.filter(report => {
        const matchesCategory = activeCategory === "Todos" || report.products.name.toLowerCase().includes(activeCategory.toLowerCase());
        const matchesSearch = report.products.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              report.markets.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-bg min-h-screen">
            <header>
                <TopBar />
                <div className="m-5 lg:m-10 py-3 p-4 border-2 border-surface rounded-2xl flex gap-3 has-focus:border-primary has-focus:bg-tone">
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
                <div onClick={(e) => {
                    const btn = e.target.closest('button');
                    if (btn) setActiveCategory(btn.textContent.trim());
                }}>
                    <FilterBar categories={["Todos", "Arroz", "Queso", "Tomate", "Limón"]} />
                </div>
                
                <section className="pb-10 lg:flex lg:flex-wrap">
                    {isLoading ? (
                        <div className="w-full pt-10 flex justify-center text-muted font-bold">
                            Cargando reportes de tu localidad...
                        </div>
                    ) : filteredReports.length > 0 ? (
                        filteredReports.map((report) => (
                            <ProductCard
                                key={report.id}
                                idProd={report.products.id}
                                urlImg={report.products.image_url}
                                nombreImg={report.products.name}
                                disponible="Confirmado"
                                nombreProd={`${report.products.name} ${report.quantity} ${report.products.unit}`}
                                lugar={report.markets.name}
                                precioActual={report.price}
                                precioAnterior={null}
                            />
                        ))
                    ) : (
                        <div className="w-full pt-10">
                            <EmptyState 
                                title="No hay reportes recientes" 
                                description={searchTerm ? `Aún nadie ha reportado precios para "${searchTerm}" el día de hoy en tu localidad.` : `Aún no hay reportes en tu ciudad de esta categoría.`}
                            />
                        </div>
                    )}
                </section>
            </main>
            <NavBar />
        </div>
    );
}
