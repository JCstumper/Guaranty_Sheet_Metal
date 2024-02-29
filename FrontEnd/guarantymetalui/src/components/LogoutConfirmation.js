import React from 'react'; // Import React to enable JSX syntax
import './LogoutConfirmation.css'; // Import CSS for styling the component

// Component to render a logout confirmation modal
const LogoutConfirmation = ({ isOpen, onConfirm, onCancel }) => {
    // If the modal is not open, don't render anything
    if (!isOpen) return null;

    // Rendering the modal content
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

export default LogoutConfirmation; // Export the component for use in other parts of the application
