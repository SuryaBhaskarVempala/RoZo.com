import React, { createContext, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // State to hold plants data
    const [plantsData, setPlantsData] = useState([]); 
    const [loadingPlants, setLoadingPlants] = useState(true);


    // Login function
    const login = (userData) => {
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user,setUser, login, logout,plantsData, setPlantsData, loadingPlants, setLoadingPlants }}>
            {children}
        </AuthContext.Provider>
    );
};
