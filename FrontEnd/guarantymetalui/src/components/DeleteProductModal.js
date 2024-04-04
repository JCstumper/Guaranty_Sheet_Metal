// DeleteProductModal.js
import React from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css'; // Adjust the path if necessary

const DeleteProductModal = ({ showModal, setShowModal, deletePartNumber, fetchProductsWithInventory, API_BASE_URL }) => {
    if (!showModal) return null;

    const performDeleteProduct = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${deletePartNumber}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete the product');
            }
    
            toast.success('Product deleted successfully.');
            setShowModal(false); // Close the modal
            fetchProductsWithInventory(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error deleting product.');
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
                    Are you sure you want to delete the product with part number:
                </div>
                <strong>{deletePartNumber}?</strong>
                <div className="modal-actions">
                    <button onClick={performDeleteProduct} className="delete-confirm">Delete</button>
                    <button onClick={() => setShowModal(false)} className="delete-cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProductModal;
