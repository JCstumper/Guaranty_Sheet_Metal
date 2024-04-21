
import React from 'react';
import './AddProduct.css'; 

const ConfirmModal = ({ isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) return null;

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
