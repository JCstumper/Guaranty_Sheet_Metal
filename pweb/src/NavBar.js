import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from './logo.png';

function NavBar() {
    return (
        <nav className="navbar">
            <img src={logo} alt="Guaranty Sheet Metal & Roofing" className="navbar-logo" />
            <div className="navbar-links">
                <Link to="/Home" className="nav-link">Home</Link>
                <Link to="/Documentation" className="nav-link">App Documentation</Link>
                <Link to="/Deliverables" className="nav-link">Deliverables</Link>
                <Link to="/Team" className="nav-link">Team</Link>
            </div>
        </nav>
    );
}

export default NavBar;
