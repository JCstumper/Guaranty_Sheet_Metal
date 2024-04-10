import React, {Fragment, useState, useEffect, createContext} from "react"; // Import React and necessary hooks
import './App.css'; // Import the main stylesheet for global styles
// Import React Router components for navigation and routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

  // Function to verify if the user is authenticated by checking a token in local storage
  async function isAuth() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json();

      if (parseRes.isAuthenticated) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRoles', JSON.stringify(parseRes.roles)); // Assuming roles are part of the response
      } else {
        localStorage.setItem('isAuthenticated', 'false');
        localStorage.removeItem('userRoles'); // Clear roles if not authenticated
      }

      // Handle JWT expiration
      if (response.status === 401 && parseRes.message === "jwt expired") {
        localStorage.setItem('isAuthenticated', 'false');
        localStorage.removeItem('userRoles'); // Ensure roles are cleared if JWT is expired
        // Redirect logic here won't work as expected; consider handling redirection in UI logic
      }

    } catch (err) {
      console.error(err.message);
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('userRoles');
    }
}
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

  // Update to immediate state update based on localStorage
  useEffect(() => {
  const token = localStorage.getItem('token');

  if(token && token !== '') {
    checkTokenExpiration(token);
  }

  isAuth(); // Then verify with the backend for token validity
  setIsLoading(false); // Update isLoading after 3 seconds

}, []);

// ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  let userRoles = jwtDecode(localStorage.getItem('token'));

  if (userRoles = []){
    <Navigate to="/unauthorized" />;
  }


  const isAuthorized = isAuthenticated && allowedRoles.some(role => userRoles.includes(role));

  return isAuthorized ? children : <Navigate to="/unauthorized" />;
};
return (
  <AppContext.Provider value={{API_BASE_URL}}>
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
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin']}>{isAuthenticated ? (<Dashboard setAuth={setAuth}/> ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
              <Route path="/purchases" element={<ProtectedRoute allowedRoles={['admin']}>{isAuthenticated ? (<Orders setAuth={setAuth}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>}  />
              <Route path="/jobs" element={<ProtectedRoute allowedRoles={['admin']}>{isAuthenticated ? (<Customers setAuth={setAuth}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute allowedRoles={['admin']}>{isAuthenticated ? (<Inventory setAuth={setAuth}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
              <Route path="/logs" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Logs />
                </ProtectedRoute>
              } />
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
