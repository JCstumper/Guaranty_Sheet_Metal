// import React from 'react';
import React, {Fragment, useState} from "react";
import './App.css';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
// import HomePage from './HomePage';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate replace to="/login" />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/home" element={<HomePage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import Dashboard from './components/Dashboard';
// import Login from './components/Login';
import Register from './components/Register';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
  <Fragment>
    <Router>
      <div className="container">
      <Routes>
        {/* <Route exact path="/login" element={<LoginPage />} /> */}
        <Route exact path="/login" element={!isAuthenticated ? (<LoginPage setAuth={setAuth} />) : (<Navigate to="/dashboard" />)} />
        {/* <Route exact path="/register" element={<Register />} /> */}
        <Route exact path="/register" element={!isAuthenticated ? (<Register setAuth={setAuth} />) : (<Navigate to="/login" />)} />
        {/* <Route exact path="/dashboard" element={<Dashboard />} /> */}
        <Route exact path="/dashboard" element={isAuthenticated ? (<Dashboard setAuth={setAuth} />) : (<Navigate to="/login" />)} />
      </Routes>
      </div>
    </Router>
  </Fragment>
  );
}


export default App;
