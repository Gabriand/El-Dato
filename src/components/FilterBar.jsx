export default function FilterBar() {
    return (
        <section className="p-4">
            <label htmlFor="category" className="mb-2 block text-sm font-medium">
                Categoria
            </label>
            <select id="category" className="w-full rounded border px-3 py-2 text-sm">
                <option>Todas</option>
            </select>
        </section>
    );
}
