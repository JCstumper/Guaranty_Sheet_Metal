import React from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css'; // Make sure this path is correct

const DeleteJobModal = ({ showModal, setShowModal, jobId, fetchJobs, API_BASE_URL }) => {
    if (!showModal) return null;

    const handleDeleteJob = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage

        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token // Include the token in the request header
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to remove job ${jobId}`);
            }

            toast.success(`Job ${jobId} removed successfully.`);
            fetchJobs(); // Re-fetch the jobs list to update the UI
            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Error removing job:', error);
            toast.error(`Failed to remove job. ${error.message}`);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Confirm Deletion</h2>
                    <button onClick={() => setShowModal(false)} className="modal-close-button">X</button>
                </div>
                <div className="modal-body">
                    Are you sure you want to delete?
                </div>
                <div className="modal-actions">
                    <button onClick={handleDeleteJob} className="btn-primary">Delete</button>
                    <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteJobModal;
