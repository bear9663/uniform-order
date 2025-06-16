import { useEffect, useState } from "react";
import OrderRow from "./OrderRow";
import { PRODUCTS } from "./products/product";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [openIds, setOpenIds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);
  }, []);

  const filtered = orders.filter(o =>
    (o.child_name + o.parent_name)
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) =>
    sortAsc ? a.id - b.id : b.id - a.id
  );

  const toggleOpen = id => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const downloadCSV = () => {
    const header = [
      "ID", "日時", "園児氏名", "保護者", "電話", "メール",
      ...PRODUCTS.map(p => p.name),
      "合計金額"
    ];
    const rows = sorted.map(order => {
      const total = order.items.reduce(
        (sum, item, idx) =>
          sum + Number(item.quantity) * PRODUCTS[idx].price,
        0
      );
      const items = PRODUCTS.map((_, idx) => {
        const item = order.items[idx] || {};
        const size =
          item.size === "特注"
            ? `特注:${item.customSize}`
            : item.size || "-";
        return Number(item.quantity) > 0
          ? `${item.quantity}(${size})`
          : "0";
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
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="園児名・保護者名で検索"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        />
      </div>

      <div className="mb-4 flex gap-2">
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

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border w-full text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">日時</th>
              <th className="border p-2">園児氏名</th>
              <th className="border p-2">保護者</th>
              <th className="border p-2">電話</th>
              <th className="border p-2">メール</th>
              <th className="border p-2">詳細</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(order => (
              <OrderRow
                key={order.id}
                order={order}
                isOpen={openIds.includes(order.id)}
                onToggle={toggleOpen}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
