import React from 'react';

function Logout() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out');
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
