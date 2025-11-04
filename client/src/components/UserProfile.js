// UserProfile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();

    // Fetch the username from local storage or replace with actual user data logic
    const username = localStorage.getItem('username') || '';

    const handleLogout = () => {
        // Clear token and username from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="user-profile">
            {username && (<p>Welcome, {username}!</p>)}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserProfile;
