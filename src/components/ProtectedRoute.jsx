import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        // Redirigir al inicio de sesión si intenta entrar a una vista bloqueada
        toast.error("Para poder acceder aquí debes iniciar sesión primero.", {
            position: "top-center"
        });
        return <Navigate to="/login" replace />;
    }

    // Si tiene sesión activa, lo dejamos pasar a su destino original
    return children;
}
