import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                const currentUser = session?.user ?? null;

                if (isMounted) setUser(currentUser);

                if (currentUser) {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", currentUser.id)
                        .single();

                    if (!error && data && isMounted) {
                        setProfile(data);
                    } else if (isMounted) {
                        setProfile(null);
                    }
                } else if (isMounted) {
                    setProfile(null);
                }
            } catch (error) {
                console.error("Error auto-login:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            if (isMounted) setUser(currentUser);

            if (currentUser) {
                try {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", currentUser.id)
                        .single();

                    if (!error && data && isMounted) setProfile(data);
                    else if (isMounted) setProfile(null);
                } catch {
                    if (isMounted) setProfile(null);
                }
            } else {
                if (isMounted) setProfile(null);
            }
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };

    const register = async (email, password, metaData) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metaData,
            },
        });
        if (error) throw error;
        return data;
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });
        if (error) throw error;
    };

    const refreshProfile = async () => {
        if (!user) {
            setProfile(null);
            return null;
        }

        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) throw error;
            setProfile(data);
            return data;
        } catch (error) {
            console.error("Error refrescando perfil:", error);
            return null;
        }
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) toast.error("Error al salir", { position: "top-center" });
        else toast.info("Sesión cerrada.", { position: "top-center" });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                login,
                register,
                loginWithGoogle,
                logout,
                loading,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
