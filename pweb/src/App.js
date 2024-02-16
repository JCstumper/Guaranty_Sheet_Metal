import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="/Guaranty_Sheet_Metal" element={<Home />} />
        <Route path="/Guaranty_Sheet_Metal/Deliverables" element={<Deliverables />} />
        <Route path="/Guaranty_Sheet_Metal/Team" element={<Team />} />
      </Routes>
    </Router>
  );
}

export default App;
