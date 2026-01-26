import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Users = () => {
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("user"); // Default role

  // Data & UI States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // === FETCH USERS ===
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` },
      });
      if(response.data.success) {
          setUsers(response.data.users);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users", error?.response?.status, error?.response?.data?.message, error);
      if (error?.response?.status === 401) {
        alert("Unauthorized. Please login again.");
      } else {
        alert(error?.response?.data?.message || "Error fetching users");
      }
      setLoading(false);
    }
  };

  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  // === FILTER LOGIC ===
  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === HANDLE SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, email, password, address, role };
      const headers = { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` };

      if (editingUserId) {
        // UPDATE MODE (Ideally, don't send password if empty to keep old one)
        // For simplicity, we are sending what is in the state. 
        // Backend should handle "if password empty, don't update it".
        await axios.put(`http://localhost:5000/api/users/${editingUserId}`, payload, { headers });
        alert("User updated successfully");
        setEditingUserId(null);
      } else {
        // ADD MODE
        await axios.post("http://localhost:5000/api/users/add", payload, { headers });
        alert("User added successfully");
      }
      
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Operation failed", error);
      alert(error?.response?.data?.message || "Error processing request.");
    }
  };

  // === HANDLE DELETE ===
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, { 
            headers: { Authorization: `Bearer ${localStorage.getItem('inventory-token')}` } 
        });
        alert("User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user.");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setName(user.name);
    setEmail(user.email);
    setAddress(user.address || "");
    setRole(user.role);
    setPassword(""); // Usually blank out password on edit for security
  };

  const resetForm = () => {
    setEditingUserId(null);
    setName("");
    setEmail("");
    setPassword("");
    setAddress("");
    setRole("user");
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold text-gray-600">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">User Management</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* === LEFT SIDE: FORM === */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-center text-xl font-bold mb-6 text-gray-700">
              {editingUserId ? "Edit User" : "Add New User"}
            </h2>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input type="text" placeholder="Full Name" className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input type="email" placeholder="example@mail.com" className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                    {editingUserId ? "Password (Leave blank to keep current)" : "Password"}
                </label>
                <input 
                    type="password" 
                    placeholder="******" 
                    className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required={!editingUserId} // Required only when adding new
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                <textarea placeholder="User Address..." className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition" value={address} onChange={(e) => setAddress(e.target.value)} rows="2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    className="border w-full p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition bg-white"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                </select>
              </div>
              
              <div className="pt-2">
                <button type="submit" className={`w-full rounded-md text-white p-3 font-semibold transition duration-200 shadow-md cursor-pointer ${editingUserId ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {editingUserId ? "Save Changes" : "Add User"}
                </button>
                {editingUserId && (
                  <button type="button" className="w-full mt-2 rounded-md bg-gray-500 text-white p-3 cursor-pointer hover:bg-gray-600 transition" onClick={resetForm}>
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
                
                {/* Search Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-gray-700">User List</h2>
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="border border-gray-300 rounded-md p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-gray-300">
                      <thead>
                          <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                              <th className="py-3 px-6 text-center w-16 border border-gray-300">Sl</th>
                              <th className="py-3 px-6 text-left border border-gray-300">Name</th>
                              <th className="py-3 px-6 text-left border border-gray-300">Email</th>
                              <th className="py-3 px-6 text-center border border-gray-300">Role</th>
                              <th className="py-3 px-6 text-center w-32 border border-gray-300">Action</th>
                          </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                              <tr key={user._id} className="hover:bg-gray-50 transition border-b border-gray-200">
                                  <td className="py-3 px-6 text-center font-bold border-r border-gray-200">{index + 1}</td>
                                  <td className="py-3 px-6 text-left font-medium text-gray-800 border-r border-gray-200">{user.name}</td>
                                  <td className="py-3 px-6 text-left border-r border-gray-200">{user.email}</td>
                                  <td className="py-3 px-6 text-center border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="py-3 px-6 text-center border-r border-gray-200">
                                      <div className="flex item-center justify-center gap-2">
                                          <button className="bg-yellow-500 text-white px-3 py-1.5 rounded hover:bg-yellow-600 transition text-xs font-bold shadow-sm cursor-pointer" onClick={() => handleEdit(user)}>Edit</button>
                                          <button className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition text-xs font-bold shadow-sm cursor-pointer" onClick={() => handleDelete(user._id)}>Del</button>
                                      </div>
                                  </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="5" className="text-center py-6 text-gray-500 italic border border-gray-200">
                                {searchTerm ? "No matching users found." : "No users found."}
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

export default Users;
