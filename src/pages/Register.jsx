import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../services/supabaseClient";
import { optimizeImageForUpload } from "../utils/imageUpload";
import { normalizeCityCode } from "../utils/city";

export default function Register() {
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let avatarUrl = null;
            const normalizedCity = normalizeCityCode(city);

            if (avatarFile) {
                const optimizedAvatar = await optimizeImageForUpload(
                    avatarFile,
                    {
                        maxWidth: 1024,
                        maxHeight: 1024,
                        quality: 0.82,
                        outputType: "image/webp",
                    },
                );

                const fileExt = optimizedAvatar.name.split(".").pop();
                const safeUsername = username.replace(/[^a-zA-Z0-9_-]/g, "");
                const fileName = `${safeUsername || "avatar"}-${Date.now()}.${fileExt}`;
                const filePath = `public/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, optimizedAvatar, {
                        contentType: optimizedAvatar.type,
                        cacheControl: "3600",
                    });

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("avatars")
                    .getPublicUrl(filePath);
                avatarUrl = data.publicUrl;
            }

            await register(email, password, {
                username: username,
                city: normalizedCity,
                avatar_url: avatarUrl,
            });

            toast.success("¡Cuenta creada con éxito! Bienvenido.", {
                position: "top-center",
            });
            navigate("/welcome");
        } catch (error) {
            toast.error(error.message, { position: "top-center" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 pb-20 pt-10">
            <div className="w-full max-w-sm flex flex-col items-center">
                <h1 className="text-primary text-4xl font-bold mb-2">
                    Crear Cuenta
                </h1>
                <p className="text-muted text-center mb-10">
                    Únete a la comunidad local y reporta precios justos.
                </p>

                <form
                    className="w-full flex flex-col gap-4"
                    onSubmit={handleRegister}
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-gray-700 ml-1">
                            Usuario
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">
                                @
                            </span>
                            <input
                                required
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="tu_usuario"
                                className="w-full bg-surface/30 border-2 border-surface p-3.5 pl-9 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-gray-700 ml-1">
                            Localidad
                        </label>
                        <select
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                        >
                            <option value="" disabled>
                                Selecciona tu localidad
                            </option>
                            <option value="gye">Guayaquil</option>
                            <option value="uio">Quito</option>
                            <option value="cue">Cuenca</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-gray-700 ml-1">
                            Foto de Perfil{" "}
                            <span className="text-muted font-normal text-sm">
                                (Opcional)
                            </span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatarFile(e.target.files[0])}
                            className="w-full bg-surface/30 border-2 border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-gray-700 ml-1">
                            Correo Electrónico
                        </label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@correo.com"
                            className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 mb-2">
                        <label className="font-semibold text-gray-700 ml-1">
                            Contraseña
                        </label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-primary text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                    >
                        {isLoading ? "Creando cuenta..." : "Registrarse"}
                    </button>

                    <div className="relative flex items-center justify-center mt-4 mb-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t flex-1 border-surface/80"></div>
                        </div>
                        <div className="relative px-4 bg-bg text-sm text-muted">
                            o regístrate con
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-surface text-gray-700 font-bold text-lg py-3.5 rounded-xl hover:border-gray-300 transition-all active:scale-95"
                    >
                        <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Google
                    </button>

                    <p className="text-center text-muted text-sm mt-4">
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-primary hover:underline"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
