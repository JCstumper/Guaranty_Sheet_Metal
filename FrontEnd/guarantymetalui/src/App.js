import React, {Fragment, useState, useEffect, createContext} from "react"; 
import './App.css'; 

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


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
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json(); 

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

      if (response.status === 401 && parseRes.message === "jwt expired") {
        setIsAuthenticated(false);
        return <Navigate to="/login" />;
      }

    } catch (err) {
      console.error(err.message); 
    }
  }
  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
      if (decodedToken.exp < currentTime) {
        setIsTokenExpired(true);
        localStorage.removeItem("token");
        setAuth(false); 
      } else {
        setIsTokenExpired(false);
        setAuth(true);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      
    }
  };

  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token && token !== '') {
      checkTokenExpiration(token);
    }
    
    isAuth(); 
    setIsLoading(false); 
  }, []);


const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let userRoles = '';

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRoles = decodedToken.role ? decodedToken.role : '';
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  if (!token) {
    return <Navigate to="/unauthorized" />;
  }

  let isAuthorized = false;
  if (allowedRoles.length === 0) {
    isAuthorized = isAuthenticated;
  } else {
    if(allowedRoles === userRoles) {
      isAuthorized = true;
    }
  }

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
              <Route path="/dashboard" element={isAuthenticated ? (<Dashboard setAuth={setAuth}/> ) : (<Navigate to="/login" />)} />
              <Route path="/purchases" element={isAuthenticated ? (<Orders setAuth={setAuth}/>  ) : (<Navigate to="/login" />)}  />
              <Route path="/jobs" element={isAuthenticated ? (<Customers setAuth={setAuth}/>  ) : (<Navigate to="/login" />)} />
              <Route path="/inventory" element={isAuthenticated ? (<Inventory setAuth={setAuth}/>  ) : (<Navigate to="/login" />)} />
              <Route path="/logs" element={<ProtectedRoute allowedRoles={'admin'}>{isAuthenticated ? (<Logs setAuth={setAuth}/>  ) : (<Navigate to="/login" />)}</ProtectedRoute>} />
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

export default App; 
