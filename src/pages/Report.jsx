import { useState, useEffect, useMemo } from "react";
import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { toast } from "sonner";
import {
    createMarket,
    createProduct,
    getCategories,
    getProducts,
    getMarkets,
    submitReport,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { normalizeCityCode } from "../utils/city";
import { optimizeImageForUpload } from "../utils/imageUpload";
import { supabase } from "../services/supabaseClient";

const normalizeText = (value) =>
    String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const sortByName = (a, b) =>
    String(a?.name || "").localeCompare(String(b?.name || ""), "es", {
        sensitivity: "base",
    });

export default function Report() {
    const { profile, user } = useAuth();
    const userCity = normalizeCityCode(profile?.city);

    const [products, setProducts] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedMarket, setSelectedMarket] = useState("");
    const [price, setPrice] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [marketSearch, setMarketSearch] = useState("");
    const [showProductSuggestions, setShowProductSuggestions] = useState(false);
    const [showMarketSuggestions, setShowMarketSuggestions] = useState(false);

    const [showCreateProduct, setShowCreateProduct] = useState(false);
    const [showCreateMarket, setShowCreateMarket] = useState(false);

    const [newProductName, setNewProductName] = useState("");
    const [newProductUnit, setNewProductUnit] = useState("");
    const [newProductCategoryId, setNewProductCategoryId] = useState("");
    const [newProductImage, setNewProductImage] = useState(null);
    const [isSavingProduct, setIsSavingProduct] = useState(false);

    const [newMarketName, setNewMarketName] = useState("");
    const [newMarketLocation, setNewMarketLocation] = useState("");
    const [isSavingMarket, setIsSavingMarket] = useState(false);

    const filteredProducts = useMemo(() => {
        const term = normalizeText(productSearch);
        if (!term) return products;

        return products.filter((prod) => {
            const name = normalizeText(prod.name);
            const unit = normalizeText(prod.unit);
            return name.includes(term) || unit.includes(term);
        });
    }, [products, productSearch]);

    const filteredMarkets = useMemo(() => {
        const term = normalizeText(marketSearch);
        if (!term) return markets;

        return markets.filter((mkt) => {
            const name = normalizeText(mkt.name);
            const location = normalizeText(mkt.location);
            return name.includes(term) || location.includes(term);
        });
    }, [markets, marketSearch]);

    const productSuggestions = useMemo(() => {
        const term = normalizeText(productSearch);
        if (!term) return [];
        return filteredProducts.slice(0, 6);
    }, [filteredProducts, productSearch]);

    const marketSuggestions = useMemo(() => {
        const term = normalizeText(marketSearch);
        if (!term) return [];
        return filteredMarkets.slice(0, 6);
    }, [filteredMarkets, marketSearch]);

    const productById = useMemo(
        () => new Map(products.map((product) => [String(product.id), product])),
        [products],
    );

    const marketById = useMemo(
        () => new Map(markets.map((market) => [String(market.id), market])),
        [markets],
    );

    useEffect(() => {
        const loadFormData = async () => {
            setIsLoadingData(true);
            try {
                const [productsData, marketsData, categoriesData] =
                    await Promise.all([
                        getProducts(),
                        getMarkets(userCity),
                        getCategories(),
                    ]);
                setProducts(productsData || []);
                setMarkets(marketsData || []);
                setCategories(categoriesData || []);
            } catch (error) {
                console.error("Error cargando base de datos:", error);
                toast.error("Error al cargar los productos.");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (profile !== undefined) {
            loadFormData();
        }
    }, [profile, userCity]);

    useEffect(() => {
        if (!newProductCategoryId && categories.length > 0) {
            setNewProductCategoryId(String(categories[0].id));
        }
    }, [categories, newProductCategoryId]);

    const handlePickProductSuggestion = (product) => {
        setSelectedProduct(String(product.id));
        setProductSearch(product.name);
        setShowProductSuggestions(false);
    };

    const handlePickMarketSuggestion = (market) => {
        setSelectedMarket(String(market.id));
        setMarketSearch(market.name);
        setShowMarketSuggestions(false);
    };

    const handleCreateProduct = async () => {
        const normalizedName = newProductName.trim();
        if (!normalizedName) {
            toast.error("Escribe el nombre del producto.");
            return;
        }

        if (!newProductCategoryId) {
            toast.error("Selecciona una categoría.");
            return;
        }

        setIsSavingProduct(true);
        try {
            let imageUrl = null;

            if (newProductImage) {
                const optimizedFile = await optimizeImageForUpload(
                    newProductImage,
                    {
                        maxWidth: 1200,
                        maxHeight: 1200,
                        quality: 0.82,
                        outputType: "image/webp",
                    },
                );

                const fileExt = optimizedFile.name.split(".").pop();
                const safeName = normalizedName.replace(/[^a-zA-Z0-9_-]/g, "");
                const fileName = `${safeName || "producto"}-${Date.now()}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, optimizedFile, {
                        contentType: optimizedFile.type,
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("avatars")
                    .getPublicUrl(filePath);
                imageUrl = data.publicUrl;
            }

            const createdProduct = await createProduct({
                name: normalizedName,
                unit: newProductUnit.trim() || "unidad",
                categoryId: Number(newProductCategoryId),
                imageUrl,
            });

            setProducts((prev) => [...prev, createdProduct].sort(sortByName));
            setSelectedProduct(String(createdProduct.id));
            setProductSearch(createdProduct.name);

            setShowCreateProduct(false);
            setNewProductName("");
            setNewProductUnit("unidad");
            setNewProductImage(null);

            toast.success("Producto creado y seleccionado.");
        } catch (error) {
            console.error("Error creando producto:", error);
            toast.error(error.message || "No se pudo crear el producto.");
        } finally {
            setIsSavingProduct(false);
        }
    };

    const handleCreateMarket = async () => {
        const normalizedName = newMarketName.trim();
        if (!normalizedName) {
            toast.error("Escribe el nombre del mercado.");
            return;
        }

        setIsSavingMarket(true);
        try {
            const createdMarket = await createMarket({
                name: normalizedName,
                location: newMarketLocation,
                city: userCity,
            });

            setMarkets((prev) => [...prev, createdMarket].sort(sortByName));
            setSelectedMarket(String(createdMarket.id));
            setMarketSearch(createdMarket.name);

            setShowCreateMarket(false);
            setNewMarketName("");
            setNewMarketLocation("");

            toast.success("Lugar creado y seleccionado.");
        } catch (error) {
            console.error("Error creando mercado:", error);
            toast.error(error.message || "No se pudo crear el lugar.");
        } finally {
            setIsSavingMarket(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProduct || !selectedMarket) {
            return toast.error("Selecciona un producto y un mercado.");
        }

        const parsedPrice = Number(price);
        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            return toast.error("Ingresa un precio válido mayor a 0.");
        }

        setIsSubmitting(true);
        try {
            await submitReport({
                product_id: parseInt(selectedProduct),
                market_id: parseInt(selectedMarket),
                user_id: user.id,
                price: parsedPrice,
            });

            toast.success("¡Mil gracias! Has ayudado a tu comunidad 🏆");

            setSelectedProduct("");
            setProductSearch("");
            setPrice("");
        } catch (error) {
            console.error(error);
            toast.error(
                "Ocurrió un error al subir el precio. Inténtalo de nuevo.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-bg min-h-screen">
            <header>
                <TopBar />
            </header>

            <main
                className="px-4 pb-24 lg:px-10 lg:pb-10 max-w-2xl mx-auto"
                aria-busy={isLoadingData}
            >
                <div className="mb-8 text-center mt-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Pasar el Dato
                    </h2>
                    <p className="text-muted text-sm px-2">
                        Ayuda a tus vecinos reportando el precio real que acabas
                        de ver en tu localidad.
                    </p>
                </div>

                {isLoadingData ? (
                    <div
                        className="flex justify-center text-primary font-bold py-10"
                        role="status"
                        aria-live="polite"
                    >
                        Cargando catálogo...
                    </div>
                ) : (
                    <form
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="productSearch"
                                className="font-semibold text-gray-700"
                            >
                                Buscar producto
                            </label>
                            <div className="relative">
                                <input
                                    id="productSearch"
                                    type="search"
                                    value={productSearch}
                                    onChange={(e) => {
                                        setProductSearch(e.target.value);
                                        setSelectedProduct("");
                                        setShowProductSuggestions(true);
                                    }}
                                    onFocus={() =>
                                        setShowProductSuggestions(true)
                                    }
                                    onBlur={() => {
                                        window.setTimeout(
                                            () =>
                                                setShowProductSuggestions(
                                                    false,
                                                ),
                                            120,
                                        );
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            setShowProductSuggestions(false);
                                        }
                                    }}
                                    placeholder="Ej: arroz, tomate, queso"
                                    className="w-full bg-surface/20 border border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                                />
                                {showProductSuggestions &&
                                    productSuggestions.length > 0 && (
                                        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-surface bg-white shadow-lg">
                                            {productSuggestions.map(
                                                (product) => (
                                                    <li key={product.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handlePickProductSuggestion(
                                                                    product,
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 text-left hover:bg-tone transition-colors"
                                                        >
                                                            <span className="font-semibold text-gray-800">
                                                                {product.name}
                                                            </span>
                                                            <span className="text-xs text-muted ml-1">
                                                                ({product.unit})
                                                            </span>
                                                        </button>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                            </div>

                            <label
                                htmlFor="product"
                                className="font-semibold text-gray-700"
                            >
                                ¿Qué producto viste?
                            </label>
                            <select
                                id="product"
                                required
                                value={selectedProduct}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setSelectedProduct(selectedId);
                                    setShowProductSuggestions(false);

                                    const product = productById.get(selectedId);
                                    if (product) {
                                        setProductSearch(product.name);
                                    }
                                }}
                                className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            >
                                {filteredProducts.length === 0 ? (
                                    <option value="" disabled>
                                        No hay productos para ese filtro
                                    </option>
                                ) : (
                                    <>
                                        <option value="" disabled>
                                            Selecciona un producto...
                                        </option>
                                        {filteredProducts.map((prod) => (
                                            <option
                                                key={prod.id}
                                                value={String(prod.id)}
                                            >
                                                {prod.name} ({prod.unit})
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            <p
                                className="text-xs text-muted"
                                aria-live="polite"
                            >
                                {filteredProducts.length} de {products.length}{" "}
                                productos visibles
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCreateProduct((current) => !current)
                                }
                                className="text-left mt-0.5 text-primary text-sm font-semibold hover:underline w-max transition-colors"
                            >
                                + Agregar nuevo producto
                            </button>

                            {showCreateProduct && (
                                <div className="mt-2 rounded-xl border border-surface bg-white/70 p-4 flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={newProductName}
                                        onChange={(e) =>
                                            setNewProductName(e.target.value)
                                        }
                                        placeholder="Nombre del producto"
                                        className="w-full bg-surface/20 border border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                                    />
                                    <input
                                        type="text"
                                        value={newProductUnit}
                                        onChange={(e) =>
                                            setNewProductUnit(e.target.value)
                                        }
                                        placeholder="Unidad (kg, lb, litro, unidad...)"
                                        className="w-full bg-surface/20 border border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                                    />
                                    <select
                                        value={newProductCategoryId}
                                        onChange={(e) =>
                                            setNewProductCategoryId(
                                                e.target.value,
                                            )
                                        }
                                        className="w-full bg-surface/20 border border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-muted">
                                        Categorias disponibles:{" "}
                                        {categories.length}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="newProductImage"
                                            className="font-semibold text-gray-700 text-sm"
                                        >
                                            Imagen del producto
                                        </label>
                                        <label
                                            htmlFor="newProductImage"
                                            className="w-full bg-surface/20 border border-surface p-3 rounded-xl cursor-pointer text-gray-800 hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-center"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="h-7 w-7 text-primary"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M12 16V4m0 0-4 4m4-4 4 4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M5 14v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>
                                                {newProductImage
                                                    ? `Imagen seleccionada: ${newProductImage.name}`
                                                    : "Subir imagen del producto"}
                                            </span>
                                        </label>
                                        <input
                                            id="newProductImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setNewProductImage(
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleCreateProduct}
                                            disabled={isSavingProduct}
                                            className="bg-primary text-white font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-70"
                                        >
                                            {isSavingProduct
                                                ? "Guardando..."
                                                : "Guardar producto"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCreateProduct(false)
                                            }
                                            className="bg-surface/70 text-gray-700 font-semibold px-4 py-2 rounded-xl hover:bg-surface"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="price"
                                className="font-semibold text-gray-700"
                            >
                                ¿A cómo estaba? ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold text-lg">
                                    $
                                </span>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0.05"
                                    required
                                    placeholder="0.00"
                                    className="w-full bg-surface/30 border-2 border-surface p-3 pl-8 rounded-xl outline-none focus:border-primary transition-colors text-gray-800 font-semibold text-base"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="marketSearch"
                                className="font-semibold text-gray-700"
                            >
                                Buscar lugar
                            </label>
                            <div className="relative">
                                <input
                                    id="marketSearch"
                                    type="search"
                                    value={marketSearch}
                                    onChange={(e) => {
                                        setMarketSearch(e.target.value);
                                        setSelectedMarket("");
                                        setShowMarketSuggestions(true);
                                    }}
                                    onFocus={() =>
                                        setShowMarketSuggestions(true)
                                    }
                                    onBlur={() => {
                                        window.setTimeout(
                                            () =>
                                                setShowMarketSuggestions(false),
                                            120,
                                        );
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            setShowMarketSuggestions(false);
                                        }
                                    }}
                                    placeholder="Ej: central, caraguay, sauces"
                                    className="w-full bg-surface/20 border border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                                />
                                {showMarketSuggestions &&
                                    marketSuggestions.length > 0 && (
                                        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-surface bg-white shadow-lg">
                                            {marketSuggestions.map((market) => (
                                                <li key={market.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handlePickMarketSuggestion(
                                                                market,
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 text-left hover:bg-tone transition-colors"
                                                    >
                                                        <span className="font-semibold text-gray-800">
                                                            {market.name}
                                                        </span>
                                                        {market.location && (
                                                            <span className="text-xs text-muted ml-1">
                                                                (
                                                                {
                                                                    market.location
                                                                }
                                                                )
                                                            </span>
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>

                            <label
                                htmlFor="market"
                                className="font-semibold text-gray-700"
                            >
                                ¿En qué lugar?
                            </label>
                            <select
                                id="market"
                                required
                                value={selectedMarket}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setSelectedMarket(selectedId);
                                    setShowMarketSuggestions(false);

                                    const market = marketById.get(selectedId);
                                    if (market) {
                                        setMarketSearch(market.name);
                                    }
                                }}
                                className="w-full bg-surface/30 border-2 border-surface p-3.5 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                            >
                                {filteredMarkets.length === 0 ? (
                                    <option value="" disabled>
                                        No hay lugares para ese filtro
                                    </option>
                                ) : (
                                    <>
                                        <option value="" disabled>
                                            Selecciona un lugar...
                                        </option>
                                        {filteredMarkets.map((mkt) => (
                                            <option
                                                key={mkt.id}
                                                value={String(mkt.id)}
                                            >
                                                {mkt.name}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                            <p
                                className="text-xs text-muted"
                                aria-live="polite"
                            >
                                {filteredMarkets.length} de {markets.length}{" "}
                                lugares visibles
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCreateMarket((current) => !current)
                                }
                                className="text-left mt-0.5 text-primary text-sm font-semibold hover:underline w-max"
                            >
                                + Agregar lugar no listado
                            </button>

                            {showCreateMarket && (
                                <div className="mt-2 rounded-xl border border-surface bg-white/70 p-4 flex flex-col gap-3">
                                    <input
                                        type="text"
                                        value={newMarketName}
                                        onChange={(e) =>
                                            setNewMarketName(e.target.value)
                                        }
                                        placeholder="Nombre del mercado"
                                        className="w-full bg-surface/20 border border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                                    />
                                    <input
                                        type="text"
                                        value={newMarketLocation}
                                        onChange={(e) =>
                                            setNewMarketLocation(e.target.value)
                                        }
                                        placeholder="Ubicación referencial (opcional)"
                                        className="w-full bg-surface/20 border border-surface p-3 rounded-xl outline-none focus:border-primary transition-colors text-gray-800"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleCreateMarket}
                                            disabled={isSavingMarket}
                                            className="bg-primary text-white font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 disabled:opacity-70"
                                        >
                                            {isSavingMarket
                                                ? "Guardando..."
                                                : "Guardar lugar"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCreateMarket(false)
                                            }
                                            className="bg-surface/70 text-gray-700 font-semibold px-4 py-2 rounded-xl hover:bg-surface"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl mt-4 shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                        >
                            {isSubmitting ? "Subiendo..." : "Subir Precio"}
                        </button>
                    </form>
                )}
            </main>

            <NavBar />
        </div>
    );
}
