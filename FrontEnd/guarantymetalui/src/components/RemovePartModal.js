// RemovePartModal.js
import React from 'react';
import './AddProduct.css'; // Ensure this path matches your CSS file location

const RemovePartModal = ({ showModal, setShowModal, partId, removePart }) => {
    if (!showModal) return null;

    const handleRemove = async () => {
        await removePart(partId);
        setShowModal(false); // Close the modal after action
    };

    const handleCancel = () => {
        setShowModal(false); // Close the modal without action
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Confirm Removal</h2>
                    <button onClick={handleCancel} className="modal-close-button">×</button>
                </div>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                    Are you sure you want to remove this part?
                </div>
                <div className="modal-actions">
                    <button onClick={handleRemove} className="btn-primary">Remove</button>
                    <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default RemovePartModal;
