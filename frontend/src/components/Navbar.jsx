// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isDriver, isCustomer } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white bg-opacity-30 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-indigo-600">AutoShare</Link>

      <ul className="flex space-x-6 items-center text-gray-700">
        <li><Link to="/" className="hover:text-indigo-500">Home</Link></li>
        {!isAuthenticated() && (
          <>
            <li><Link to="/about" className="hover:text-indigo-500">About</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-500">Contact</Link></li>
            <li><Link to="/login" className="hover:text-indigo-500">Login</Link></li>
            <li><Link to="/register" className="hover:text-indigo-500">Register</Link></li>
          </>
        )}
        {isAuthenticated() && isCustomer() && (
          <>
            <li><Link to="/booking" className="hover:text-indigo-500">Book Ride</Link></li>
            <li><Link to="/customer-dashboard" className="hover:text-indigo-500">Dashboard</Link></li>
            <li><Link to="/review" className="hover:text-indigo-500">Reviews</Link></li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                Logout
              </button>
            </li>
          </>
        )}
        {isAuthenticated() && isDriver() && (
          <>
            <li><Link to="/driver-dashboard" className="hover:text-indigo-500">Dashboard</Link></li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
