import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { toast } from "sonner";

const AuthContext = createContext();
const PROFILE_TIMEOUT_MS = 12000;
const AUTH_LOCK_RETRIES = 2;

const isAuthLockError = (error) => {
    const message = String(error?.message || error?.details || "")
        .toLowerCase()
        .trim();
    const name = String(error?.name || "")
        .toLowerCase()
        .trim();

    return (
        name.includes("navigatorlockacquiretimeouterror") ||
        (message.includes("lock") && message.includes("auth-token"))
    );
};

const sleep = (ms) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

const withTimeout = async (promise, timeoutMs, timeoutMessage) => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(timeoutMessage));
        }, timeoutMs);
    });

    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        clearTimeout(timeoutId);
    }
};

const withAuthRetry = async (operation, retries = AUTH_LOCK_RETRIES) => {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            if (!isAuthLockError(error) || attempt === retries) {
                throw error;
            }

            await sleep(220 * (attempt + 1));
        }
    }

    throw lastError;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        let latestProfileRequestId = 0;

        const loadProfile = async (currentUser) => {
            if (!currentUser) {
                if (isMounted) setProfile(null);
                return;
            }

            const requestId = latestProfileRequestId + 1;
            latestProfileRequestId = requestId;

            try {
                const { data, error } = await withAuthRetry(() =>
                    withTimeout(
                        supabase
                            .from("profiles")
                            .select("*")
                            .eq("id", currentUser.id)
                            .single(),
                        PROFILE_TIMEOUT_MS,
                        "Tiempo de espera agotado al verificar perfil.",
                    ),
                );

                if (!isMounted || requestId !== latestProfileRequestId) return;

                if (!error && data) {
                    setProfile(data);
                } else {
                    setProfile(null);
                }
            } catch (profileError) {
                console.error("Error cargando perfil de sesión:", profileError);

                if (!isMounted || requestId !== latestProfileRequestId) return;
                setProfile(null);
            }
        };

        const syncAuthFromSession = async (session) => {
            const currentUser = session?.user ?? null;

            if (isMounted) setUser(currentUser);

            await loadProfile(currentUser);
        };

        const initAuth = async () => {
            if (isMounted) setLoading(true);

            try {
                const {
                    data: { session },
                } = await withAuthRetry(() => supabase.auth.getSession());

                await syncAuthFromSession(session);
            } catch (error) {
                console.error("Error auto-login:", error);
                if (isMounted) {
                    setUser(null);
                    setProfile(null);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "INITIAL_SESSION") return;

            void (async () => {
                try {
                    await syncAuthFromSession(session);
                } catch (error) {
                    console.error("Error sincronizando sesión:", error);
                    if (isMounted) {
                        setUser(null);
                        setProfile(null);
                    }
                }

                if (isMounted) setLoading(false);
            })();
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
