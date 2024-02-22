import React from 'react';
import './ButtonList.css'; // Styles for the buttons

const ButtonList = ({ buttons, activeTab, setActiveTab }) => {
  return (
    <div className="button-list">
      {buttons.map((button) => {
        // Check if this button is the active tab
        const isActive = button === activeTab;
        const className = isActive ? 'list-button active' : 'list-button';

        return (
          <button
            key={button}
            className={className}
            onClick={() => setActiveTab(button)} // Set this button as active when clicked
          >
            {button}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonList;
