// DeleteProductModal.js
import React from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css'; // Adjust the path if necessary

const DeleteProductModal = ({ showModal, setShowModal, deletePartNumber, fetchProductsWithInventory, API_BASE_URL }) => {
    if (!showModal) return null;

    const performDeleteProduct = async () => {
        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('token');
    
        try {
            // Attempt to delete the product
            let response = await fetch(`${API_BASE_URL}/products/${deletePartNumber}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token, // Include the token in the request headers
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete the product');
            }
    
            // If the product is deleted successfully, check the associated category
            const productData = await response.json();
            const category = productData.deletedProduct.type; // Adjust 'type' to your schema
            

            // Check if any other products have the same category
            response = await fetch(`${API_BASE_URL}/products/category/${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            });
    
            if (!response.ok) {
                throw new Error(`Failed to check products for category ${category}`);
            }
    
            toast.success('Product deleted successfully.');
            setShowModal(false); // Close the modal
            fetchProductsWithInventory(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product or category:', error);
            toast.error(`Error: ${error.message}`);
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
