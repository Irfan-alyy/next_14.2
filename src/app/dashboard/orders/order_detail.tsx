"use client";

import { useEffect, useState } from "react";
import { X} from "lucide-react";
import { motion } from "framer-motion";

interface Order {
  id: string;
  display_id: string;
  current_state: string;
  store: { name: string; };
  eater: { first_name: string; last_name: string; phone: string; };
  cart: {
    items: {
      title: string;
      quantity: number;
      price: { total_price: { formatted_amount: string; }; };
    }[];
  };
  payment: { charges: { total: { formatted_amount: string; }; }; };
  placed_at: string;
  estimated_ready_for_pickup_at: string;
  type: string;
  brand: string;
}


function OrderDetailModal({ orderId, isOpen, onClose }: { orderId: string | null; isOpen: boolean; onClose: () => void; }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (isOpen && orderId) {
        const response = await fetch(`/api/uber_eats/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      }
    };
    fetchOrderDetails();
  }, [isOpen, orderId]);

  if (!isOpen || !orderId) return null;

  const formatDate = (isoString: string) => {
    return isoString? new Date(isoString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }):"N/A";
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl font-serif">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-6 py-4">
          <h2 className="text-xl font-bold text-stone-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        {order ? (
          <div className="max-h-[70vh] overflow-y-auto p-6">
            {/* Order Info */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-stone-500 font-sans">Order ID</p>
                <p className="text-lg font-bold text-stone-800">{order?.display_id}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-stone-500 font-sans">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                    order?.current_state === "ACCEPTED" ? "bg-green-100 text-green-800" :
                    order?.current_state === "OFFERED" ? "bg-orange-100 text-orange-800" :
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order?.current_state}
                </span>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-stone-500 font-sans">Customer</p>
                <p className="text-stone-800">{order?.eater?.first_name} {order?.eater?.last_name}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-stone-500 font-sans">Placed At</p>
                <p className="text-stone-800">{formatDate(order?.placed_at)}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-stone-500 font-sans">Estimated Pickup</p>
                <p className="text-stone-800">{formatDate(order?.estimated_ready_for_pickup_at)}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-stone-500 font-sans">Total</p>
                <p className="text-xl font-bold text-sky-600">
                  {order?.payment?.charges?.total?.formatted_amount}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase text-stone-600 font-sans">
                Items ({order?.cart?.items?.length})
              </h3>
              <div className="space-y-4">
                {order?.cart?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl bg-stone-50 p-4 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-stone-800">{item?.title}</p>
                      <p className="text-sm text-stone-600">Qty: {item?.quantity}</p>
                    </div>
                    <p className="font-bold text-stone-800">
                      {item?.price?.total_price?.formatted_amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-500">
            Loading order details...
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end border-t border-stone-200 bg-stone-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-full bg-sky-600 px-6 py-2 font-semibold text-white hover:bg-sky-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}


export default OrderDetailModal