// ConfirmUsers.js
import React from 'react';
import './AddProduct.css'; // CSS file for styling the components


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
                    <button onClick={onConfirm} className="btn-primary">Confirm</button>
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
