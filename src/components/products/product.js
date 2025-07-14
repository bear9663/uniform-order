import { useEffect } from "react";
import { useProducts } from "../../hooks/useProducts" 

export function useProductList() {
  const { products, loading, error } = useProducts();

  useEffect(() => {
    if (error) {
      alert("商品情報の取得に失敗しました。注文を行えません。");
    }
  }, [error]);

  return { products, loading, error };
}
