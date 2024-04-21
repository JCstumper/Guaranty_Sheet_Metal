import React from 'react';
import './AddProduct.css'; 

const RemoveUsedPartModal = ({ showModal, setShowModal, part, onConfirm }) => {
    if (!showModal || !part) return null;

    const handleConfirm = () => {
        onConfirm(part.id); 
        setShowModal(false); 
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Confirm Removal</h2>
                    <button onClick={handleCancel} className="modal-close-button">×</button>
                </div>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                    Are you sure you want to remove this part from used inventory?
                </div>
                <div className="modal-actions">
                    <button onClick={handleConfirm} className="btn-primary">Remove Part</button>
                    <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default RemoveUsedPartModal;
