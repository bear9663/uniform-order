import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 p-6 space-y-6 shadow-md border border-right">
                <h2 className="text-xl font-bold text-gray-800 mb-4">注文フォーム管理画面</h2>
                <nav className="flex flex-col space-y-2">
                    <Link to="/admin" className="text-blue-900 hover:underline hover:bg-blue-100 p-3 rounded-lg transition duration-200">
                        ・ダッシュボード
                    </Link>
                    <Link to="/admin/orders" className="text-blue-900 hover:underline hover:bg-blue-100 p-2 rounded-lg transition duration-200">
                        ・注文一覧
                    </Link>
                    <Link to="/admin/products" className="text-blue-900 hover:underline hover:bg-blue-100 p-2 rounded-lg transition duration-200">
                        ・商品一覧
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-8 bg-white">
                <Outlet />
            </main>
        </div>
    );
}
