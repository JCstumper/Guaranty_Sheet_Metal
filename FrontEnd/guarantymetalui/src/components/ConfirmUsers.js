// ConfirmUsers.js
import React from 'react';
import './ConfirmUsers.css'; // CSS file for styling the components

/**
 * A modal component that confirms an action from the user.
 * 
 * @param {Object} props The component props
 * @param {boolean} props.isOpen Determines if the modal is open
 * @param {Function} props.onClose Function to call when closing the modal
 * @param {Function} props.onConfirm Function to call when the action is confirmed
 * @param {React.ReactNode} props.children React children that are displayed in the body of the modal
 * @returns {React.ReactNode|null} The Modal component or null if not open
 */
const ConfirmModal = ({ isOpen, onClose, onConfirm, children }) => {
    // If the modal is not open, do not render anything
    if (!isOpen) return null;

    // The rendered modal structure
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Confirm Action</h2>
                    <button onClick={onClose} className="modal-close-button">X</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-button">Confirm</button>
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
