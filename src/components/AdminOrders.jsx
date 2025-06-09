import { useEffect, useState } from "react";

const PRODUCTS = [
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

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  const filtered = orders.filter(o =>
    (o.child_name + o.parent_name).toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => sortAsc ? a.id - b.id : b.id - a.id);

  const downloadCSV = () => {
    const header = ["ID", "日時", "園児氏名", "保護者", "電話", "メール", ...PRODUCTS.map(p => p.name), "合計金額"];
    const rows = sorted.map(order => {
      const total = order.items.reduce(
        (sum, item, idx) => sum + Number(item.quantity) * PRODUCTS[idx].price,
        0
      );
      const items = PRODUCTS.map((_, idx) => {
        const item = order.items[idx];
        const size = item.size === "特注" ? `特注:${item.customSize}` : item.size || "-";
        return Number(item.quantity) > 0 ? `${item.quantity}(${size})` : "0";
      });
      return [
        order.id,
        order.created_at,
        order.child_name,
        order.parent_name,
        order.phone,
        order.email,
        ...items,
        total
      ];
    });
    // 🎯 CSV文字化け防止用 BOM追加
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(['\uFEFF' + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
          注文一覧（管理者画面）
        </h1>

        <div className="mb-4 flex flex-col md:flex-row md:justify-between items-center gap-4">
          <input
            type="text"
            placeholder="園児名・保護者名で検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full md:w-64 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              ID並び替え {sortAsc ? "▲" : "▼"}
            </button>
            <button
              onClick={downloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              CSVダウンロード
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border w-full text-xs">
            <thead className="bg-blue-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">日時</th>
                <th className="border p-2">園児氏名</th>
                <th className="border p-2">保護者</th>
                <th className="border p-2">電話</th>
                <th className="border p-2">メール</th>
                {PRODUCTS.map((product, idx) => (
                  <th key={idx} className="border p-2">{product.name}</th>
                ))}
                <th className="border p-2">合計</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(order => {
                const total = order.items.reduce(
                  (sum, item, idx) => sum + Number(item.quantity) * PRODUCTS[idx].price,
                  0
                );
                return (
                  <tr key={order.id} className="even:bg-slate-50">
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{order.created_at}</td>
                    <td className="border p-2">{order.child_name}</td>
                    <td className="border p-2">{order.parent_name}</td>
                    <td className="border p-2">{order.phone}</td>
                    <td className="border p-2">{order.email}</td>
                    {PRODUCTS.map((_, idx) => {
                      const item = order.items[idx];
                      const size = item.size === "特注" ? `特注:${item.customSize}` : item.size || "-";
                      return (
                        <td key={idx} className="border p-2 text-center">
                          {Number(item.quantity) > 0 ? `${item.quantity}(${size})` : "0"}
                        </td>
                      );
                    })}
                    <td className="border p-2 text-right">{total.toLocaleString()}円</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
