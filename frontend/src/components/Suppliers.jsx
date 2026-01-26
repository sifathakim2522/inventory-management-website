import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // === FETCH SUPPLIERS ===
    const fetchSuppliers = async () => {
    try {
            const token = localStorage.getItem('inventory-token');
            const response = await axios.get("http://localhost:5000/api/supplier", {
                headers: { Authorization: `Bearer ${token}` }
            });
      if (response.data.success) {
        setSuppliers(response.data.suppliers);
      }
      setLoading(false);
        } catch (error) {
            console.error("Error fetching suppliers:", error?.response?.status, error?.response?.data?.message, error);
            if (error?.response?.status === 401) alert("Unauthorized. Please login.");
            setLoading(false);
        }
  };

    const { user } = useAuth();
    useEffect(() => {
        if (user) fetchSuppliers(); else setLoading(false);
    }, [user]);

  // === Filter Logic ===
  const filteredSuppliers = suppliers.filter((supplier) => 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.includes(searchTerm) ||
      supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === HANDLE SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name || !email || !contact || !address) {
        alert("Please fill in all fields");
        return;
    }

    try {
      if (editingId) {
        // UPDATE
        const response = await axios.put(
            `http://localhost:5000/api/supplier/${editingId}`,
            { name, email, contact, address },
            { headers: { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` } }
        );
        if (response.data.success) alert("Supplier updated successfully!");
      } else {
        // ADD
        const response = await axios.post(
            "http://localhost:5000/api/supplier/add",
            { name, email, contact, address },
            { headers: { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` } }
        );
        if (response.data.success) alert("Supplier added successfully!");
      }
      fetchSuppliers();
      resetForm();
    } catch (error) {
        console.error("Error saving supplier:", error);
        alert(error.response?.data?.message || "Error saving supplier");
    }
  };

  // === HANDLE DELETE ===
  const handleDelete = async (id) => {
      if(window.confirm("Are you sure you want to delete this supplier?")) {
          try {
            const response = await axios.delete(
                `http://localhost:5000/api/supplier/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` } }
            );
            if (response.data.success) {
                alert("Supplier deleted successfully");
                fetchSuppliers();
            }
          } catch (error) {
              console.error("Error deleting supplier:", error);
              alert("Error deleting supplier");
          }
      }
  };

  const handleEdit = (supplier) => {
      setEditingId(supplier._id); 
      setName(supplier.name);
      setEmail(supplier.email);
      setContact(supplier.contact);
      setAddress(supplier.address);
      setShowForm(true); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
      setName("");
      setEmail("");
      setContact("");
      setAddress("");
      setEditingId(null);
      setShowForm(false);
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Supplier Management</h1>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
        <div className="w-full md:w-auto mb-4 md:mb-0">
            <input 
                type="text" 
                placeholder="Search by name, email, or contact..." 
                className="border border-gray-300 rounded-md p-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <button 
            onClick={() => {
                resetForm(); 
                setShowForm(!showForm);
            }}
            className={`px-5 py-2 rounded-md text-white font-medium shadow-sm transition ${showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
            {showForm ? "Cancel" : "+ Add Supplier"}
        </button>
      </div>

      {/* === FORM === */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-blue-100 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
                {editingId ? "Edit Supplier" : "Add New Supplier"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Supplier Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="Contact No." value={contact} onChange={(e) => setContact(e.target.value)} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                <div className="md:col-span-2">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 w-full font-bold shadow-sm transition">
                        {editingId ? "Update Supplier" : "Save Supplier"}
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
                        <th className="py-3 px-6 text-left border-b">Email</th>
                        <th className="py-3 px-6 text-center border-b">Contact</th>
                        <th className="py-3 px-6 text-left border-b">Address</th>
                        <th className="py-3 px-6 text-center border-b w-40">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map((supplier, index) => (
                            <tr key={supplier._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                <td className="py-3 px-6 text-center font-bold">{index + 1}</td>
                                <td className="py-3 px-6 text-left font-medium text-gray-800">{supplier.name}</td>
                                
                                {/* FIXED: Added font-medium and text-gray-800 to make it darker */}
                                <td className="py-3 px-6 text-left font-medium text-gray-800">{supplier.email}</td>
                                <td className="py-3 px-6 text-center font-medium text-gray-800">{supplier.contact}</td>
                                <td className="py-3 px-6 text-left font-medium text-gray-800">{supplier.address}</td>
                                
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center gap-2">
                                        <button onClick={() => handleEdit(supplier)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs font-bold shadow-sm">Edit</button>
                                        <button onClick={() => handleDelete(supplier._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs font-bold shadow-sm">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                                {searchTerm ? "No matching suppliers found." : "No suppliers found. Click \"+ Add Supplier\" to create one."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  )
}

export default Suppliers




