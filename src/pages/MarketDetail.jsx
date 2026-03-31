import { useNavigate, useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { getMarketById } from "../services/api";
import { getCityLabel } from "../utils/city";

export default function MarketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [market, setMarket] = useState(null);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadMarket = async () => {
            setIsLoading(true);
            try {
                const { market, reports } = await getMarketById(id);
                setMarket(market);
                setReports(reports);
            } catch (error) {
                console.error(error);
                toast.error("El mercado no pudo ser cargado.");
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        };

        loadMarket();
    }, [id, navigate]);

    const handleVote = () => {
        if (!user) {
            toast.info("Inicia sesión para poder validar precios", {
                position: "top-center",
            });
            return;
        }
        toast.success("Voto registrado con éxito", { position: "top-center" });
    };

    if (isLoading) {
        return (
            <div className="bg-bg min-h-screen pb-24 flex items-center justify-center">
                <span className="text-primary font-bold">
                    Cargando mercado...
                </span>
            </div>
        );
    }

    if (!market) return null;

    return (
        <div className="bg-bg min-h-screen pb-24">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-surface px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-surface/50 rounded-full text-gray-700 hover:text-primary transition-colors cursor-pointer"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        ></path>
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800">
                    Detalle del Mercado
                </h1>
            </header>

            <main className="px-4 lg:px-10 lg:pb-10 max-w-2xl mx-auto mt-6">
                <div className="flex bg-white border-2 border-surface p-4 rounded-2xl shadow-sm items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                        <svg
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {market.name}
                        </h2>
                        <span className="text-muted font-semibold text-sm uppercase">
                            Localidad: {getCityLabel(market.city)}, Ecuador
                        </span>
                    </div>
                </div>

                <div className="bg-tone/50 border border-tone p-4 rounded-2xl shadow-sm flex items-center justify-between mb-8">
                    <span className="text-gray-700 font-bold">
                        {reports.length} reportes hoy
                    </span>
                    <span className="text-xs px-2 py-1 rounded-md text-greent bg-greenb font-semibold">
                        Abierto
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">
                    Últimos Aportes
                </h3>

                {reports.length > 0 ? (
                    <ul className="flex flex-col gap-3 bg-white border-2 border-surface p-5 rounded-2xl shadow-sm">
                        {reports.map((report, idx) => (
                            <li
                                key={report.id}
                                className={`flex justify-between items-center group pt-2 pb-3 ${idx < reports.length - 1 ? "border-b border-surface" : ""}`}
                            >
                                <div className="flex flex-col">
                                    <Link
                                        to={`/product/${report.products.id}`}
                                        className="font-semibold text-gray-700 hover:text-primary transition-colors cursor-pointer"
                                    >
                                        {report.products.name} (1{" "}
                                        {report.products.unit})
                                    </Link>
                                    <span className="text-xs text-muted mt-1 font-semibold">
                                        Reportado recientemente
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 mt-1">
                                    <span className="text-xl font-bold text-primary">
                                        ${parseFloat(report.price).toFixed(2)}
                                    </span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={handleVote}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg border border-surface text-gray-700 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all cursor-pointer font-bold shadow-sm text-sm active:scale-95"
                                        >
                                            <span className="text-lg">👍</span>{" "}
                                            Cierto
                                        </button>
                                        <button
                                            onClick={handleVote}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg border border-surface text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer font-bold shadow-sm text-sm active:scale-95"
                                        >
                                            <span className="text-lg">👎</span>{" "}
                                            Falso
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="bg-white border-2 border-surface p-5 rounded-2xl shadow-sm text-center text-muted">
                        Aún no hay reportes para este mercado.
                    </div>
                )}
            </main>

            <NavBar />
        </div>
    );
}
