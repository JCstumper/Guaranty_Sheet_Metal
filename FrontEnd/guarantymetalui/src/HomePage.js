import React from 'react';
import logo from './pictures/logo.png'; // Adjust the path according to where you placed the logo

function Header() {
  return (
    <header>
      <nav>
        <a href="/">
        <img src={logo} alt="Logo" className="logo" />
        </a>
        {/* Rest of the navigation items */}
      </nav>
    </header>
  );
}

export default Header;
