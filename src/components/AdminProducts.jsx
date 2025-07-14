import { useState } from "react";
import { useProducts } from "../hooks/useProducts";

const SIZE_OPTIONS = ["110", "120", "130", "特注", "サイズなし"]

export default function AdminProducts() {
  const {
    products,
    loading,
    error,
    addProduct,
    deleteProduct,
  } = useProducts();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [message, setMessage] = useState("");


  if (loading) return <p className="text-center py-8">読み込み中...</p>;
  if (error) return <p className="text-center py-8 text-red-600">エラー: {error.message}</p>;

  const toggleSize = (size) => {
    setSizes(prev =>
        prev.includes(size)
          ? prev.filter(s => s !== size)
          : [...prev, size]
    );
  };

  const handleAdd = () => {
    addProduct({ name, price: Number(price), sizes });
    setName("");
    setPrice(0);
    setSizes([]);

    setMessage("商品を追加しました！")
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-10">
        <h1 className="text-3xl font-bold mb-6 text-left">
          商品一覧
        </h1>
        <div className="mb-8 space-y-6">
          {message && (
            <div className="text-green-400 border border-green-400 rounded-lg px-3 py-1">{message}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="商品名"
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">¥</span>
              <input
                  type="number"
                  step={100}
                  min={0}
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="価格"
                  className="pl-7 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
            </div>
            <button
              onClick={handleAdd}
              className="bg-[#0c2a46] hover:bg-white text-white hover:text-[#0c2a46] hover:border hover:border-[#0c2a46] font-semibold rounded p-2 transition"
            >
              商品を追加
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="font-semibold">サイズ展開:</div>
            {SIZE_OPTIONS.map(size => {
              const selected = sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 rounded-full border 
                    ${selected 
                      ? "bg-[#0c2a46] text-white border-[#0c2a46]" 
                      : "bg-white text-[#0c2a46] border-[#0c2a46]"
                    } 
                    hover:bg-[#d6dee6] transition`
                  }
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="space-y-4">
          {products.map(p => (
            <li
              key={p.id}
              className="flex flex-col md:flex-row justify-between items-center border-b pb-4"
            >
              <div className="flex-1">
                <span className="font-medium">{p.name}</span>
                <span className="ml-2 text-gray-600">¥{p.price}</span>
                <div className="text-sm">サイズ: {p.sizes.join("・")}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded px-3 py-1"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
