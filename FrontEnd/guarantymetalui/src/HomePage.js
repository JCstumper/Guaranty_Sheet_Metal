import React from 'react';
import './HomePage.css'; // Make sure to import the CSS file
import logo from "./pictures/logo.png"
import account from "./pictures/testacc.png"
import ButtonList from './components/ButtonList';

const buttons = ['DASH', 
                'INVENTORY', 
                'ORDERS', 
                'CUSTOMERS', 
                <img src= {account} alt="Person" className= "Account" style={{ width: '100%', height: 'auto' }}/>
                ] // Add more button labels as needed

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