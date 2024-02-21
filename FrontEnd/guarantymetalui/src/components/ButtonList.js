import React from 'react';
import './ButtonList.css'; //styles for the buttons

const ButtonList = ({ buttons }) => {
  return (
    <div className="button-list">
      {buttons.map((button, index) => {
        // Determine if the button is a React element (e.g., your image button)
        const isReactElement = React.isValidElement(button);
        
        // Extract className if it's a React element, otherwise default to 'list-button'
        const className = isReactElement && button.props.className ? button.props.className : 'list-button';

        return (
          // Apply the extracted or default className to the button
          <button key={index} className={className}>
            {/* Render the button content. If it's a React element, render as is; otherwise, treat as text */}
            {isReactElement ? button : button}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonList;
