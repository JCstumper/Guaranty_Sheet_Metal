import React, {Fragment, useState, useEffect, createContext} from "react"; // Import React and necessary hooks
import './App.css'; // Import the main stylesheet for global styles
// Import React Router components for navigation and routing
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

// Import all page components used in the app
import Dashboard from './Dashboard';
import Orders from './Orders';
import Customers from './Customers';
import Logs from './Logs';
import Inventory from './Inventory';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/LogoutConfirmation';
import Loading from './components/Loading';
import NotFound from './components/NotFound';

export const AppContext = createContext();

function App() {
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

  // Function to update authentication state
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const isAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setIsAuthenticated(false);
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adjust based on how your server expects to receive the token
            },
        });

        const parseRes = await response.json();

        if (response.ok) {
            // Update your context/state as needed based on the response
            setIsAuthenticated(true);
            // Optionally, update user roles or other relevant state here
            return true;
        } else {
            setIsAuthenticated(false);
            localStorage.removeItem('token'); // Consider removing the token if it's invalid
            return false;
        }
    } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        return false;
    }
};


  
  
  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decodedToken.exp < currentTime) {
        setIsTokenExpired(true);
        localStorage.removeItem("token");
        setAuth(false); 
        // Optionally, handle token expiration (e.g., redirect to login page)
      } else {
        setIsTokenExpired(false);
        setAuth(true);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      // Handle error (e.g., token might be malformed)
    }
  };

 

const [userRoles, setUserRoles] = useState([]);


  return (
    <AppContext.Provider value={{API_BASE_URL, isAuthenticated, userRoles, setIsAuthenticated, setUserRoles}}>
      <Fragment>
          <Router>
            <div className="container">
              {isLoading ? (
                <Loading />
              ) : (
              <Routes>
                {/* Route definitions, redirecting or granting access based on the authentication state */}
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} setIsLoading={setIsLoading}/>) : (<Navigate to="/dashboard" />)} />
                <Route path="/register" element={!isAuthenticated ? (<Register setAuth={setAuth}/>) : (<Navigate to="/login" />)} />
                <Route path="/dashboard" element={<ProtectedRoute>{isAuthenticated ? (<Dashboard setAuth={setAuth}/> ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
                <Route path="/purchases" element={<ProtectedRoute>{isAuthenticated ? (<Orders setAuth={setAuth}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>}  />
                <Route path="/jobs" element={<ProtectedRoute>{isAuthenticated ? (<Customers setAuth={setAuth}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute>{isAuthenticated ? (<Inventory setAuth={setAuth}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
                <Route path="/Logs" element={<ProtectedRoute>{isAuthenticated ? (<Inventory setAuth={setAuth}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>} />


                <Route path="/logout" element={isAuthenticated ? (<Logout setAuth={setAuth}/>) : (<Navigate to="/login" />)} />
                <Route path="/*" element={isAuthenticated ? (<NotFound setAuth={setAuth}/>) : (<Navigate to="/login" />)} />
              </Routes>
              )}
            </div>
          </Router>
      </Fragment>
    </AppContext.Provider>
  );
}

export default App; // Export the App component for use in index.js
