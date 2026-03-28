import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { updateProfile } from "../services/api";

export default function EditProfile() {
    const navigate = useNavigate();
    const { profile, user } = useAuth();

    const [username, setUsername] = useState("");
    const [city, setCity] = useState("gye");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || "");
            setCity(profile.city || "gye");
        }
    }, [profile]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateProfile(user.id, { username, city });
            toast.success("¡Perfil actualizado con éxito!");
            // Nota: Para ver el cambio, AuthContext debería refrescar 'profile', algo opcional o forzado lanzando window.location.reload() 
            // Para el alcance acutal, navigate basta.
            navigate("/profile");
            window.location.reload(); // Forzar refresco para MVP
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fallBackAvatar = `https://ui-avatars.com/api/?name=${username || 'U'}&background=random`;

    return (
        <div className="bg-bg min-h-screen pb-24">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-surface px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 bg-surface/50 rounded-full text-gray-700 hover:text-primary transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Editar Perfil</h1>
                </div>
            </header>
            
            <main className="px-4 lg:px-10 max-w-2xl mx-auto mt-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <img src={profile?.avatar_url || fallBackAvatar} alt="avatar" className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white" />
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-md" onClick={() => toast.info('Sube la imagen modificándola en tu registro o usando gravatar.')}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSave}>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-700 ml-1">Usuario</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">@</span>
                            <input 
                                required
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-surface/30 border-2 border-surface p-3.5 pl-9 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-700 ml-1">Localidad</label>
                        <select 
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                        >
                            <option value="gye">Guayaquil</option>
                            <option value="uio">Quito</option>
                            <option value="cue">Cuenca</option>
                        </select>
                    </div>

                    <button 
                        disabled={isLoading}
                        type="submit" 
                        className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl mt-4 shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer disabled:opacity-70"
                    >
                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </form>
            </main>
            
            <NavBar />
        </div>
    );
}
