export default function NavBar() {
    return (
        <nav className="fixed bottom-3 left-2 right-2 z-30 rounded-2xl border border-surface/80 bg-white/80 shadow-lg backdrop-blur-md lg:hidden">
            <div className="px-2">
                <ul className="grid grid-cols-4">
                    <li>
                        <button
                            type="button"
                            aria-label="Inicio"
                            className="w-full flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 transition-colors text-muted hover:text-primary"
                        >
                            <svg
                                className="w-7 h-7"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19 9L19 17C19 18.8856 19 19.8284 18.4142 20.4142C17.8284 21 16.8856 21 15 21L14 21L10 21L9 21C7.11438 21 6.17157 21 5.58579 20.4142C5 19.8284 5 18.8856 5 17L5 9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 11L7.5 7L10.6713 4.18109C11.429 3.50752 12.571 3.50752 13.3287 4.18109L16.5 7L21 11"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M10 21V17C10 15.8954 10.8954 15 12 15V15C13.1046 15 14 15.8954 14 17V21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-xs font-semibold">
                                Inicio
                            </span>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            aria-label="Precios"
                            className="w-full flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 transition-colors text-muted hover:text-primary"
                        >
                            <svg
                                className="w-7 h-7"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16 10V17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 7V17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 13L8 17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-xs font-semibold">
                                Precios
                            </span>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            aria-label="Aportar"
                            className="w-full flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 transition-colors text-muted hover:text-primary"
                        >
                            <svg
                                className="w-7 h-7"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 8V16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 12H16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-xs font-semibold">
                                Aportar
                            </span>
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            aria-label="Perfil"
                            className="w-full flex flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 transition-colors text-muted hover:text-primary"
                        >
                            <svg
                                className="w-7 h-7"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="12"
                                    cy="8"
                                    r="4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-xs font-semibold">
                                Perfil
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
