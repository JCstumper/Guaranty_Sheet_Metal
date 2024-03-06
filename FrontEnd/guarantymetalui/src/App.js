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

      if (response.status === 401 && parseRes.message === "jwt expired") {
        // Handle JWT expiration error here
        // Redirect the user to the login page or display a message
        // Example: history.push('/login');
        setIsAuthenticated(false);
        return <Navigate to="/login" />;
      }

    } catch (err) {
      console.error(err.message); // Log any errors to the console
    }
  }

  // Update to immediate state update based on localStorage
useEffect(() => {
  const token = localStorage.getItem('token');
  setIsAuthenticated(!!token); // Boolean conversion: true if token exists, false otherwise
  isAuth(); // Then verify with the backend for token validity
}, []);

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Immediate check based on token presence
  // You might want to include a loading state here to wait for the `isAuth` verification to complete
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Routes>
            {/* Route definitions, redirecting or granting access based on the authentication state */}
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} />) : (<Navigate to="/dashboard" />)} />
            <Route path="/register" element={!isAuthenticated ? (<Register setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard setAuth={setAuth} /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders setAuth={setAuth} /></ProtectedRoute>}  />
            <Route path="/customers" element={<ProtectedRoute><Customers setAuth={setAuth} /></ProtectedRoute>} />
            {/* <Route path="/inventory" element={isAuthenticated ? (<Inventory setAuth={setAuth} />) : (<Navigate to="/login" />)} /> */}
            <Route path="/inventory" element={<ProtectedRoute><Inventory setAuth={setAuth} /></ProtectedRoute>} />
            <Route path="/logout" element={isAuthenticated ? (<Logout setAuth={setAuth} />) : (<Navigate to="/login" />)} />
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App; // Export the App component for use in index.js
