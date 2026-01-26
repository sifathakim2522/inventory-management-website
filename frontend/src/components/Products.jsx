import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // For Dropdown
  const [suppliers, setSuppliers] = useState([]);   // For Dropdown
  const [loading, setLoading] = useState(true);

  // Form States
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // UI States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // === UPDATED: SAFE FETCH DATA ===
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('inventory-token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Categories
      try {
        const catRes = await axios.get("http://localhost:5000/api/category", { headers });
        if (catRes.data.success) setCategories(catRes.data.categories);
      } catch (err) {
        console.error("❌ Failed to load Categories:", err);
      }

      // 2. Fetch Suppliers
      try {
        const supRes = await axios.get("http://localhost:5000/api/supplier", { headers });
        if (supRes.data.success) setSuppliers(supRes.data.suppliers);
      } catch (err) {
        console.error("❌ Failed to load Suppliers:", err);
      }

      // 3. Fetch Products
      try {
        const prodRes = await axios.get("http://localhost:5000/api/products", { headers });
        if (prodRes.data.success) setProducts(prodRes.data.products);
      } catch (err) {
        console.error("❌ Failed to load Products:", err?.response?.status, err?.response?.data?.message, err);
        if (err?.response?.status === 401) alert("Unauthorized. Please login.");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("General Error:", error);
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

  // === FILTER LOGIC ===
  const filteredProducts = products.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category?.categoryName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.supplier?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === HANDLE SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name || !categoryId || !supplierId || !price || !stock) {
        alert("Please fill in all fields");
        return;
    }

    try {
      const payload = { 
        name, 
        category: categoryId, 
        supplier: supplierId, 
        price : Number(price), 
        stock : Number(stock)
      };
      
      const headers = { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` };

      if (editingId) {
        // UPDATE
        await axios.put(`http://localhost:5000/api/products/${editingId}`, payload, { headers });
        alert("Product updated successfully!");
      } else {
        // ADD
        await axios.post("http://localhost:5000/api/products/add", payload, { headers });
        alert("Product added successfully!");
      }
      fetchData(); // Refresh list
      resetForm();
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Error saving product");
    }
  };

  // === HANDLE DELETE ===
  const handleDelete = async (id) => {
      if(window.confirm("Are you sure you want to delete this product?")) {
          try {
            await axios.delete(`http://localhost:5000/api/products/${id}`, { 
                headers: { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` } 
            });
            alert("Product deleted");
            fetchData();
          } catch (error) {
              console.error("Error deleting:", error);
          }
      }
  };

  const handleEdit = (product) => {
      setEditingId(product._id);
      setName(product.name);
      // Handle populated objects safely
      setCategoryId(product.category?._id || product.category); 
      setSupplierId(product.supplier?._id || product.supplier);
      setPrice(product.price);
      setStock(product.stock);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setName("");
      setCategoryId("");
      setSupplierId("");
      setPrice("");
      setStock("");
      setEditingId(null);
      setShowForm(false);
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Product Management</h1>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        <div className="w-full md:w-auto mb-4 md:mb-0">
            <input 
                type="text" 
                placeholder="Search products..." 
                className="border border-gray-300 rounded-md p-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <button 
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className={`px-5 py-2 rounded-md text-white font-medium shadow-sm transition ${showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
            {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* === FORM === */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-100 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
                {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Name */}
                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />

                {/* Category Dropdown */}
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                    ))}
                </select>

                {/* Supplier Dropdown */}
                <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">Select Supplier</option>
                    {suppliers.map(sup => (
                        <option key={sup._id} value={sup._id}>{sup.name}</option>
                    ))}
                </select>

                {/* Price & Stock */}
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />
                <input type="number" placeholder="Stock Quantity" value={stock} onChange={(e) => setStock(e.target.value)} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" required />

                <div className="md:col-span-2">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 w-full font-bold shadow-sm transition">
                        {editingId ? "Update Product" : "Save Product"}
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* === TABLE === */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-center border-b w-16">Sl No.</th>
                        <th className="py-3 px-6 text-left border-b">Name</th>
                        <th className="py-3 px-6 text-left border-b">Category</th>
                        <th className="py-3 px-6 text-left border-b">Supplier</th>
                        <th className="py-3 px-6 text-center border-b">Price</th>
                        <th className="py-3 px-6 text-center border-b">Stock</th>
                        <th className="py-3 px-6 text-center border-b w-40">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((p, index) => (
                            <tr key={p._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                <td className="py-3 px-6 text-center font-bold">{index + 1}</td>
                                <td className="py-3 px-6 text-left font-medium text-gray-800">{p.name}</td>
                                <td className="py-3 px-6 text-left">{p.category?.categoryName || "N/A"}</td>
                                <td className="py-3 px-6 text-left">{p.supplier?.name || "N/A"}</td>
                                <td className="py-3 px-6 text-center font-bold text-green-600">${p.price}</td>
                                <td className={`py-3 px-6 text-center font-bold ${p.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                                    {p.stock}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center gap-2">
                                        <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs font-bold shadow-sm">Edit</button>
                                        <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs font-bold shadow-sm">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="text-center py-6 text-gray-500 italic">No products found.</td></tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  )
}

export default Products;
