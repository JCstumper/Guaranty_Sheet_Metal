import React from 'react';
import './ButtonList.css'; // Your custom styles for the buttons

const ButtonList = ({ buttons }) => {
  return (
    <div className="button-list">
      {buttons.map((buttonLabel, index) => (
        <button key={index} className="list-button">
          {buttonLabel}
        </button>
      ))}
    </div>
  );
};

export default ButtonList;
