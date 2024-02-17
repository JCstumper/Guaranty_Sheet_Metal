import React from 'react';
import './HomePage.css'; // Make sure to import the CSS file
import logo from "./pictures/logo.png"
import ButtonList from './components/ButtonList';

const buttons = ['ABOUT', 'PRODUCTS', 'GALLERY', 'SERVICES', 'CONTACT US']; // Add more button labels as needed

const Header = () => {
    return (
      <header className='header-container'>
        <a href="/">
          <img src={logo} alt="Icon" className="header-image" />
        </a>
        <ButtonList buttons={buttons} />
      {/* ... other components ... */}
      </header>
    );
  };
  

export default Header;