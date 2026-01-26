
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaShoppingCart, FaDollarSign, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStock: 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStockProducts: [],
        topSellingProducts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('inventory-token');
                const res = await axios.get("http://localhost:5000/api/dashboard/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if(res.data.success) {
                    setStats(res.data.stats);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-6 text-center">Loading Analytics...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

            {/* === 1. TOP CARDS === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Revenue Card */}
                <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                        <h2 className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</h2>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full text-green-600"><FaDollarSign size={24}/></div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                        <h2 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h2>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600"><FaShoppingCart size={24}/></div>
                </div>

                {/* Products Card */}
                <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Products</p>
                        <h2 className="text-2xl font-bold text-gray-800">{stats.totalProducts}</h2>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600"><FaBox size={24}/></div>
                </div>

                {/* Stock Card */}
                <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-orange-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Stock Items</p>
                        <h2 className="text-2xl font-bold text-gray-800">{stats.totalStock}</h2>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600"><FaChartLine size={24}/></div>
                </div>
            </div>

            {/* === 2. BOTTOM SECTION === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Selling Products */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-700 flex items-center gap-2">
                         🏆 Best Selling Products
                    </h3>
                    <div className="space-y-4">
                        {stats.topSellingProducts.length > 0 ? (
                            stats.topSellingProducts.map((p, i) => (
                                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <span className="font-medium text-gray-700">{p.name}</span>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                                        {p.totalSold} Sold
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No sales yet.</p>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-700 flex items-center gap-2">
                        <FaExclamationTriangle className="text-red-500"/> Low Stock Alerts (Below 5)
                    </h3>
                    <div className="space-y-3">
                        {stats.lowStockProducts.length > 0 ? (
                            stats.lowStockProducts.map((p) => (
                                <div key={p._id} className="flex justify-between items-center bg-red-50 p-3 rounded-md border border-red-100">
                                    <span className="font-medium text-red-700">{p.name}</span>
                                    {p.stock === 0 ? (
                                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
                                    ) : (
                                        <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded">Only {p.stock} left</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-green-600 bg-green-50 p-3 rounded font-medium text-center">
                                ✅ All stock levels are good!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;



