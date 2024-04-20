import React from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css'; // Ensure correct path

const ConfirmMoveToUsedModal = ({ showModal, setShowModal, movePartToUsed, partDetails }) => {
    if (!showModal) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Confirm Move</h2>
                    <button onClick={() => setShowModal(false)} className="modal-close-button">×</button>
                </div>
                <div className="modal-body">
                    Are you sure you want to move part <strong>{partDetails.part_number}</strong> to used?
                </div>
                <div className="modal-actions">
                    <button onClick={() => {
                        movePartToUsed(partDetails);
                        setShowModal(false);
                    }} className="btn-primary">Confirm</button>
                    <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmMoveToUsedModal;
