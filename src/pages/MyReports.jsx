import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteReportById, getReportsByUser } from "../services/api";
import EmptyState from "../components/EmptyState";

const formatRelativeDate = (value) => {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "Sin fecha";

    const diffMinutes = Math.max(
        0,
        Math.round((Date.now() - parsedDate.getTime()) / 60000),
    );

    if (diffMinutes < 1) return "Hace instantes";
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;

    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return new Intl.DateTimeFormat("es-EC", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(parsedDate);
};

export default function MyReports() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const loadReports = async () => {
            if (!user) {
                setReports([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await getReportsByUser(user.id);
                setReports(data || []);
            } catch (error) {
                console.error("Error cargando aportes:", error);
                toast.error("No se pudo cargar tu historial de aportes.");
            } finally {
                setIsLoading(false);
            }
        };

        loadReports();
    }, [user]);

    const handleDelete = async (reportId) => {
        if (!user) return;

        setDeletingId(reportId);
        try {
            await deleteReportById(reportId, user.id);
            setReports((prev) => prev.filter((item) => item.id !== reportId));
            toast.info("Aporte eliminado permanentemente");
        } catch (error) {
            console.error("Error eliminando aporte:", error);
            toast.error("No se pudo eliminar el aporte.");
        } finally {
            setDeletingId(null);
        }
    };

    const totalReports = useMemo(() => reports.length, [reports]);

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
                <h1 className="text-xl font-bold text-gray-800">Mis Aportes</h1>
            </header>

            <main className="px-4 lg:px-10 max-w-2xl mx-auto mt-6">
                <p className="text-muted mb-6">
                    Aquí tienes el historial de precios que has ayudado a
                    recolectar. Total: {totalReports} aporte
                    {totalReports === 1 ? "" : "s"}.
                </p>

                {isLoading ? (
                    <div className="w-full text-center py-10 text-primary font-bold">
                        Cargando tus aportes...
                    </div>
                ) : reports.length > 0 ? (
                    <ul className="flex flex-col gap-4">
                        {reports.map((report) => {
                            const productName =
                                report.products?.name || "Producto";
                            const productUnit =
                                report.products?.unit || "unidad";
                            const marketName =
                                report.markets?.name || "Mercado";
                            const parsedPrice = Number(report.price);
                            const dateLabel = formatRelativeDate(
                                report.reported_at || report.created_at,
                            );

                            return (
                                <li
                                    key={report.id}
                                    className="bg-white border-2 border-surface p-4 rounded-2xl flex justify-between items-center shadow-sm"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 text-lg">
                                            {productName}
                                        </span>
                                        <span className="text-sm text-muted">
                                            {dateLabel}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-600 mt-0.5">
                                            📍 {marketName}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-primary block">
                                                {Number.isFinite(parsedPrice)
                                                    ? `$${parsedPrice.toFixed(2)}`
                                                    : "--"}
                                            </span>
                                            <span className="text-xs text-muted font-bold bg-surface/50 px-2 py-0.5 rounded-md uppercase">
                                                {productUnit}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleDelete(report.id)
                                            }
                                            disabled={deletingId === report.id}
                                            className="p-1.5 px-3 flex items-center gap-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer font-semibold text-sm disabled:opacity-60"
                                        >
                                            {deletingId === report.id
                                                ? "Eliminando..."
                                                : "🗑️ Eliminar"}
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <EmptyState
                        title="No tienes aportes todavía"
                        description="Cuando reportes tu primer precio, aparecerá aquí automáticamente."
                    />
                )}
            </main>
            <NavBar />
        </div>
    );
}
