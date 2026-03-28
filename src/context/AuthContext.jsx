import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Por defecto null (usuario no logeado) para testear el "Bloqueo" visual
    const [user, setUser] = useState(null);

    // Funciones mock para poder testear la UI antes de Supabase
    const login = () => setUser({ name: "Guayaco", role: "user" });
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto más fácil en cualquier componente
export function useAuth() {
    return useContext(AuthContext);
}
