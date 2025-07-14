import { useProductList } from "./products/product";

export default function OrderRow({ order, isOpen, onToggle }) {
    const { products: productList } = useProductList();
    const total = order.items.reduce((sum, item, idx) => {
        const price = productList[idx]?.price || 0;
        return sum + Number(item.quantity) * price;
    }, 0);

    return (
        <>
            <tr className="even:bg-slate-50">
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.created_at}</td>
                <td className="border p-2">{order.child_name}</td>
                <td className="border p-2">{order.parent_name}</td>
                <td className="border p-2">{order.phone}</td>
                <td className="border p-2">{order.email}</td>
                <td className="border p-2 text-center">
                <button
                    onClick={() => onToggle(order.id)}
                    className="text-[#1e2e47]"
                >
                    {isOpen ? "▲" : "▼"}
                </button>
                </td>
            </tr>

            {isOpen && (
                <tr>
                    <td colSpan={7} className="border p-4 bg-gray-50">
                        <ul className="list-disc pl-6">
                        {order.items.map((item, idx) => {
                            if (Number(item.quantity) === 0) return null;
                            const prod = productList[idx] || {};
                            const size =
                            item.size === "特注"
                                ? `特注:${item.customSize}`
                                : item.size || "-";
                            return (
                            <li key={idx} className="mb-1">
                                {prod.name}（{size}） × {item.quantity} ={" "}
                                {(Number(item.quantity) * (prod.price || 0)).toLocaleString()}円
                            </li>
                            );
                        })}
                        </ul>
                        <div className="text-right font-bold">
                        合計：{total.toLocaleString()}円
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}