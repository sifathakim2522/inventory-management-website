import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth(); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;
        const userId = user._id || user.id; 
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
            const { name, email, address } = response.data.user;
            setFormData({ name, email, address: address || '', password: '' });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const userId = user._id || user.id;
        const token = localStorage.getItem('token');

        const response = await axios.put(
            `http://localhost:5000/api/users/${userId}`, 
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
            setMessage("✅ Profile updated successfully!");
            setFormData(prev => ({ ...prev, password: '' })); // Clear password
            setTimeout(() => setMessage(''), 3000);
        }
    } catch (error) {
        setMessage("❌ Failed to update profile.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input 
            type="text" name="name" value={formData.name} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input 
            type="email" name="email" value={formData.email} onChange={handleChange} disabled
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />
          <span className="text-xs text-gray-500">Email cannot be changed</span>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <textarea 
            name="address" value={formData.address} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-gray-700 font-medium mb-1">New Password</label>
          <input 
            type="password" name="password" value={formData.password} onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 mt-4"
        >
            Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
