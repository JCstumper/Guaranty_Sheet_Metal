import React, { useState } from 'react';
import './HomePage.css';
import logo from "./pictures/logo.png";
import account from "./pictures/testacc.png";
import ButtonList from './components/ButtonList';

const buttons = ['DASH', 'INVENTORY', 'ORDERS', 'CUSTOMERS'];

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState(buttons[0]); // Default to the first button as active

    return (
      <aside className='sidebar-container'>
        <a href="/">
          <img src={logo} alt="Icon" className="sidebar-image" />
        </a>
        <ButtonList buttons={buttons} activeTab={activeTab} setActiveTab={setActiveTab} />
        <button className="Account">
          <img src={account} alt="Person" style={{ width: '100%', height: 'auto' }} />
        </button>
      </aside>
    );
};
  
export default Sidebar;
