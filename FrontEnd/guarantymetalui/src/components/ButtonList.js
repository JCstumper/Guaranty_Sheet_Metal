import React from 'react'; // Import React library for building UI components
import './ButtonList.css'; // Import specific styles for the button list
import { Link } from 'react-router-dom'; // Import Link component for navigation without full page reloads
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople } from 'react-icons/md'; // Import specific icons from react-icons library

// Define and export the ButtonList functional component with props
const ButtonList = ({ buttons, activeTab, setActiveTab, isCollapsed }) => {
  // Object mapping button names to their respective navigation paths
  const buttonPaths = {
    HOME: '/dashboard',
    INVENTORY: '/inventory',
    ORDERS: '/orders',
    CUSTOMERS: '/customers',
  };

  // Object mapping button names to their respective icons
  const buttonIcons = {
    HOME: <MdDashboard />,
    INVENTORY: <MdInventory />,
    ORDERS: <MdShoppingCart />,
    CUSTOMERS: <MdPeople />,
  };

  // Render the button list
  return (
    <div className="button-list">
      {buttons.map((button) => { // Map each button to a Link component
        const isActive = button === activeTab; // Determine if the button is the active tab
        const className = isActive ? 'list-button active' : 'list-button'; // Set class based on active state
        const path = buttonPaths[button]; // Get the navigation path for the button
        const icon = buttonIcons[button]; // Get the icon for the button

        // Return a Link component for each button
        return (
          <Link to={path} key={button} className={className} onClick={() => setActiveTab(button)}>
            {isCollapsed ? icon : button}
          </Link>
        );
      })}
    </div>
  );
};

export default ButtonList; // Export the ButtonList component for use in other parts of the app
