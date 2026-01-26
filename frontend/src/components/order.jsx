import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // Products still need dropdown
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);

  // === FETCH DATA ===
  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` };
      
      
      const [orderRes, prodRes] = await Promise.all([
        axios.get("http://localhost:5000/api/order", { headers }),
        axios.get("http://localhost:5000/api/products", { headers })
      ]);

      if(orderRes.data.success) setOrders(orderRes.data.orders);
      if(prodRes.data.success) setProducts(prodRes.data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // === HANDLE SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` };
      const payload = {
          customerName,      // Sending Text
          customerAddress,   // Sending Text
          productId: selectedProduct,
          quantity: Number(quantity)
      };

      await axios.post("http://localhost:5000/api/order/add", payload, { headers });
      
      alert("Order placed successfully!");
      setShowForm(false);
      setCustomerName("");
      setCustomerAddress("");
      setQuantity(1);
      fetchData(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Error placing order");
    }
  };

  // === HANDLE DELETE ===
  const handleDelete = async (id) => {
      if(window.confirm("Delete this order?")) {
          try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` };
            await axios.delete(`http://localhost:5000/api/order/${id}`, { headers });
            fetchData();
          } catch (error) { alert("Error deleting order"); }
      }
  }

  // Filter
  const filteredOrders = orders.filter(o => 
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center mt-20">Loading Orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Order History</h1>

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
        <input 
            type="text" 
            placeholder="Search..." 
            className="border p-2 rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
        >
            {showForm ? "Cancel" : "+ New Order"}
        </button>
      </div>

      {showForm && (
          <div className="bg-white p-6 mb-6 rounded shadow border-l-4 border-blue-500 animate-fade-in">
              <h3 className="font-bold mb-4">Create New Order</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  
                  {/* Customer Name Input (Text) */}
                  <div>
                      <label className="block text-sm mb-1">Customer Name</label>
                      <input 
                        type="text" 
                        className="border p-2 rounded w-full" 
                        value={customerName} 
                        onChange={e=>setCustomerName(e.target.value)} 
                        required 
                        placeholder="Enter Name"
                      />
                  </div>

                  {/* Customer Address Input (Text) */}
                  <div>
                      <label className="block text-sm mb-1">Address</label>
                      <input 
                        type="text" 
                        className="border p-2 rounded w-full" 
                        value={customerAddress} 
                        onChange={e=>setCustomerAddress(e.target.value)} 
                        required 
                        placeholder="Enter Address"
                      />
                  </div>

                  {/* Product Dropdown (Keep this) */}
                  <div>
                      <label className="block text-sm mb-1">Product</label>
                      <select className="border p-2 rounded w-full" value={selectedProduct} onChange={e=>setSelectedProduct(e.target.value)} required>
                          <option value="">Select Product</option>
                          {products.map(p => <option key={p._id} value={p._id}>{p.name} (${p.price})</option>)}
                      </select>
                  </div>

                  {/* Quantity */}
                  <div>
                      <label className="block text-sm mb-1">Qty</label>
                      <input type="number" min="1" className="border p-2 rounded w-full" value={quantity} onChange={e=>setQuantity(e.target.value)} required />
                  </div>

                  <button className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 md:col-span-4 w-full md:w-auto">
                    Place Order
                  </button>
              </form>
          </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-100 border-b text-gray-700 text-sm uppercase">
                    <th className="p-3 text-center w-16 border-r">Sl</th>
                    <th className="p-3 border-r">Customer Name</th>
                    <th className="p-3 border-r">Address</th>
                    <th className="p-3 border-r">Product</th>
                    <th className="p-3 border-r">Category</th>
                    <th className="p-3 text-center border-r">Qty</th>
                    <th className="p-3 text-center border-r">Total</th>
                    <th className="p-3 border-r">Date</th>
                    <th className="p-3 text-center">Action</th>
                </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                        <tr key={order._id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-center font-bold border-r">{index + 1}</td>
                            <td className="p-3 border-r font-medium text-gray-800">{order.customerName}</td>
                            <td className="p-3 border-r">{order.customerAddress}</td>
                            <td className="p-3 border-r">{order.product?.name || "Deleted"}</td>
                            <td className="p-3 border-r text-blue-600">{order.product?.category?.categoryName || "N/A"}</td>
                            <td className="p-3 text-center border-r">{order.quantity}</td>
                            <td className="p-3 text-center border-r font-bold text-green-600">${order.totalPrice}</td>
                            <td className="p-3 border-r">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="p-3 text-center">
                                <button onClick={() => handleDelete(order._id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="9" className="text-center p-6 text-gray-500">No orders found.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default Orders;

