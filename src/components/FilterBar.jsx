export default function FilterBar() {
    return (
        <div className="px-4 overflow-x-auto scrollbar-hide lg:px-10">
            <ul className="flex text-primary gap-3 min-w-max lg:text-lg">
                <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary cursor-pointer">
                    Todos
                </li>
                <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary cursor-pointer">
                    Víveres
                </li>
                <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary cursor-pointer">
                    Frutas
                </li>
                <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary cursor-pointer">
                    Carnes
                </li>
                <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary cursor-pointer">
                    Lacteos
                </li>
                <li className="shrink-0 border-2 border-surface px-5 py-2 rounded-full hover:text-bg hover:bg-primary cursor-pointer">
                    Aseo
                </li>
            </ul>
        </div>
    );
}
