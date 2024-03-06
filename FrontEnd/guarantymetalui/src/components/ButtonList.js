import React from 'react'; // Import React library for building UI components
import './ButtonList.css'; // Import specific styles for the button list
import { Link } from 'react-router-dom'; // Import Link component for navigation without full page reloads
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople } from 'react-icons/md'; // Import specific icons

const ButtonList = ({ buttons, activeTab, setActiveTab }) => {
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
            {icon}
          </Link>
        );
      })}
    </div>
  );
};

export default ButtonList;
