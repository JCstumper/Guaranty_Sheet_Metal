import React from 'react';
import './HomePage.css'; // Make sure to import the CSS file
import logo from "./pictures/logo.png"
import dashboard from "./pictures/das.png"
import ButtonList from './components/ButtonList';

const buttons = [<img src={dashboard} alt="dashboard" className='dash-image'/> , 'PRODUCTS', 'GALLERY', 'SERVICES', 'CONTACT US']; // Add more button labels as needed

const Sidebar = () => {
    return (
      <sidebar className='sidebar-container'>
        <a href="/">
          <img src={logo} alt="Icon" className="sidebar-image" />
        </a>
        <ButtonList buttons={buttons} />
      {
        
      }
      </sidebar>
    );
  };
  

export default Sidebar;