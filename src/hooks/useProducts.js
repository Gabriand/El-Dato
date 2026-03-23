import { useState } from "react";

export default function useProducts() {
    const [products, setProducts] = useState([]);

    return {
        products,
        setProducts,
    };
}
