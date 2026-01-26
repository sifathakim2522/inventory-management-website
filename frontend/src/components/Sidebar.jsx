import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaCog, FaBox, FaShoppingCart, FaSignOutAlt, FaTable, FaTruck, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome />, isparent: true },
    { name: "Categories", path: "/admin/dashboard/Categories", icon: <FaTable />, isparent: false },
    { name: "Products", path: "/admin/dashboard/Products", icon: <FaBox />, isparent: false },
    { name: "Suppliers", path: "/admin/dashboard/Suppliers", icon: <FaTruck />, isparent: false },
    { name: "Orders", path: "/admin/dashboard/Orders", icon: <FaShoppingCart />, isparent: false },
    { name: "Users", path: "/admin/dashboard/Users", icon: <FaUsers />, isparent: false },
    { name: "Profile", path: "/admin/dashboard/Profile", icon: <FaCog />, isparent: false },
  ];

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
  };

  return (
    // THEME: Vertical Gradient from Dark Gray (900) to Slightly Lighter Gray (800)
    <div className='flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-gray-100 w-16 md:w-64 fixed top-0 left-0 transition-all duration-300 z-50 border-r border-gray-800 shadow-2xl'>
      
      {/* Header with Purple Accent Text */}
      <div className='h-20 flex items-center justify-center border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-sm'>
        <span className='hidden md:block text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent'>
            Inventory MS
        </span>
        <span className='md:hidden text-xl font-bold text-purple-500'>IMS</span>
      </div>

      <div className='flex-1 overflow-y-auto py-6'>
        <ul className='space-y-2 px-3'>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                end={item.isparent}
                to={item.path}
                className={({ isActive }) => 
                  // THEME: Active state uses Purple-600 with a Glow Effect (Shadow)
                  (isActive 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40 border border-purple-500/30 " 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent ") + 
                  "flex items-center p-3 rounded-xl transition-all duration-200 gap-x-4 group font-medium"
                }
              >
                {/* Icon scales up slightly on hover */}
                <span className='text-xl transition-transform group-hover:scale-110'>{item.icon}</span>
                <span className='hidden md:block'>{item.name}</span>
              </NavLink>
            </li>
          ))}
          
          {/* Logout Button */}
          <li className="mt-10 pt-4 border-t border-gray-800 mx-2">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-200 gap-x-4 group border border-transparent hover:border-red-500/20"
            >
                 <span className='text-xl group-hover:rotate-12 transition-transform'><FaSignOutAlt /></span>
                 <span className='hidden md:block font-medium'>Logout</span>
            </button>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
