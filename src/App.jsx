import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import AdminOrders from "./components/AdminOrders";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrderForm />} />
        <Route path="/admin" element={<AdminOrders />} />
      </Routes>
    </Router>
  );
}
