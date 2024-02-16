import React, { useState } from 'react';

const DropdownMenu: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility on mouse enter/leave
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div 
      onMouseEnter={toggleVisibility} 
      onMouseLeave={toggleVisibility} 
      style={{ position: 'relative', display: 'inline-block' }}
    >
       <button style={{
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: '0',
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
        opacity:  0, // Button is fully visible when the dropdown is visible
      }}>
        Services
      </button>
      {isVisible && (
        <div 
          style={{ 
            position: 'absolute', 
            left: 0, 
            backgroundColor: '#f9f9f9', 
            minWidth: '160px', 
            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', 
            zIndex: 1 
          }}
        >
          <a href="#" style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Link 1</a>
          <a href="#" style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Link 2</a>
          <a href="#" style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Link 3</a>
          {/* Add more links as needed */}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
