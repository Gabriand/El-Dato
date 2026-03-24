export default function Home() {
    return (
        <main>
            <div className="mx-4 overflow-x-auto">
                <ul className="flex text-primary gap-3 min-w-max sm:text-base lg:text-lg">
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
