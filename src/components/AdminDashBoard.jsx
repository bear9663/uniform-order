import { Link } from "react-router-dom"

export default function AdminDashboard() {
    return (
        <div className="flex flex-col space-y-6 p-6 bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-800">管理者ダッシュボード</h1>
            <div className="flex flex-col space-y-4">
                <Link 
                    to="/admin/orders" 
                    className="px-4 py-2 bg-white text-blue-700 rounded hover:bg-blue-700 hover:text-white transition duration-200 border"
                >
                    注文の一覧を確認する
                </Link>
                <Link 
                    to="/admin/products" 
                    className="px-4 py-2 bg-white text-green-700 rounded hover:bg-green-700 hover:text-white transition duration-200 border"
                >
                    現在の製品一覧
                </Link>
            </div>
        </div>
    )
}
