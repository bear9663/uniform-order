import { useProducts } from "../../hooks/useProducts";

// 初期表示用の静的商品リスト
export const PRODUCTS = [
  { name: "半ズボン", price: 3500 },
  { name: "スカート", price: 5000 },
  { name: "半袖ポロシャツ", price: 1750 },
  { name: "長袖ポロシャツ", price: 1800 },
  { name: "半袖体操着【上下セット】", price: 4300 },
  { name: "半袖体操着 トップスのみ", price: 2500 },
  { name: "半袖体操着 ボトスのみ", price: 2150 },
  { name: "長袖体操着（トップス）", price: 2200 },
  { name: "ジャージ【上下セット】", price: 7500 },
  { name: "ジャージ トップスのみ", price: 5000 },
  { name: "ジャージ ボトムスのみ", price: 3000 },
  { name: "クルーソックス", price: 500 },
  { name: "ハイソックス", price: 600 },
  { name: "紅白帽子", price: 1300 },
  { name: "夏帽子", price: 1800 },
  { name: "冬帽子", price: 1800 },
  { name: "登園カバン", price: 5000 },
  { name: "プールバッグ", price: 1000 },
  { name: "ニットベスト（ネイビー）", price: 3000 },
];

// APIから取得した商品を優先し、取得できない場合は上記リストを利用する
export function useProductList() {
  const { products, loading, error } = useProducts();
  const list = products.length > 0 ? products : PRODUCTS;
  return { products: list, loading, error };
}
