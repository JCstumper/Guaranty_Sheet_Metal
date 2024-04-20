// ReturnPartModal.js
import React from 'react';
import './AddProduct.css'; // Ensure your path to the CSS is correct

const ReturnPartModal = ({ showModal, setShowModal, part, returnPartToNecessary }) => {
    if (!showModal) return null;

    const handleReturn = async () => {
        await returnPartToNecessary(part);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Confirm Return</h2>
                    <button onClick={handleCancel} className="modal-close-button">×</button>
                </div>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                    Are you sure you want to return this part to necessary inventory?
                </div>
                <div className="modal-actions">
                    <button onClick={handleReturn} className="btn-primary">Return to Necessary</button>
                    <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ReturnPartModal;
