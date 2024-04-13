import React from 'react';
import './AddProduct.css'; // Assuming this file is already included for modal styling

const LogoutConfirmation = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Log Out</h2> {/* Adjust or remove if you prefer no header */}
                </div>
                <div className="modal-body" style={{ textAlign: 'center' }}> {/* Inline style for text alignment */}
                    <p style={{ fontSize: '20px' }}><strong>Are you sure you want to log out?</strong></p>
                </div>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="btn-primary">Log Out</button>
                    <button onClick={onCancel} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmation;
