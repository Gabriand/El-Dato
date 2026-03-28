import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const notifiedRef = useRef(false);

    useEffect(() => {
        if (!loading && !user && !notifiedRef.current) {
            notifiedRef.current = true;
            toast.error(
                "Para poder acceder aquí debes iniciar sesión primero.",
                {
                    position: "top-center",
                },
            );
        }
    }, [loading, user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg">
                <span className="text-primary font-bold">
                    Verificando sesión...
                </span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Si tiene sesión activa, lo dejamos pasar a su destino original
    return children;
}
