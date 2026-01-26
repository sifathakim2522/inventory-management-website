import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Root from './utils/Root'
import Login from './pages/Login'

import ProtectedRoutes from './utils/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import Categories from './components/Categories'
import Suppliers from './components/Suppliers'
import Products from './components/Products'
import Users from './components/Users'
import Orders from './components/order'
import Profile from './components/profile'
import DashboardHome from './components/dashboard'

function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root/>}/>
        <Route path="/admin/dashboard/" 
        element={
        <ProtectedRoutes requireRole={['admin']}>
          <Dashboard/>
        </ProtectedRoutes>
        }
        >
           <Route 
             index
             element={<DashboardHome/>}
           />

           <Route 
              path="Categories"
             element={<Categories/>}
           />
           <Route 
              path="Products"
             element={<Products/>}
           />
           <Route 
              path="Suppliers"
             element={<Suppliers/>}
           />
           <Route 
              path="Orders"
             element={<Orders/>}
           />
           <Route 
              path="Users"
             element={<Users/>}
           />
           <Route 
              path="Profile"
             element={<Profile/>}
           />
           <Route 
              path="Logout"
             element={<h1>Logout</h1>}
           />







        </Route>
        <Route path="/customer/dashboard" element={<h1>customer dashboard</h1>}/>
        <Route path="/login" element={<Login/>}/>
         <Route path="/unauthorized" element={<p className='front-bold text-3xl mt-20 ml-20'>Unauthorized</p>}/>
      </Routes>
    </Router>
  )
}
export default App
