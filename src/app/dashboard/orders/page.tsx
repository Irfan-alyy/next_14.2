"use client";
// app/orders/page.tsx
import { useEffect, useState } from "react";
import OrderDetailModal from "./order_detail";

// Hardcoded data from the provided JSON for demonstration purposes.
// In a real app, this would be fetched from an API using getServerSideProps, Server Components, or client-side fetching.

// Dummy store ID (extracted from data as placeholder)
const DUMMY_STORE_ID = "84f93bb9-e8cf-4f81-b594-a2880792194d";

export default function OrdersPage() {
  const [filter, setFilter] = useState<
    "ALL" | "OFFERED" | "ACCEPTED" | "FAILED"
  >("ALL");
  const [orders, setOrders] = useState<any>([]);

  const [nextPageToken,setNextPageToken]=useState(null)

  const [currentPage,setCurrentPage]=useState(1)

  const [showOrderDetailsModal,setShowOrderDetailsModal]=useState(false)

  const [currentOrderDetail, setCurrentOrderDetail]=useState<string>()

useEffect(()=>{
    fetch(`/api/uber_eats/orders?store_id=${DUMMY_STORE_ID}&page_size=10`).then(res=>res.json()).then(dat=>
        {
            setOrders(dat.data)
            console.log(dat?.pagination_data);
            setNextPageToken(dat?.pagination_data?.next_page_token)
        })
},[])

const loadMore=()=>{
    fetch(`/api/uber_eats/orders?store_id=${DUMMY_STORE_ID}&next_page_token=${nextPageToken}`).then(res=>res.json()).then(data=>{
        setOrders([...orders, ...data?.data])
        setNextPageToken(data?.pagination_data?.next_page_token || null)
    }
)
}

console.log(nextPageToken);


  const filteredOrders = orders?.filter((order) => {
    if (filter === "ALL") return true;
    return order?.state === filter;
  });

  const handleAccept = async(orderId: string) => {
    console.log(`Accepting order ${orderId}`);
    const response= await fetch(`/api/uber_eats/orders/${orderId}/accept`,{
      method:"POST"
    })
    if(response.ok){
        alert(`Accepted order ${orderId}`);
    }else{
        alert('Error Occured Accepting order')
    }
  };

  const handleReject = async (orderId: string) => {
    console.log(`Rejecting order ${orderId}`);
     const response= await fetch(`/api/uber_eats/orders/${orderId}/reject`,{
      method:"POST"
     })
    if(response.ok){
        alert(`Rejected order ${orderId}`);
    }else{
        alert(`Rejected order ${orderId}`);
    }
  };

  const handleDetails = (orderId: string) => {
    // In real app, navigate to details page or show modal
    console.log(`Viewing details for order ${orderId}`);
    setShowOrderDetailsModal(true)
    setCurrentOrderDetail(orderId)
  };

  return (
    <div className="container mx-auto p-4 mt-20">

      {/* Filter Buttons */}
      <div className="mb-4 space-x-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded ${
            filter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("OFFERED")}
          className={`px-4 py-2 rounded ${
            filter === "OFFERED" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Offered
        </button>
        <button
          onClick={() => setFilter("ACCEPTED")}
          className={`px-4 py-2 rounded ${
            filter === "ACCEPTED" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Accepted
        </button>
        <button
          onClick={() => setFilter("FAILED")}
          className={`px-4 py-2 rounded ${
            filter === "FAILED" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Failed
        </button>
      </div>

      {/* Orders Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Display ID</th>
            <th className="py-2 px-4 border-b">State</th>
            <th className="py-2 px-4 border-b">Created Time</th>
            <th className="py-2 px-4 border-b">Customer</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders?.map((order) => (
            <tr key={order?.id}>
              <td className="py-2 px-4 border-b">
                {order?.display_id || "N/A"}
              </td>
              <td className="py-2 px-4 border-b">{order?.state || "N/A"}</td>
              <td className="py-2 px-4 border-b">
                {order?.created_time || "N/A"}
              </td>
              <td className="py-2 px-4 border-b">
                {order?.customers[0]?.name.display_name || "N/A"}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleDetails(order?.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  See Details
                </button>
                {order.state === "OFFERED" && (
                  <>
                    <button
                      onClick={() => handleAccept(order?.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(order?.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {nextPageToken&& <button onClick={loadMore}>
        Load More
        </button>}

        {showOrderDetailsModal&& <OrderDetailModal onClose={()=>setShowOrderDetailsModal(false)} isOpen={true} orderId={currentOrderDetail}/>}
    </div>
  );
}
