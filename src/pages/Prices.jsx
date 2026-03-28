import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import FilterBar from "../components/FilterBar";

export default function Prices() {

    const comparisons = [
        {
            id: 1,
            product: "Arroz Conejo 2KG",
            markets: [
                { name: "Mercado Sauces 9", price: 1.85, tag: "Más barato", color: "text-greent bg-greenb" },
                { name: "Mercado Central", price: 2.15, tag: "Promedio", color: "text-muted bg-surface/50" },
                { name: "Mercado Caraguay", price: 2.30, tag: "Caro", color: "text-redt bg-redb" }
            ]
        },
        {
            id: 2,
            product: "Tomate Riñón 1KG",
            markets: [
                { name: "Mercado Central", price: 1.20, tag: "Más barato", color: "text-greent bg-greenb" },
                { name: "Mercado Florida", price: 1.35, tag: "Promedio", color: "text-muted bg-surface/50" }
            ]
        }
    ];

    return (
        <>
            <header>
                <TopBar />
            </header>
            
            <main className="pb-24 lg:pb-10">
                <div className="mb-6 px-4 lg:px-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Comparar Precios</h2>
                    <p className="text-muted text-sm">Encuentra dónde está más barato cada producto hoy.</p>
                </div>

                <div className="mb-6">
                    <FilterBar categories={["Todos", "Víveres", "Lácteos", "Carnes", "Frutas", "Aseo"]} />
                </div>

                <section className="flex flex-col gap-6 px-4 lg:px-10 lg:grid lg:grid-cols-2">
                    {comparisons.map((item) => (
                        <div key={item.id} className="border-2 border-surface rounded-2xl p-5 shadow-sm bg-white">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-surface pb-2">
                                {item.product}
                            </h3>
                            
                            <ul className="flex flex-col gap-3">
                                {item.markets.map((market, i) => (
                                    <li key={i} className="flex justify-between items-center group">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-700">{market.name}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-md w-max mt-1 ${market.color}`}>
                                                {market.tag}
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-primary">
                                            ${market.price.toFixed(2)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            </main>
            
            <NavBar />
        </>
    );
}
