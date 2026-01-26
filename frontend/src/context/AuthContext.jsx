import { createContext,useState,useContext, useEffect } from "react";
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const[user,setUser]=useState(() => {
        const storedUser = localStorage.getItem("inventory-user");
        return storedUser ? JSON.parse(storedUser) : null;
    })
    // Set axios default header on initial load if token exists
    useEffect(() => {
        const token = localStorage.getItem('inventory-token');
        if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Setup interceptor to auto logout on 401
        const id = axios.interceptors.response.use(
            response => response,
            (error) => {
                if (error?.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(id);
    }, []);
    const login = (userData,token) => {
        setUser(userData);
        localStorage.setItem("inventory-user", JSON.stringify(userData));
        localStorage.setItem("inventory-token", token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem("inventory-user");
        localStorage.removeItem("inventory-token");
        delete axios.defaults.headers.common['Authorization'];
    }
    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () =>  useContext(AuthContext);

export default AuthProvider;
    
