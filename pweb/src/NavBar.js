import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Make sure to create this CSS file
import logo from './logo.png'; // Update the path to where you store your logo image

function NavBar() {
    return (
        <nav className="navbar">
            <img src={logo} alt="Guaranty Sheet Metal & Roofing" className="navbar-logo" />
            <div className="navbar-links">
                <Link to="/Guaranty_Sheet_Metal" className="nav-link">Home</Link>
                <Link to="/Guaranty_Sheet_Metal/Deliverables" className="nav-link">Deliverables</Link>
                <Link to="/Guaranty_Sheet_Metal/Team" className="nav-link">Team</Link>
            </div>
        </nav>
    );
}

export default NavBar;
