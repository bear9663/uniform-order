import { useState, useEffect, useCallback } from "react";

export function useProducts() {
  const [products, setProducts] = useState([]);    
  const [loading, setLoading] = useState(true);    
  const [error, setError] = useState(null);        

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/products");
      if (!res.ok) throw new Error("商品一覧の取得に失敗しました");
      const data = await res.json();              
      setProducts(data);
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);                             

  const addProduct = useCallback(async (product) => {
    const { name, price, sizes } = product; 
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, sizes }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Error response:", errorText);
        throw new Error("商品の追加に失敗しました");
      }
      
      const result = await res.json();
      console.log("Success result:", result);
      fetchProducts();
    } catch (e) {
      console.error("Full error:", e);
      setError(e);
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id, name, price, sizes) => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, sizes }),     
      });
      if (!res.ok) throw new Error("商品の更新に失敗しました");
      await res.json();
      fetchProducts();
    } catch (e) {
      console.error(e);
      setError(e);
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {  
        method: "DELETE",
      });
      if (!res.ok) throw new Error("商品の削除に失敗しました");
      await res.json();
      fetchProducts();
    } catch (e) {
      console.error(e);
      setError(e);
    }
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refresh: fetchProducts,
  };
}
