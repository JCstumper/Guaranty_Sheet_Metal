import React from 'react';
import './ButtonList.css'; // Styles for the buttons
import { Link } from 'react-router-dom';
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople } from 'react-icons/md'; // Example icons

const ButtonList = ({ buttons, activeTab, setActiveTab, isCollapsed }) => {
  const buttonPaths = {
    HOME: '/dashboard',
    INVENTORY: '/inventory',
    ORDERS: '/orders',
    CUSTOMERS: '/customers',
  };

  const buttonIcons = {
    HOME: <MdDashboard />,
    INVENTORY: <MdInventory />,
    ORDERS: <MdShoppingCart />,
    CUSTOMERS: <MdPeople />,
  };

  return (
    <div className="button-list">
      {buttons.map((button) => {
        const isActive = button === activeTab;
        const className = isActive ? 'list-button active' : 'list-button';
        const path = buttonPaths[button];
        const icon = buttonIcons[button];

        return (
          <Link to={path} key={button} className={className} onClick={() => setActiveTab(button)}>
            {isCollapsed ? icon : button}
          </Link>
        );
      })}
    </div>
  );
};

export default ButtonList;
