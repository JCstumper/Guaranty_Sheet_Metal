import React from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css'; 

const RemoveEstimateModal = ({ showModal, setShowModal, jobId, fetchJobs, API_BASE_URL }) => {
    if (!showModal) return null;

    const handleRemoveEstimate = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/jobs/remove-estimate/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token
                }
            });

            if (response.ok) {
                toast.success('Estimate removed successfully');
                fetchJobs(); 
                setShowModal(false); 
            } else {
                const errorData = await response.json();
                toast.error(`Failed to remove estimate: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error removing estimate:', error);
            toast.error('Error removing estimate. Please try again.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Confirm Estimate Removal</h2>
                    <button onClick={() => setShowModal(false)} className="modal-close-button">×</button>
                </div>
                <div className="modal-body" style={{ textAlign: 'center' }}>
                    Are you sure you want to remove the estimate?
                </div>
                <div className="modal-actions">
                    <button onClick={handleRemoveEstimate} className="btn-primary">Remove Estimate</button>
                    <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default RemoveEstimateModal;
