import React from 'react';
import './HomePage.css'; // Make sure to import the CSS file
import logo from "./pictures/logo.png"
import account from "./pictures/testacc.png"
import ButtonList from './components/ButtonList';

const buttons = ['DASH', 'INVENTORY', 'ORDERS', 'CUSTOMERS'];

const Sidebar = () => {
    return (
      <aside className='sidebar-container'>
        <a href="/">
          <img src={logo} alt="Icon" className="sidebar-image" />
        </a>
        <ButtonList buttons={buttons} />
        <button className="Account">
          <img src={account} alt="Person" style={{ width: '100%', height: 'auto' }} />
        </button>
      </aside>
    );
};
  

export default Sidebar;