import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { getProductById } from "../services/api";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();

    const [product, setProduct] = useState(null);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            setIsLoading(true);
            try {
                const userCity = profile?.city || 'gye';
                const { product, reports } = await getProductById(id, userCity);
                setProduct(product);
                setReports(reports);
            } catch (error) {
                console.error(error);
                toast.error("El producto no pudo ser cargado.");
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        };

        if (profile !== undefined) {
            loadProduct();
        }
    }, [id, profile, navigate]);

    const handleVote = () => {
        if (!user) {
            toast.info("Inicia sesión para poder validar precios", { position: "top-center" });
            return;
        }
        toast.success("Voto registrado con éxito", { position: "top-center" });
    };

    const handleSave = () => {
        if (!user) {
            toast.info("Inicia sesión para guardar productos", { position: "top-center" });
            return;
        }
        toast.success("Producto guardado en tu Canasta Base", { position: "top-center" });
    };

    // Cálculos
    const averagePrice = reports.length > 0
        ? reports.reduce((acc, curr) => acc + parseFloat(curr.price), 0) / reports.length
        : 0;

    const minPrice = reports.length > 0
        ? Math.min(...reports.map(r => parseFloat(r.price)))
        : 0;

    if (isLoading) {
        return (
            <div className="bg-bg min-h-screen pb-24 flex items-center justify-center">
                <span className="text-primary font-bold">Cargando detalles...</span>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="bg-bg min-h-screen pb-24">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-surface px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 bg-surface/50 rounded-full text-gray-700 hover:text-primary transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Detalles</h1>
                </div>
                <button onClick={handleSave} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors cursor-pointer mr-2 shadow-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </header>
            
            <main className="px-4 lg:px-10 lg:pb-10 max-w-2xl mx-auto mt-6">
                <div className="flex bg-white border-2 border-surface p-4 rounded-2xl shadow-sm items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-surface/50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl">🛒</span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                        {/* Se puede cargar la categoria dinamicamente luego, por ahora dejamos un fallback para el hackathon */}
                        <span className="text-muted font-semibold text-sm">Medida: {product.unit}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white border-2 border-surface p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                        <p className="text-muted text-sm font-semibold mb-1">Promedio Hoy</p>
                        <p className="text-2xl font-bold text-gray-800">${averagePrice.toFixed(2)}</p>
                    </div>
                    <div className="bg-greenb border-2 border-greent/20 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                        <p className="text-greent text-sm font-semibold mb-1">Más Barato</p>
                        <p className="text-2xl font-bold text-greent">${minPrice.toFixed(2)}</p>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Precios Reportados Hoy</h3>
                
                {reports.length > 0 ? (
                    <ul className="flex flex-col gap-3 bg-white border-2 border-surface p-5 rounded-2xl shadow-sm">
                        {reports.map((report, idx) => {
                            const isCheapest = parseFloat(report.price) === minPrice;
                            return (
                                <li key={report.id} className={`flex justify-between items-center group pt-2 pb-3 ${idx < reports.length - 1 ? 'border-b border-surface' : ''}`}>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-700">{report.markets.name}</span>
                                        {isCheapest ? (
                                            <span className="text-xs px-2 py-0.5 rounded-md w-max mt-1 text-greent bg-greenb font-semibold">
                                                Más barato
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-0.5 rounded-md w-max mt-1 text-muted bg-surface/50 font-semibold">
                                                Confirmado
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 mt-2">
                                        <span className={`text-xl font-bold ${isCheapest ? 'text-primary' : 'text-gray-800'}`}>
                                            ${parseFloat(report.price).toFixed(2)}
                                        </span>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button onClick={handleVote} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg border border-surface text-gray-700 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all cursor-pointer font-bold shadow-sm text-sm active:scale-95">
                                                <span className="text-lg">👍</span> Cierto
                                            </button>
                                            <button onClick={handleVote} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg border border-surface text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer font-bold shadow-sm text-sm active:scale-95">
                                                <span className="text-lg">👎</span> Falso
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="bg-white border-2 border-surface p-5 rounded-2xl shadow-sm text-center text-muted">
                        Nadie ha reportado precios para este producto en esta localidad hoy.
                    </div>
                )}
            </main>
            
            <NavBar />
        </div>
    );
}
