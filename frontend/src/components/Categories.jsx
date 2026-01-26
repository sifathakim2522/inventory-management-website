import React, { useState, useEffect } from 'react'; 
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; 

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // === 1. NEW: Search State ===
  const [searchTerm, setSearchTerm] = useState("");

  // === FETCH CATEGORIES ===
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('inventory-token');
      const response = await axios.get("http://localhost:5000/api/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.data.success) {
          setCategories(response.data.categories);
      }
      setLoading(false); 
    } catch (error) {
      console.error("Error fetching categories", error?.response?.status, error?.response?.data?.message, error);
      if (error?.response?.status === 401) alert("Unauthorized. Please login.");
      setLoading(false);
    }
  };

  const { user } = useAuth();
  useEffect(() => {
    if (user) fetchCategories(); else setLoading(false);
  }, [user]);

  // === 2. NEW: Filter Logic ===
  const filteredCategories = categories.filter((category) => 
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.categoryDescription && category.categoryDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // === HANDLE SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategoryId) {
        // UPDATE MODE
        const response = await axios.put(
          `http://localhost:5000/api/category/${editingCategoryId}`, 
          { categoryName, categoryDescription },
          { headers: { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` } }
        );
        if (response.data.success) {
          alert("Category updated successfully");
          setEditingCategoryId(null); 
        }
      } else {
        // ADD MODE
        const response = await axios.post(
          "http://localhost:5000/api/category/add",
          { categoryName, categoryDescription },
          { headers: { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` } }
        );
        if (response.data.success) alert("Category added successfully");
      }
      setCategoryName("");
      setCategoryDescription("");
      fetchCategories(); 
    } catch (error) { 
      console.error("Operation failed", error);
      alert(error?.response?.data?.message || "Error processing request.");
    }
  };

  // === HANDLE DELETE ===
  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/category/${categoryId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` } }
        );
        if (response.data.success) {
          alert("Category deleted successfully");
          fetchCategories(); 
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category.");
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription || "");
  };

  const handleCancel = () => {
    setEditingCategoryId(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold text-gray-600">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Categories Management</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* === LEFT SIDE: FORM === */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-center text-xl font-bold mb-6 text-gray-700">
              {editingCategoryId ? "Edit Category" : "Add Category"}
            </h2>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input type="text" placeholder="e.g. Electronics" className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea placeholder="Short description..." className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} rows="3" />
              </div>
              
              <div>
                <button type="submit" className={`w-full rounded-md text-white p-3 font-semibold transition duration-200 shadow-md cursor-pointer ${editingCategoryId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {editingCategoryId ? "Save Changes" : "Add Category"}
                </button>
                {editingCategoryId && (
                  <button type="button" className="w-full mt-2 rounded-md bg-gray-500 text-white p-3 cursor-pointer hover:bg-gray-600 transition" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* === RIGHT SIDE: TABLE === */}
        <div className="lg:w-2/3">
            <div className="bg-white shadow-lg rounded-lg p-6 overflow-hidden">
                
                {/* === 3. NEW: Search Box Header === */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-gray-700">Category List</h2>
                    <input 
                      type="text" 
                      placeholder="Search categories..." 
                      className="border border-gray-300 rounded-md p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-300">
                      <thead>
                          <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                              <th className="py-3 px-6 text-center w-20 border border-gray-300">Sl No.</th>
                              <th className="py-3 px-6 text-left border border-gray-300">Category Name</th>
                              <th className="py-3 px-6 text-center w-40 border border-gray-300">Action</th>
                          </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                          {/* === 4. UPDATED: Map over filteredCategories === */}
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category, index) => (
                              <tr key={category._id} className="hover:bg-gray-50 transition">
                                  <td className="py-3 px-6 text-center font-bold border border-gray-200">{index + 1}</td>
                                  <td className="py-3 px-6 text-left whitespace-nowrap font-medium text-gray-800 border border-gray-200">{category.categoryName}</td>
                                  <td className="py-3 px-6 text-center border border-gray-200">
                                      <div className="flex item-center justify-center gap-2">
                                        <button className="bg-yellow-500 text-white px-3 py-1.5 rounded hover:bg-yellow-600 transition text-xs font-bold shadow-sm cursor-pointer" onClick={() => handleEdit(category)}>Edit</button>
                                        <button className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition text-xs font-bold shadow-sm cursor-pointer" onClick={() => handleDelete(category._id)}>Delete</button>
                                      </div>
                                  </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="3" className="text-center py-6 text-gray-500 italic border border-gray-200">
                                {searchTerm ? "No matching categories found." : "No categories found. Start by adding one!"}
                            </td></tr>
                          )}
                      </tbody>
                  </table>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
} 

export default Categories



