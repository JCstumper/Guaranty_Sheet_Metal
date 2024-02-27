import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Deliverables from './Deliverables';
import Team from './Team';
import './App.css';

function App() {
  return (
    <Router>
      <NavBar /> {/* This includes the NavBar on every page */}
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Deliverables" element={<Deliverables />} />
        <Route path="/Team" element={<Team />} />
      </Routes>
    </Router>
  );
}

export default App;
