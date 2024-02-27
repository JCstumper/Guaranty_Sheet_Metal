import React from 'react';
import './LogoutConfirmation.css'; // Ensure you have the CSS file with this name

const LogoutConfirmation = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="logout-confirmation-overlay">
            <div className="logout-confirmation-container">
                <div className="logout-message-container">
                    <p>Are you sure you want to log out?</p>
                </div>
                <div className="logout-action-buttons">
                    <button onClick={onConfirm} className="confirm-logout-button">Log Out</button>
                    <button onClick={onCancel} className="cancel-logout-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmation;
