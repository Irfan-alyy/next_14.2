// app/dashboard/AlertList.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

type Alert = {
  id: string;
  event_type: string;
  event_time: number;
  resource_id: string;
  webhook_received_at: string;
};

export default function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<{
    shown: boolean;
    id: string;
  }>({ shown: false, id: "" });
  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events/latest");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      setError("Failed to load alerts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const eventMap = {
    ["orders.notification"]: "New Order",
    ["orders.cancel"]: "Order Cancled",
    ["delivery.state_changed"]: "Delivery Status",
    ["orders.release"]: "Order Ready for Pickup",
  };

  // Initial load
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Optional: Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAlerts();
    }, 60000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchAlerts();
  };

  if (alerts.length > 0) {
    alerts.forEach((latestEvent) => {
      if (
        latestEvent.event_type === "orders.notification" &&
        !newOrderAlert.shown &&
        newOrderAlert.id !== latestEvent.id
      ) {
        if (Date.now() - latestEvent.event_time < 660000) {
          setNewOrderAlert({ shown: true, id: latestEvent.id });
          toast.info(
            `New Order ${latestEvent.id}. \n Recieved On: ${new Date(
              latestEvent.event_time
            ).toLocaleTimeString()}`
          );
        }
      }
    });
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white border  border-gray-200 rounded-lg shadow-sm h-80 overflow-y-auto p-4 relative">
      <ToastContainer
        autoClose={660000}
        className="mt-[70px]"
        closeButton={true}
        position={"bottom-right"}
        hideProgressBar={true}
      />
      <div className="flex ">
        <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>

        <div className="">
          <button
            onClick={handleRefresh}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <OrdersAlertSkeleton />
      ) : alerts.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No recent alerts</p>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="p-3 border rounded bg-blue-50 hover:bg-blue-100 transition"
            >
              <div className="flex gap-10 justify-between">
                <span className="font-mono text-sm">
                  #{alert?.id?.slice(-5)}
                </span>
                <span className="text-xs text-nowrap text-gray-600">
                  {new Date(alert.event_time).toLocaleString()}
                </span>
              </div>
              <p className="text-sm mt-1 text-blue-800">
                {eventMap[alert.event_type]}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function OrdersAlertSkeleton() {
  return (
    <ul className="space-y-3">
      <li className="p-3 py-8 border rounded bg-blue-50 hover:bg-blue-100 transition">
        <div className="flex justify-between">
          <span className="font-mono text-sm bg-gray-600 px-4"> </span>
          <span className="text-xs text-gray-600 px-4 bg-gray-600"></span>
        </div>
        <p className="text-sm mt-1 text-blue-800 bg-blue-800 px-5"></p>
      </li>
      <li className="p-3 py-8 border rounded bg-blue-50 hover:bg-blue-100 transition">
        <div className="flex justify-between">
          <span className="font-mono text-sm bg-gray-600 px-4"> </span>
          <span className="text-xs text-gray-600 px-4 bg-gray-600"></span>
        </div>
        <p className="text-sm mt-1 text-blue-800 bg-blue-800 px-5"></p>
      </li>
      <li className="p-3 py-8 border rounded bg-blue-50 hover:bg-blue-100 transition">
        <div className="flex justify-between">
          <span className="font-mono text-sm bg-gray-600 px-4"> </span>
          <span className="text-xs text-gray-600 px-4 bg-gray-600"></span>
        </div>
        <p className="text-sm mt-1 text-blue-800 bg-blue-800 px-5"></p>
      </li>
      <li className="p-3 py-8 border rounded bg-blue-50 hover:bg-blue-100 transition">
        <div className="flex justify-between">
          <span className="font-mono text-sm bg-gray-600 px-4"> </span>
          <span className="text-xs text-gray-600 px-4 bg-gray-600"></span>
        </div>
        <p className="text-sm mt-1 text-blue-800 bg-blue-800 px-5"></p>
      </li>
      <li className="p-3 py-8 border rounded bg-blue-50 hover:bg-blue-100 transition">
        <div className="flex justify-between">
          <span className="font-mono text-sm bg-gray-600 px-4"> </span>
          <span className="text-xs text-gray-600 px-4 bg-gray-600"></span>
        </div>
        <p className="text-sm mt-1 text-blue-800 bg-blue-800 px-5"></p>
      </li>
    </ul>
  );
}
