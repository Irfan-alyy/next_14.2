"use client";

import { useEffect, useState } from "react";
import { X, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetailModal from "./order_detail";

// Hardcoded data from the provided JSON for demonstration purposes.
// In a real app, this would be fetched from an API using getServerSideProps, Server Components, or client-side fetching.

// Order interface for type safety
export interface Order {
  id: string;
  display_id: string;
  state: string; // Changed from current_state to state
  ordering_platform: string;
  store: {
    id: string;
    name: string;
    timezone: string;
    partner_identifiers?: { value: string; type: string }[];
  };
  customers: {
    id: string;
    name: {
      display_name: string;
      first_name: string;
      last_name: string;
    };
    contact: {
      phone: {
        number: string; // Adjust based on actual phone structure if needed
      };
    };
    is_primary_customer: boolean;
    can_respond_to_fulfillment_issues: boolean;
    status: string;
    order_history?: { past_order_count: number };
  }[];
  preparation_status: string;
  estimated_unfulfilled_at: string;
  is_order_accuracy_risk: boolean;
  preparation_time: {
    ready_for_pickup_time_secs: number;
    source: string;
    ready_for_pickup_time: string;
  };
  action_eligibility: {
    adjust_ready_for_pickup_time: { is_eligible: boolean; reason: string };
    mark_out_of_item: { is_eligible: boolean; reason: string };
    cancel: { is_eligible: boolean; reason: string };
    mark_cannot_fulfill: { is_eligible: boolean; reason: string };
  };
  fulfillment_type: string;
  created_time: string;
  has_membership_pass: boolean;
  cart?: {
    items: {
      title: string;
      quantity: number;
      price: { total_price: { formatted_amount: string } };
    }[];
  };
  payment?: {
    charges: { total: { formatted_amount: string } };
  };
}

// Main OrdersPage component
export default function OrdersPage() {
  const [filter, setFilter] = useState<
    "ALL" | "OFFERED" | "ACCEPTED" | "FAILED"
  >("ALL");
  const [storesOrders, setStoresOrders] = useState();
  const [orders, setOrders] = useState<Array<Order>>([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [currentOrderDetail, setCurrentOrderDetail] = useState<string | null>(
    null
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/uber_eats/orders")
      .then((res) => res.json())
      .then((data) => setStoresOrders(data));
  }, []);

  const loadMore = async (storeId: string, token: string) => {
    const res = await fetch(
      `/api/uber_eats/orders?store_id=${storeId}&page_size=10&next_page_token=${token}`
    );
    const dat = await res.json();
    setStoresOrders((prev) =>
      prev?.map((store: any) =>
        store.store_id === storeId
          ? {
              ...store,
              orders: [...store.orders, ...dat.orders],
              next_page_token: dat?.next_page_token || null,
            }
          : store
      )
    );
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // const handleAccept = async (orderId: string) => {
  //   const response = await fetch(`/api/uber_eats/orders/${orderId}/accept`, {
  //     method: "POST",
  //   });
  //   if (response.ok) {
  //     showNotification(`Accepted order ${orderId}`, "success");
  //     // Update the order state locally to reflect the change
  //     setOrders(
  //       orders.map((order: Order) =>
  //         order.id === orderId ? { ...order, state: "ACCEPTED" } : order
  //       )
  //     );
  //   } else {
  //     showNotification("Error Occured Accepting order", "error");
  //   }
  // };

  const handleAction = async (orderId: string, newState:string) => {
    const response = await fetch(`/api/uber_eats/orders/${orderId}/`, {
      method: "PATCH",
      body:JSON.stringify({newState})
    });
    if (response.ok) {
      showNotification(`${newState==="ACCEPTED"? "Accepted":"Rejected"} order ${orderId}`, "success");
      // Update the order state locally to reflect the change
      setOrders(
        orders.map((order: Order) =>
          order.id === orderId ? { ...order, state: newState } : order
        )
      );
    } else {
      showNotification("Error Occured Accepting order", "error");
    }
  };

  // const handleReject = async (orderId: string) => {
  //   const response = await fetch(`/api/uber_eats/orders/${orderId}/reject`, {
  //     method: "POST",
  //   });
  //   if (response.ok) {
  //     showNotification(`Rejected order ${orderId}`, "success");
  //     // Update the order state locally
  //     setOrders(
  //       orders.map((order: Order) =>
  //         order.id === orderId ? { ...order, state: "FAILED" } : order
  //       )
  //     );
  //   } else {
  //     showNotification("Error Occured Rejecting order", "error");
  //   }
  // };

  const handleDetails = (orderId: string) => {
    setCurrentOrderDetail(orderId);
    setShowOrderDetailsModal(true);
  };

console.log(storesOrders);
  
const filteredStoresOrders = storesOrders ? storesOrders?.map(store => ({
  ...store,
  orders:
    filter === "ALL"
      ? store.orders
      : store.orders.filter((o: Order) => o.state === filter)
})): [];

  const gradientBackground = {
    background: "linear-gradient(135deg, #e0f2f7 0%, #f3e7e9 100%)",
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case "OFFERED":
        return "text-orange-600 bg-orange-100";
      case "ACCEPTED":
        return "text-green-600 bg-green-100";
      case "FAILED":
        return "text-red-600 bg-red-100";
      default:
        return "text-stone-600 bg-stone-100";
    }
  };

  return (
    <main className="min-h-screen font-serif" style={gradientBackground}>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-stone-800">Order History</h1>
          <p className="text-lg text-stone-600 font-sans mt-2">
            View, track, and manage all incoming orders.
          </p>
        </header>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
              filter === "ALL"
                ? "bg-sky-600 text-white shadow-lg"
                : "bg-white text-stone-600 hover:bg-sky-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("OFFERED")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
              filter === "OFFERED"
                ? "bg-sky-600 text-white shadow-lg"
                : "bg-white text-stone-600 hover:bg-sky-100"
            }`}
          >
            Offered
          </button>
          <button
            onClick={() => setFilter("ACCEPTED")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
              filter === "ACCEPTED"
                ? "bg-sky-600 text-white shadow-lg"
                : "bg-white text-stone-600 hover:bg-sky-100"
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setFilter("FAILED")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
              filter === "FAILED"
                ? "bg-sky-600 text-white shadow-lg"
                : "bg-white text-stone-600 hover:bg-sky-100"
            }`}
          >
            Failed
          </button>
        </div>

        {/* Orders by Store */}
        <div className="space-y-10">
          {filteredStoresOrders && filteredStoresOrders?.length > 0 ? (
            filteredStoresOrders.map((store:any) => (
              <div key={store.store_id} className="space-y-6">
                {/* Store Header */}
                <h2 className="text-2xl font-bold text-stone-800 border-b pb-2">
                  {store.store_name}
                </h2>

                {/* Orders List */}
                <div className="space-y-4">
                  {store.orders.length > 0 ? (
                    store.orders.map((order: Order) => (
                      <motion.div
                        key={order?.id}
                        className="bg-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center border border-stone-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Left side: order info */}
                        <div className="flex-1 mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold text-stone-800 mb-1">
                            Order #{order?.display_id || "N/A"}
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-stone-500 mb-2">
                            <span>
                              {new Date(order?.created_time).toLocaleString()}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-medium uppercase ${getStatusColor(
                                order?.state
                              )}`}
                            >
                              {order?.state}
                            </span>
                          </div>
                          <p className="text-sm text-stone-600">
                            Customer:{" "}
                            {order?.customers?.[0]?.name?.display_name || "N/A"}
                          </p>
                        </div>

                        {/* Right side: actions */}
                        <div className="flex-shrink-0 flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleDetails(order?.id)}
                            className="flex items-center justify-center h-10 px-5 rounded-full text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition-colors"
                          >
                            <ChevronRight size={18} className="mr-1" /> Details
                          </button>

                          {order.state === "OFFERED" && (
                            <>
                              <button
                                onClick={() => handleAction(order?.id, "ACCEPTED")}
                                className="flex items-center justify-center h-10 px-5 rounded-full text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                              >
                                <Check size={18} className="mr-1" /> Accept
                              </button>
                              <button
                                onClick={() => handleAction(order?.id, "REJECTED")}
                                className="flex items-center justify-center h-10 px-5 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                <X size={18} className="mr-1" /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-stone-400 text-sm">
                      No orders for this store.
                    </div>
                  )}
                </div>

                {/* Store-specific Load More */}
                {store.next_page_token && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() =>
                        loadMore(store.store_id, store.next_page_token)
                      }
                      className="px-6 py-3 rounded-full text-sm font-semibold bg-white text-stone-700 border border-stone-200 hover:bg-sky-100 hover:border-sky-300 transition-all"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-stone-400 text-lg">
              No orders found.
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed bottom-8 right-8 px-6 py-3 rounded-full shadow-lg font-sans font-semibold text-white ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetailsModal && (
          <OrderDetailModal
            onClose={() => setShowOrderDetailsModal(false)}
            isOpen={true}
            orderId={currentOrderDetail}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
