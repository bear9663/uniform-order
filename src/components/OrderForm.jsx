import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useProductList, PRODUCTS } from "./products/product";

// 商品一覧を取得し、APIが使えない場合は PRODUCTS を使用

export default function OrderForm() {
  const { products: productList, loading, error } = useProductList();

  const { register, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      childName: "",
      furigana: "",
      parentName: "",
      phone: "",
      email: "",
      address: "",
      height: "",
      weight: "",
      items: PRODUCTS.map(() => ({ size: "", quantity: 0, customSize: "" })),
    },
  });

  // 商品情報が更新されたら項目数を合わせる
  useEffect(() => {
    setValue(
      "items",
      productList.map(() => ({ size: "", quantity: 0, customSize: "" }))
    );
  }, [productList, setValue]);

  const items = useWatch({ control, name: "items" }) || [];

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
        reset({
          childName: "",
          furigana: "",
          parentName: "",
          phone: "",
          email: "",
          address: "",
          height: "",
          weight: "",
          items: productList.map(() => ({ size: "", quantity: 0, customSize: "" })),
        });
      } else {
        alert("送信に失敗しました。");
      }
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました。");
    }
  };

  if (loading) {
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
