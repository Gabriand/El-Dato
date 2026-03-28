import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
    const favoriteProducts = [
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
            idProd: 3,
            urlImg: "https://upload.wikimedia.org/wikipedia/commons/3/34/Two_colors_of_onions.jpg",
            nombreImg: "Cebolla",
            disponible: "Carisimo",
            nombreProd: "Cebolla 1KG",
            lugar: "Mercado de Caraguay",
            precioActual: 1.75,
            precioAnterior: 1.5,
        }
    ];

    return (
        <div className="bg-bg min-h-screen pb-24">
            <header>
                <TopBar />
                <div className="pt-6 px-6 lg:px-10">
                    <h1 className="text-3xl font-bold text-gray-800">Mi Canasta Base ⭐</h1>
                    <p className="text-muted mt-2">Los productos vitales que sigues para ahorrar todos los días.</p>
                </div>
            </header>
            <main>
                <section className="pb-10 pt-2 lg:flex lg:flex-wrap">
                    {favoriteProducts.map((producto) => (
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
                    ))}
                </section>
            </main>
            <NavBar />
        </div>
    );
}
