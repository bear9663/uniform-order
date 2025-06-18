import { useEffect, useState } from "react";

export default function useOrders() {
    const [orders, setOrders] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/api/orders")
        .then(res => res.json())
        .then(data => {
            setOrders(data)
            setLoading(false);
        })
        .catch(err => {
            setError(err);
            setLoading(false);
            console.error("Error fetching orders:", err);
        });
    }, []);

    return { orders, error, loading };

}