import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import AdminLayout from "./components/AdminLayout";
import AdminOrders from "./components/AdminOrders";
import AdminDashboard from "./components/AdminDashBoard";
import AdminProducts from "./components/AdminProducts"


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrderForm />} />

        <Route path="/admin" element={<AdminLayout/>}>
          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts/>} />
        </Route>
      </Routes>
    </Router>
  );
}
