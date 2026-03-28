import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import { useState, useEffect } from "react";
import { getRecentReports } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function Prices() {
    const { profile, user } = useAuth();
    const [comparisons, setComparisons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                const userCity = profile?.city || 'gye';
                const data = await getRecentReports(userCity);
                
                if (!data) return;

                const grouped = {};
                data.forEach(report => {
                    const pId = report.products.id;
                    if (!grouped[pId]) {
                        grouped[pId] = {
                            id: pId,
                            product: `${report.products.name} ${report.quantity} ${report.products.unit}`,
                            markets: []
                        };
                    }
                    
                    const existingMarket = grouped[pId].markets.find(m => m.id === report.markets.id);
                    if (!existingMarket) {
                        grouped[pId].markets.push({
                            id: report.markets.id,
                            name: report.markets.name,
                            price: report.price,
                            tag: "",
                            color: ""
                        });
                    }
                });

                const comparisonsArray = Object.values(grouped).map(group => {
                    const sortedMarkets = group.markets.sort((a, b) => a.price - b.price);
                    
                    sortedMarkets.forEach((m, idx) => {
                        if (idx === 0) {
                            m.tag = "Más barato";
                            m.color = "text-greent bg-greenb";
                        } else if (idx === sortedMarkets.length - 1 && sortedMarkets.length > 2) {
                            m.tag = "Caro";
                            m.color = "text-redt bg-redb";
                        } else {
                            m.tag = "Promedio";
                            m.color = "text-muted bg-surface/50";
                        }
                    });

                    return { ...group, markets: sortedMarkets };
                });

                comparisonsArray.sort((a, b) => a.product.localeCompare(b.product));
                setComparisons(comparisonsArray);

            } catch (error) {
                console.error("Error cargando comparaciones:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (profile !== undefined) {
             fetchReports();
        }
    }, [profile]);

    const handleSaveFavorite = () => {
        if (!user) {
            toast.info("Inicia sesión para poder guardar productos en tu canasta");
            return;
        }
        toast.success("Producto agregado a tu Canasta Base");
    };

    return (
        <div className="bg-bg min-h-screen">
            <header>
                <TopBar />
            </header>
            
            <main className="pb-24 lg:pb-10">
                <div className="mb-6 px-4 lg:px-10 mt-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Comparar Precios</h2>
                    <p className="text-muted text-sm">Encuentra dónde está más barato cada producto hoy en tu localidad.</p>
                </div>

                <div className="mb-6">
                    <FilterBar categories={["Todos", "Víveres", "Lácteos", "Carnes"]} />
                </div>

                <section className="flex flex-col gap-6 px-4 lg:px-10 lg:grid lg:grid-cols-2">
                    {isLoading ? (
                        <div className="w-full text-center py-10 text-primary font-bold">
                            Analizando precios en tu localidad...
                        </div>
                    ) : comparisons.length > 0 ? (
                        comparisons.map((item) => (
                            <div key={item.id} className="border-2 border-surface rounded-2xl p-5 shadow-sm bg-white">
                                <div className="flex justify-between items-start border-b border-surface pb-3 mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {item.product}
                                    </h3>
                                    <button 
                                        onClick={handleSaveFavorite} 
                                        className="text-muted hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                        title="Guardar en canasta"
                                    >
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                <ul className="flex flex-col gap-3">
                                    {item.markets.map((market, i) => (
                                        <li key={i} className="flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-700">{market.name}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-md w-max mt-1 ${market.color} font-bold`}>
                                                    {market.tag}
                                                </span>
                                            </div>
                                            <div className="text-xl font-bold text-primary">
                                                ${market.price.toFixed(2)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 lg:col-span-2">
                             <EmptyState 
                                title="No hay datos suficientes" 
                                description="Aún no se han reportado suficientes precios en tu localidad para hacer una comparación hoy."
                            />
                        </div>
                    )}
                </section>
            </main>
            
            <NavBar />
        </div>
    );
}
