export default function Home() {
    return (
        <main>
            <div className="m-5 lg:m-10 py-2 p-4 border-2 border-surface rounded-2xl flex gap-3 has-focus:border-primary has-focus:bg-tone">
                <svg
                    className="text-primary"
                    width="22px"
                    height="22px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <input
                    type="search"
                    name="busqueda"
                    id="busqueda"
                    placeholder="¿Qué buscas ahorrar hoy?"
                    className="flex-1 outline-none"
                />
            </div>
            <div className="px-4 overflow-x-auto">
                <ul className="flex text-primary gap-3 min-w-max lg:text-lg">
                    <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary">
                        Todos
                    </li>
                    <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary">
                        Víveres
                    </li>
                    <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary">
                        Frutas
                    </li>
                    <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary">
                        Carnes
                    </li>
                    <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary">
                        Lacteos
                    </li>
                    <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary">
                        Aseo
                    </li>
                </ul>
            </div>
        </main>
    );
}
