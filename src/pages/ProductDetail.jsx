import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
    addFavorite,
    getFavoriteProductIds,
    getProductById,
    getVoteSummaryByReportIds,
    registerVote,
    removeFavorite,
} from "../services/api";
import { normalizeCityCode } from "../utils/city";

const GUEST_CITY_STORAGE_KEY = "el-dato-guest-city";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();

    const [product, setProduct] = useState(null);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [voteStatsByReport, setVoteStatsByReport] = useState({});

    const cityFromProfile = profile?.city
        ? normalizeCityCode(profile.city)
        : null;
    const cityFromGuestStorage =
        typeof window === "undefined"
            ? normalizeCityCode()
            : normalizeCityCode(
                  window.localStorage.getItem(GUEST_CITY_STORAGE_KEY),
              );
    const userCity = cityFromProfile || cityFromGuestStorage;

    useEffect(() => {
        const loadProduct = async () => {
            setIsLoading(true);
            try {
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
    }, [id, navigate, profile, userCity]);

    useEffect(() => {
        const loadFavoriteStatus = async () => {
            if (!user || !id) {
                setIsFavorite(false);
                return;
            }

            try {
                const favoriteIds = await getFavoriteProductIds(user.id);
                setIsFavorite(favoriteIds.includes(Number(id)));
            } catch (error) {
                console.error("Error consultando favorito:", error);
            }
        };

        loadFavoriteStatus();
    }, [user, id]);

    useEffect(() => {
        let isMounted = true;

        const loadVoteSummary = async () => {
            if (!reports.length) {
                setVoteStatsByReport({});
                return;
            }

            try {
                const summary = await getVoteSummaryByReportIds(
                    reports.map((report) => report.id),
                );
                if (isMounted) {
                    setVoteStatsByReport(summary);
                }
            } catch (error) {
                console.error("Error cargando votos:", error);
                if (isMounted) {
                    setVoteStatsByReport({});
                }
            }
        };

        loadVoteSummary();

        return () => {
            isMounted = false;
        };
    }, [reports]);

    const handleVote = async (reportId, voteType) => {
        if (!user) {
            toast.info("Inicia sesión para poder validar precios", {
                position: "top-center",
            });
            return;
        }

        const isUpvote = voteType === "true";

        try {
            const result = await registerVote(reportId, user.id, isUpvote);

            setVoteStatsByReport((prev) => {
                const currentStats = prev[reportId] || {
                    trueVotes: 0,
                    falseVotes: 0,
                };

                let nextTrueVotes = currentStats.trueVotes;
                let nextFalseVotes = currentStats.falseVotes;

                if (result.previousVote === null) {
                    if (isUpvote) {
                        nextTrueVotes += 1;
                    } else {
                        nextFalseVotes += 1;
                    }
                } else if (result.previousVote !== isUpvote) {
                    if (isUpvote) {
                        nextTrueVotes += 1;
                        nextFalseVotes = Math.max(0, nextFalseVotes - 1);
                    } else {
                        nextFalseVotes += 1;
                        nextTrueVotes = Math.max(0, nextTrueVotes - 1);
                    }
                }

                return {
                    ...prev,
                    [reportId]: {
                        trueVotes: nextTrueVotes,
                        falseVotes: nextFalseVotes,
                    },
                };
            });

            if (!result.changed) {
                toast.info("Ya habías votado esta opción", {
                    position: "top-center",
                });
                return;
            }

            toast.success("Voto registrado con éxito", {
                position: "top-center",
            });
        } catch (error) {
            console.error("Error registrando voto:", error);
            const isRlsError =
                error?.code === "42501" ||
                String(error?.message || "")
                    .toLowerCase()
                    .includes("row-level security");

            toast.error("No se pudo registrar tu voto", {
                position: "top-center",
            });

            if (isRlsError) {
                toast.info("Faltan politicas RLS para la tabla votes", {
                    position: "top-center",
                });
            }
        }
    };

    const getVotePercentages = (reportId) => {
        const stats = voteStatsByReport[reportId] || {
            trueVotes: 0,
            falseVotes: 0,
        };
        const totalVotes = stats.trueVotes + stats.falseVotes;

        if (totalVotes === 0) {
            return { truePercent: 0, falsePercent: 0 };
        }

        const truePercent = Math.round((stats.trueVotes / totalVotes) * 100);
        return {
            truePercent,
            falsePercent: 100 - truePercent,
        };
    };

    const handleSave = async () => {
        if (!user) {
            toast.info("Inicia sesión para guardar productos", {
                position: "top-center",
            });
            return;
        }

        try {
            if (isFavorite) {
                await removeFavorite(user.id, id);
                setIsFavorite(false);
                toast.info("Producto eliminado de tu Canasta Base", {
                    position: "top-center",
                });
                return;
            }

            await addFavorite(user.id, id);
            setIsFavorite(true);
            toast.success("Producto guardado en tu Canasta Base", {
                position: "top-center",
            });
        } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar tu canasta.", {
                position: "top-center",
            });
        }
    };

    const averagePrice =
        reports.length > 0
            ? reports.reduce((acc, curr) => acc + parseFloat(curr.price), 0) /
              reports.length
            : 0;

    const minPrice =
        reports.length > 0
            ? Math.min(...reports.map((r) => parseFloat(r.price)))
            : 0;

    if (isLoading) {
        return (
            <div className="bg-bg min-h-screen pb-24 flex items-center justify-center">
                <span className="text-primary font-bold">
                    Cargando detalles...
                </span>
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
                        Detalles
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    className={`p-2.5 rounded-full transition-colors cursor-pointer mr-2 shadow-sm ${isFavorite ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-muted bg-surface/60 hover:bg-surface"}`}
                >
                    <svg
                        className="w-6 h-6"
                        fill={isFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
            </header>

            <main className="px-4 lg:px-10 lg:pb-10 max-w-2xl mx-auto mt-6">
                <div className="flex bg-white border-2 border-surface p-4 rounded-2xl shadow-sm items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-surface/50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl">🛒</span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {product.name}
                        </h2>
                        <span className="text-muted font-semibold text-sm">
                            Medida: {product.unit}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white border-2 border-surface p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                        <p className="text-muted text-sm font-semibold mb-1">
                            Promedio Hoy
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                            ${averagePrice.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-greenb border-2 border-greent/20 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                        <p className="text-greent text-sm font-semibold mb-1">
                            Más Barato
                        </p>
                        <p className="text-2xl font-bold text-greent">
                            ${minPrice.toFixed(2)}
                        </p>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">
                    Precios Reportados Hoy
                </h3>

                {reports.length > 0 ? (
                    <ul className="flex flex-col gap-3 bg-white border-2 border-surface p-5 rounded-2xl shadow-sm">
                        {reports.map((report, idx) => {
                            const isCheapest =
                                parseFloat(report.price) === minPrice;
                            const { truePercent, falsePercent } =
                                getVotePercentages(report.id);

                            return (
                                <li
                                    key={report.id}
                                    className={`group flex flex-col gap-3 pt-2 pb-3 sm:flex-row sm:items-center sm:justify-between md:flex-col md:items-stretch md:justify-start lg:flex-row lg:flex-wrap lg:justify-center ${idx < reports.length - 1 ? "border-b border-surface" : ""}`}
                                >
                                    <div className="flex md:w-full lg:w-full">
                                        <div className="flex w-full flex-col lg:w-full">
                                            <span className="font-semibold text-gray-700">
                                                {report.markets.name}
                                            </span>
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
                                        <div className="mt-1 flex w-full flex-col gap-1.5 sm:mt-2 sm:w-auto sm:items-end md:w-full md:items-end lg:w-auto">
                                            <span
                                                className={`self-end text-xl font-bold ${isCheapest ? "text-primary" : "text-gray-800"}`}
                                            >
                                                $
                                                {parseFloat(
                                                    report.price,
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-1 grid w-full grid-cols-2 gap-2 sm:mt-2 sm:flex sm:w-auto sm:items-center md:grid md:w-full md:grid-cols-2 md:items-center lg:flex lg:w-auto">
                                        <button
                                            onClick={() =>
                                                handleVote(report.id, "true")
                                            }
                                            className="flex min-w-0 w-full items-center justify-center gap-1 rounded-xl border border-surface bg-bg px-2 py-2 text-xs font-bold text-gray-700 shadow-sm transition-all active:scale-95 hover:border-green-300 hover:bg-green-50 hover:text-green-700 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-sm md:w-full lg:w-auto"
                                        >
                                            <span className="text-base sm:text-lg">
                                                👍
                                            </span>
                                            <span className="truncate">
                                                Cierto
                                            </span>
                                            <span className="rounded-md bg-greenb px-1.5 py-0.5 text-xs font-extrabold text-greent">
                                                {truePercent}%
                                            </span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleVote(report.id, "false")
                                            }
                                            className="flex min-w-0 w-full items-center justify-center gap-1 rounded-xl border border-surface bg-bg px-2 py-2 text-xs font-bold text-gray-700 shadow-sm transition-all active:scale-95 hover:border-red-300 hover:bg-red-50 hover:text-red-700 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-sm md:w-full lg:w-auto"
                                        >
                                            <span className="text-base sm:text-lg">
                                                👎
                                            </span>
                                            <span className="truncate">
                                                Falso
                                            </span>
                                            <span className="rounded-md bg-redb px-1.5 py-0.5 text-xs font-extrabold text-redt">
                                                {falsePercent}%
                                            </span>
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="bg-white border-2 border-surface p-5 rounded-2xl shadow-sm text-center text-muted">
                        Nadie ha reportado precios para este producto en esta
                        localidad hoy.
                    </div>
                )}
            </main>

            <NavBar />
        </div>
    );
}
