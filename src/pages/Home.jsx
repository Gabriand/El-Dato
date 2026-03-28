import { useState } from "react";
import FilterBar from "../components/FilterBar";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import TopBar from "../components/TopBar";
import EmptyState from "../components/EmptyState";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const productoStock = [
        {
            idProd: 1,
            urlImg: "https://www.gastronomiavasca.net/uploads/image/file/3900/arroz_basmati.jpg",
            nombreImg: "Arroz",
            disponible: "Regalado",
            nombreProd: "Arroz Conejo 2KG",
            lugar: "Mercado Sauces 9",
            precioActual: 1.85,
            precioAnterior: 2.15,
        },
        {
            idProd: 2,
            urlImg: "https://cdn.wikifarmer.com/images/thumbnail/2020/11/Beneficios-del-tomate-%E2%80%93-aportes-nutricionales-del-tomate-1200x630.jpg",
            nombreImg: "Tomate",
            disponible: "En algo",
            nombreProd: "Tomate Rinon 1KG",
            lugar: "Mercado Central",
            precioActual: 1.2,
            precioAnterior: 1.35,
        },
        {
            idProd: 3,
            urlImg: "https://upload.wikimedia.org/wikipedia/commons/3/34/Two_colors_of_onions.jpg",
            nombreImg: "Cebolla",
            disponible: "Carisimo",
            nombreProd: "Cebolla 1KG",
            lugar: "Mercado de Caraguay",
            precioActual: 1.75,
            precioAnterior: 1.5,
        },
        {
            idProd: 4,
            urlImg: "https://agrotendencia.tv/wp-content/uploads/2018/12/AgenciaUN_0909_1_40-1080x675.jpg",
            nombreImg: "Banano",
            disponible: "Regalado",
            nombreProd: "Banano 1KG",
            lugar: "Mercado de Florida",
            precioActual: 0.95,
            precioAnterior: 1.1,
        },
        {
            idProd: 5,
            urlImg: "https://ichef.bbci.co.uk/ace/ws/640/amz/worldservice/live/assets/images/2014/11/05/141105131956_leche_624x351_thinkstock.jpg.webp",
            nombreImg: "Leche",
            disponible: "En algo",
            nombreProd: "Leche Entera 1L",
            lugar: "Mercado Central",
            precioActual: 1.25,
            precioAnterior: 1.4,
        },
    ];

    const filteredProducts = productoStock.filter(producto => 
        producto.nombreProd.toLowerCase().includes(searchTerm.toLowerCase()) || 
        producto.lugar.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <header>
                <TopBar />
                <div className="m-5 lg:m-10 py-3 p-4 border-2 border-surface rounded-2xl flex gap-3 has-focus:border-primary has-focus:bg-tone">
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="¿Qué buscas ahorrar hoy?"
                        className="flex-1 outline-none bg-transparent"
                    />
                </div>
            </header>
            <main>
                <FilterBar categories={["Todos", "Pollo", "Arroz", "Huevos", "Cebolla", "Queso"]} />
                <section className="pb-10 lg:flex lg:flex-wrap">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((producto) => (
                            <ProductCard
                                key={producto.idProd}
                                urlImg={producto.urlImg}
                                nombreImg={producto.nombreImg}
                                disponible={producto.disponible}
                                nombreProd={producto.nombreProd}
                                lugar={producto.lugar}
                                precioActual={producto.precioActual}
                                precioAnterior={producto.precioAnterior}
                            />
                        ))
                    ) : (
                        <div className="w-full pt-10">
                            <EmptyState 
                                title="No encontramos ese producto" 
                                description={`Aún nadie ha reportado precios para "${searchTerm}" el día de hoy. ¡Anímate a ser el primero en aportarlo!`}
                            />
                        </div>
                    )}
                </section>
            </main>
            <NavBar />
        </>
    );
}
