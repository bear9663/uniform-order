import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div>
            <header className="fixed top-0 w-full bg-gray-100 p-4 flex justify-between items-center z-10 px-8">
                <h2 className="text-xl font-semibold">発注フォーム管理者用画面</h2>
                <nav className="flex space-x-4">
                    <Link to="/admin" className="text-blue-600 hover:underline">ダッシュボード</Link>
                    <Link to="/admin/orders" className="text-blue-600 hover:underline">注文一覧</Link>
                    <Link to="/admin/products" className="text-blue-600 hover:underline">商品一覧</Link>
                </nav>
            </header>

            <main className="p-4">
                <Outlet />
            </main>
        </div>
    )
}
