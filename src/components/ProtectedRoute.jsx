import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            toast.error("Para poder acceder aquí debes iniciar sesión primero.", {
                position: "top-center"
            });
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Si tiene sesión activa, lo dejamos pasar a su destino original
    return children;
}
