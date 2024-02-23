import React from 'react';
import './ButtonList.css'; // Styles for the buttons
import { Link } from 'react-router-dom';

const ButtonList = ({ buttons, activeTab, setActiveTab }) => {
  const buttonPaths = {
    DASH: '/dashboard',
    INVENTORY: '/inventory',
    ORDERS: '/orders',
    CUSTOMERS: '/customers',
  };

  return (
    <div className="button-list">
      {buttons.map((button) => {
        const isActive = button === activeTab;
        const className = isActive ? 'list-button active' : 'list-button';
        const path = buttonPaths[button];

        return (
          <Link to={path} key={button} className={className} onClick={() => setActiveTab(button)}>
            {button}
          </Link>
        );
      })}
    </div>
  );
};

export default ButtonList;

