export default function EmptyState({ title = "No hay resultados", description = "Intenta buscar con otras palabras." }) {
    return (
        <div className="flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
            <div className="text-6xl mb-4 grayscale opacity-40">🛒</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-muted max-w-sm mx-auto">{description}</p>
        </div>
    );
}
