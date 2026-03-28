export default function FilterBar({ categories, activeCategory, onSelect }) {
    const list = categories || [
        "Todos",
        "Víveres",
        "Frutas",
        "Carnes",
        "Lácteos",
        "Aseo",
    ];

    return (
        <div className="px-4 overflow-x-auto scrollbar-hide lg:px-10">
            <ul className="flex text-primary gap-3 min-w-max lg:text-lg pb-1">
                {list.map((cat, idx) => {
                    const isActive =
                        activeCategory === cat ||
                        (!activeCategory && idx === 0);
                    return (
                        <li key={idx}>
                            <button
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => onSelect && onSelect(cat)}
                                className={`shrink-0 border-2 border-surface px-5 py-2 rounded-full cursor-pointer transition-colors whitespace-nowrap ${isActive ? "bg-primary text-white" : "hover:bg-primary/10"}`}
                            >
                                {cat}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
