import { useNavigate } from "react-router-dom";

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="bg-bg min-h-dvh flex flex-col justify-between px-4 py-4 sm:p-6 sm:pb-8">
            <div className="flex justify-end pt-0 sm:pt-2">
                <button
                    onClick={() => navigate("/")}
                    className="text-muted font-bold tracking-wide text-sm hover:text-primary transition-colors cursor-pointer"
                >
                    Saltar
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center max-w-sm lg:max-w-md mx-auto gap-4 sm:gap-6 lg:gap-8 mt-1 mb-3 sm:my-6">
                <div className="w-44 sm:w-full sm:max-w-xs lg:max-w-md overflow-hidden rounded-4xl border-4 border-white bg-white p-2 shadow-lg shadow-surface/50">
                    <picture>
                        <source
                            media="(max-width: 639px)"
                            type="image/webp"
                            srcSet="/brand/hero-480.webp"
                        />
                        <source
                            type="image/webp"
                            srcSet="/brand/hero-240.webp 240w, /brand/hero-320.webp 320w, /brand/hero-480.webp 480w"
                            sizes="(min-width: 1024px) 448px, (min-width: 640px) 320px, 176px"
                        />
                        <img
                            src="/brand/hero-480.webp"
                            alt="Comparacion de precios en mercados"
                            className="h-40 w-full rounded-3xl bg-white object-contain sm:h-48 lg:h-64"
                            loading="eager"
                            decoding="async"
                        />
                    </picture>
                </div>

                <div className="flex flex-col gap-2 px-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 leading-tight">
                        Bienvenidos a{" "}
                        <span className="text-primary text-3xl sm:text-4xl lg:text-5xl">
                            El Dato
                        </span>
                    </h1>
                    <p className="text-muted text-base sm:text-lg lg:text-xl font-medium leading-relaxed">
                        La red ciudadana de Ecuador para ganarle a la
                        especulación en tu ciudad.
                    </p>
                </div>

                <ul className="text-left w-full flex flex-col gap-3 bg-white p-4 sm:p-6 rounded-2xl border-2 border-surface shadow-sm">
                    <li className="flex items-start gap-3 sm:gap-4">
                        <span className="text-xl sm:text-2xl mt-0.5">🔍</span>
                        <p className="text-gray-700 font-semibold text-sm leading-snug">
                            Busca los precios más baratos en tu barrio o mercado
                            favorito.
                        </p>
                    </li>
                    <li className="flex items-start gap-3 sm:gap-4">
                        <span className="text-xl sm:text-2xl mt-0.5">🤝</span>
                        <p className="text-gray-700 font-semibold text-sm leading-snug">
                            Aporta reportando los precios reales que tú
                            encuentras.
                        </p>
                    </li>
                    <li className="flex items-start gap-3 sm:gap-4">
                        <span className="text-xl sm:text-2xl mt-0.5">🏆</span>
                        <p className="text-gray-700 font-semibold text-sm leading-snug">
                            Gana medallas por ser el mejor vecino ahorrador.
                        </p>
                    </li>
                </ul>
            </div>

            <button
                onClick={() => navigate("/")}
                className="w-full max-w-sm mx-auto bg-primary text-white font-bold text-base sm:text-lg py-3 sm:py-4 rounded-xl shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
            >
                Empezar a Ahorrar
            </button>
        </div>
    );
}
