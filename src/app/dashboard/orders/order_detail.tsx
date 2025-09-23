"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string;
  display_id: string;
  current_state: string;
  store: {
    name: string;
  };
  eater: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  cart: {
    items: {
      title: string;
      quantity: number;
      price: {
        total_price: {
          formatted_amount: string;
        };
      };
    }[];
  };
  payment: {
    charges: {
      total: {
        formatted_amount: string;
      };
    };
  };
  placed_at: string;
  estimated_ready_for_pickup_at: string;
  type: string;
  brand: string;
}

interface OrderDetailModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({
  orderId,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  if (!isOpen || !orderId) return null;

  const [order,setOrder]=useState<Order>()

  useEffect(()=>{
    const fetchOrderDetails=async()=>{
        if(isOpen && orderId){
            const response= await fetch(`/api/uber_eats/orders/${orderId}`)
            const data= await response.json()
            setOrder(data)
        }
    }
    fetchOrderDetails()
  },[])

  console.log(order);
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        { order && <div className="max-h-96 overflow-y-auto p-6">
          {/* Order Info */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Order ID</p>
              <p className="text-lg font-semibold text-gray-800">
                {order?.display_id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  order?.current_state === "ACCEPTED"
                    ? "bg-green-100 text-green-800"
                    : order?.current_state === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order?.current_state}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Store</p>
              <p className="text-gray-800">{order?.store?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Brand</p>
              <p className="text-gray-800">{order?.brand}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Placed At</p>
              <p className="text-gray-800">{formatDate(order?.placed_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Estimated Pickup
              </p>
              <p className="text-gray-800">
                {formatDate(order?.estimated_ready_for_pickup_at)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Delivery Type</p>
              <p className="text-gray-800">{order?.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-800">
                {order?.payment?.charges?.total?.formatted_amount}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-600">
              Customer
            </h3>
            <p className="text-gray-800">
              {order?.eater?.first_name} {order?.eater?.last_name}
            </p>
            <p className="text-sm text-gray-600">{order?.eater?.phone}</p>
          </div>

          {/* Items */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-600">
              Items ({order?.cart?.items?.length})
            </h3>
            <div className="space-y-3">
              {order?.cart?.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item?.title}</p>
                    <p className="text-sm text-gray-600">Qty: {item?.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {item?.price?.total_price?.formatted_amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {/* Footer */}
        <div className="flex justify-end border-t bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}