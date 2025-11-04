import React from 'react';
import ListToken from './components/ListToken';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './Login';
import UserProfile from './components/UserProfile';

const App = () => {
  // const token = localStorage.getItem('token');
  // const isAuthenticated = !!token; // Convert token to a boolean for the condition
  return (<Router>
    {/* {isAuthenticated && (<UserProfile />)} */}
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
            <ListToken />
          // <PrivateRoute>
          //   <ListToken />
          // </PrivateRoute>
        }
      />
      {/* Catch-all route for unknown paths to redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
  );
};

export default App;