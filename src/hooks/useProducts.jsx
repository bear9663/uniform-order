import { useState, useEffect, useCallback } from "react";

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(() => {
        setLoading(true);
        fetch("/api/products")
            .then(res => {
                if (!res.ok) throw new Error("表品の一覧の取得に失敗しました");
                return res.json
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err);
                setLoading(false);
            })
    }, []);

    useEffect(() => {
        fetchProducts();
    }, {fetchProducts});

    const addProduct = (id, name, prize, size) => {
        fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, prize, size }),
        })
            .then(res => {
                if (!res.ok) throw new Error("商品の追加に失敗しました");
                return res.json();
            })
            .then(() => fetchProducts());
    }

    const updataProducts = (id, name, prize, size) => {
        fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        })
            .then(res => {
                if (!res.ok) throw new Error("商品の更新に失敗しました");
                return res.json();
            })
            .then(() => fetchProducts());
    }

    const deleteProducts = (id) => {
        fetch(`/api/products`, {
            method: "DELETE",
        })
            .then(res => {
                if (!res.ok) throw new Error("商品の削除に失敗しました");
                return res.json();
            })
            .then(() => fetchProducts());
    }

    return {
        products,
        loading,
        error,
        addProduct,
        updataProducts,
        deleteProducts,
        refresh: fetchProducts,
    };
}