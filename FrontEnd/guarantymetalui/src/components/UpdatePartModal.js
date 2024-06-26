import React from 'react';
import './AddProduct.css'; 

const UpdatePartModal = ({ showModal, setShowModal, part, updatePart }) => {
    if (!showModal) return null;

    const handleCancel = () => {
        setShowModal(false); 
    };

    const handleSave = async () => {
        await updatePart(part); 
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Confirm Part Update</h2>
                    <button onClick={handleCancel} className="modal-close-button">×</button>
                </div>
                <div className="modal-body">
                    Update the part with the new quantity of {part.newQuantity}?
                </div>
                <div className="modal-actions">
                    <button onClick={handleSave} className="btn-primary">
                        Update
                    </button>
                    <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default UpdatePartModal;
