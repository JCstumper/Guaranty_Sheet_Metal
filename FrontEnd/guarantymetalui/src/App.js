import React, {Fragment, useState, useEffect} from "react";
import './App.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import Orders from './Orders';
import Customers from './Customers';
import Inventory from './Inventory';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/LogoutConfirmation';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      
      const response = await fetch("http://localhost:3000/auth/verify", {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseRes = await response.json();

      // console.log(parseRes);

      parseRes === true ? setIsAuthenticated(true): setIsAuthenticated(false);

    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth()
  });

  return (
  <Fragment>
    <Router>
      <div className="container">
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} />) : (<Navigate to="/dashboard" />)} />
        <Route path="/register" element={!isAuthenticated ? (<Register setAuth={setAuth} />) : (<Login />)} />
        <Route path="/dashboard" element={isAuthenticated ? (<Dashboard setAuth={setAuth} />) : (<Navigate to="/login" />)} />
        <Route path="/orders" element={isAuthenticated ? (<Orders setAuth={setAuth} />) : (<Navigate to="/login" />)} />
        <Route path="/customers" element={isAuthenticated ? (<Customers setAuth={setAuth} />) : (<Navigate to="/login" />)} />
        <Route path="/inventory" element={isAuthenticated ? (<Inventory setAuth={setAuth} />) : (<Navigate to="/login" />)} />
        <Route path="/#" element={isAuthenticated ? (<Logout setAuth={setAuth} />) : (<Navigate to="/login" />)} />
      </Routes>
      </div>
    </Router>
  </Fragment>
  );
}


export default App;
