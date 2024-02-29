import React, {Fragment, useState, useEffect} from "react"; // Import React and necessary hooks
import './App.css'; // Import the main stylesheet for global styles
// Import React Router components for navigation and routing
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all page components used in the app
import Dashboard from './Dashboard';
import Orders from './Orders';
import Customers from './Customers';
import Inventory from './Inventory';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/LogoutConfirmation';

function App() {
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to update authentication state
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  // Function to verify if the user is authenticated by checking a token in local storage
  async function isAuth() {
    try {
      // Send a GET request to verify the user's token
      const response = await fetch("http://localhost:3000/auth/verify", {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json(); // Parse the JSON response from the server

      // Update the authentication state based on the server's response
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } catch (err) {
      console.error(err.message); // Log any errors to the console
    }
  }

  // Use an effect to authenticate the user when the component mounts
  useEffect(() => {
    isAuth()
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Routes>
            {/* Route definitions, redirecting or granting access based on the authentication state */}
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} />) : (<Navigate to="/dashboard" />)} />
            <Route path="/register" element={!isAuthenticated ? (<Register setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/dashboard" element={isAuthenticated ? (<Dashboard setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/orders" element={isAuthenticated ? (<Orders setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/customers" element={isAuthenticated ? (<Customers setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/inventory" element={isAuthenticated ? (<Inventory setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/logout" element={isAuthenticated ? (<Logout setAuth={setAuth} />) : (<Navigate to="/login" />)} />
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App; // Export the App component for use in index.js
