import React, {Fragment, useState, useEffect} from "react"; // Import React and necessary hooks
import './App.css'; // Import the main stylesheet for global styles
// Import React Router components for navigation and routing
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all page components used in the app
import Dashboard from './Dashboard';
import Orders from './Orders';
import Customers from './Customers';
import Inventory from './Inventory';
import Settings from './Settings';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/LogoutConfirmation';
import Loading from './components/Loading';

function App() {
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  // Function to update authentication state
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  // Function to verify if the user is authenticated by checking a token in local storage
  async function isAuth() {
    try {
      // Send a GET request to verify the user's token
      const response = await fetch("https://localhost/api/auth/verify", {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json(); // Parse the JSON response from the server

      // Update the authentication state based on the server's response
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

      if (response.status === 401 && parseRes.message === "jwt expired") {
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
  setIsLoading(false); // Update isLoading after 3 seconds

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
            {isLoading ? (
              <Loading />
            ) : (
            <Routes>
              {/* Route definitions, redirecting or granting access based on the authentication state */}
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} setIsLoading={setIsLoading} />) : (<Navigate to="/dashboard" />)} />
              <Route path="/register" element={!isAuthenticated ? (<Register setAuth={setAuth} setIsLoading={setIsLoading}/>) : (<Navigate to="/login" />)} />
              <Route path="/dashboard" element={<ProtectedRoute>{isAuthenticated ? (<Dashboard setAuth={setAuth} setIsLoading={setIsLoading}/> ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
              <Route path="/purchases" element={<ProtectedRoute>{isAuthenticated ? (<Orders setAuth={setAuth} setIsLoading={setIsLoading}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>}  />
              <Route path="/jobs" element={<ProtectedRoute>{isAuthenticated ? (<Customers setAuth={setAuth} setIsLoading={setIsLoading}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
              {/* <Route path="/inventory" element={isAuthenticated ? (<Inventory setAuth={setAuth} />) : (<Navigate to="/login" />)} /> */}
              <Route path="/inventory" element={<ProtectedRoute>{isAuthenticated ? (<Inventory setAuth={setAuth} setIsLoading={setIsLoading}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute>{isAuthenticated ? (<Settings setAuth={setAuth} setIsLoading={setIsLoading}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
              <Route path="/logout" element={isAuthenticated ? (<Logout setAuth={setAuth} setIsLoading={setIsLoading}/>) : (<Navigate to="/login" />)} />
            </Routes>
            )}
          </div>
        </Router>
    </Fragment>
  );
}

export default App; // Export the App component for use in index.js
