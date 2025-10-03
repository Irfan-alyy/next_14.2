"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Clock, UtensilsCrossed, Store } from "lucide-react";

type Order = {
  id: string;
  display_id: string;
  state: "OFFERED" | "ACCEPTED" | "PREPARING" | "READY";
  items?: { name: string; quantity: number }[];
};

type StoreData = {
  store_name: string;
  store_id: string;
  orders: Order[];
};

export default function KitchenOrders() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // const interval = setInterval(fetchOrders, 10000); // auto-refresh every 10s
    // return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/uber_eats/orders"); // adjust to your endpoint
      const data = await res.json()
      setStores(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (storeId: string, orderId: string, newStatus: "OFFERED" | "ACCEPTED" | "PREPARING" | "READY") => {
    try {
      await fetch(`/api/uber_eats/orders/${orderId}`,{
        method:"PATCH",
        body:JSON.stringify({newState:newStatus })
        
      }
    ) 
      setStores((prev) =>
        prev.map((store) =>
          store.store_id === storeId
            ? {
                ...store,
                orders: store.orders.map((order) =>
                  order.id === orderId ? { ...order, state: newStatus} : order
                ),
              }
            : store
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const renderOrderCard = (storeId: string, order: Order) => (
    <motion.div
      key={order.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border"
    >
      <div className="flex justify-between items-center">
        <span className="font-bold">#{order.display_id}</span>
        <UtensilsCrossed className="w-5 h-5 text-sky-600" />
      </div>
      {order.items && (
        <ul className="text-sm text-gray-700">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.name}</span>
              <span>× {item.quantity}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Actions */}
      {order.state === "ACCEPTED" && (
        <button
          onClick={() => handleUpdateStatus(storeId, order.id, "PREPARING")}
          className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg py-2 transition"
        >
          Start Preparing
        </button>
      )}
      {order.state === "PREPARING" && (
        <button
          onClick={() => handleUpdateStatus(storeId, order.id, "READY")}
          className="mt-auto bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 flex items-center justify-center gap-2 transition"
        >
          <CheckCircle2 className="w-4 h-4" /> Mark Ready
        </button>
      )}
    </motion.div>
  );

  return (
    <div className="w-full flex flex-col  px-30 lg:px-40  mx-auto  mt-20">
      <h1 className="text-3xl  font-bold mb-6 flex items-center gap-2">
        <UtensilsCrossed className="w-8 h-8 text-sky-600" /> Kitchen Display
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-sky-600" />
        </div>
      ) : (
        <div className="space-y-12">
          {stores.map((store) => (
            <div key={store.store_id}>
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-sky-600" />
                <h2 className="text-xl font-semibold">{store.store_name}</h2>
              </div>

              {/* Columns layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Accepted */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" /> Accepted
                  </h3>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {store.orders
                        .filter((o) => o.state === "ACCEPTED")
                        .map((o) => renderOrderCard(store.store_id, o))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Preparing */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-orange-500" /> Preparing
                  </h3>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {store.orders
                        .filter((o) => o.state === "PREPARING")
                        .map((o) => renderOrderCard(store.store_id, o))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Ready */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Ready
                  </h3>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {store.orders
                        .filter((o) => o.state === "READY")
                        .map((o) => renderOrderCard(store.store_id, o))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
