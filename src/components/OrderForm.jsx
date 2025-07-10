import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";

// 旧フロントエンドで利用していたデフォルト商品リスト
// サーバーから取得できなかった場合のフォールバックとして使用
const DEFAULT_PRODUCTS = [
  { name: "半ズボン", price: 3500 },
  { name: "スカート", price: 5000 },
  { name: "半袖ポロシャツ", price: 1750 },
  { name: "長袖ポロシャツ", price: 1800 },
  { name: "半袖体操着【上下セット】", price: 4300 },
  { name: "半袖体操着 トップスのみ", price: 2500 },
  { name: "半袖体操着 ボトムスのみ", price: 2150 },
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

export default function OrderForm() {
  const { products, loading, error } = useProducts();
  const [initialized, setInitialized] = useState(false);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      childName: "",
      furigana: "",
      parentName: "",
      phone: "",
      email: "",
      address: "",
      height: "",
      weight: "",
      items: [],
    },
  });

  useEffect(() => {
    if (!initialized && (products.length > 0 || DEFAULT_PRODUCTS.length > 0)) {
      const base = products.length > 0 ? products : DEFAULT_PRODUCTS;
      reset({
        childName: "",
        furigana: "",
        parentName: "",
        phone: "",
        email: "",
        address: "",
        height: "",
        weight: "",
        items: base.map(() => ({ size: "", quantity: 0, customSize: "" })),
      });
      setInitialized(true);
    }
  }, [products, reset, initialized]);

  const items = useWatch({ control, name: "items" }) || [];
  const productList = products.length > 0 ? products : DEFAULT_PRODUCTS;

  const total = items.reduce(
    (sum, item, idx) =>
      sum + Number(item.quantity) * (productList[idx]?.price || 0),
    0
  );

  const isFormValid = () => {
    const { childName, parentName, phone, items } = control._formValues;
    if (!childName || !parentName || !phone) return false;
    const hasItem = items.some(item => Number(item.quantity) > 0);
    return hasItem;
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("注文データを送信しました！");
        reset();
      } else {
        alert("送信に失敗しました。");
      }
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました。");
    }
  };

  if (loading && !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>商品を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600">商品情報の取得に失敗しました。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="my-form-card">
        <h1 className="my-form-title text-3xl mb-6">制服・用品 注文フォーム</h1>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <input {...register("childName")} placeholder="園児氏名" className="border p-2 rounded" />
          <input {...register("furigana")} placeholder="フリガナ" className="border p-2 rounded" />
          <input {...register("parentName")} placeholder="保護者氏名" className="border p-2 rounded" />
          <input {...register("phone")} placeholder="電話番号" className="border p-2 rounded" />
          <input {...register("email")} placeholder="メールアドレス" className="border p-2 rounded" />
          <input {...register("address")} placeholder="住所" className="border p-2 rounded" />
          <input {...register("height")} placeholder="身長(cm)" className="border p-2 rounded" />
          <input {...register("weight")} placeholder="体重(kg)" className="border p-2 rounded" />
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="border p-2">商品名</th>
                <th className="border p-2">サイズ</th>
                <th className="border p-2">特注</th>
                <th className="border p-2">数量</th>
                <th className="border p-2">単価</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, idx) => (
                <tr key={idx} className="even:bg-slate-50">
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">
                    <select {...register(`items.${idx}.size`)} className="border p-1 text-sm rounded">
                      <option value="">--</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="LL">LL</option>
                      <option value="特注">特注</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    {items[idx]?.size === "特注" ? (
                      <input {...register(`items.${idx}.customSize`)} className="border p-1 text-sm w-full rounded" />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    <input type="number" min="0" {...register(`items.${idx}.quantity`)} className="border p-1 w-16 text-center rounded" />
                  </td>
                  <td className="border p-2 text-right">{product.price.toLocaleString()}円</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right text-xl font-bold text-blue-700 mb-4">
          合計金額：{total.toLocaleString()} 円
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`font-bold py-2 px-6 rounded ${isFormValid() ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
          >
            注文送信
          </button>
        </div>
      </form>
    </div>
  );
}
