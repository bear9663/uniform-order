import { useState } from "react";
import { useProducts } from "../hooks/useProducts"

export default function AdminProducts() {
    const {
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct
    } = useProducts()

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);

    if (loading) return <p>読み込み中...</p>
    if (error) return <p>エラー: {error.message}</p>

    return (
        <div>
            <h1>商品一覧</h1>
            <div>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="商品名" />
                <input value={price} onChange={e => setPrice(e.target.value)} placeholder="価格" />
                <button onClick={() => addProduct(name, Number(price))}>商品を追加</button>
            </div>

            <div>
                <ul>
                    {products.map(p => (
                        <li key={p.id}>
                            {p.name}: ¥{p.price}
                            <button>編集</button>
                            <button onClick={() => deleteProduct(p.id)} >削除</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}