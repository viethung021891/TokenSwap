// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token; // Convert token to a boolean for the condition

    return isAuthenticated ? children : <Navigate to="/login" replace />;

};

export default PrivateRoute;
