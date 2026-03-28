export default function FilterBar({ categories }) {
    const list = categories || ["Todos", "Víveres", "Frutas", "Carnes", "Lácteos", "Aseo"];
    
    return (
        <div className="px-4 overflow-x-auto scrollbar-hide lg:px-10">
            <ul className="flex text-primary gap-3 min-w-max lg:text-lg">
                {list.map((cat, idx) => (
                    <li key={idx} className={`shrink-0 border-2 border-surface px-5 py-2 rounded-full cursor-pointer transition-colors ${idx === 0 ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}>
                        {cat}
                    </li>
                ))}
            </ul>
        </div>
    );
}
