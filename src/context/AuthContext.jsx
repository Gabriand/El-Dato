import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Consultar sesión existente
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Escuchar cambios de sesión
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                // Sacar los datos extra (nombre, ciudad) de la tabla profiles
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();
                setProfile(data);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const register = async (email, password, metaData) => {
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: metaData
            }
        });
        if (error) throw error;
        return data;
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) throw error;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) toast.error("Error al salir", { position: "top-center" });
        else toast.info("Sesión cerrada.", { position: "top-center" });
    };

    return (
        <AuthContext.Provider value={{ user, profile, login, register, loginWithGoogle, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
