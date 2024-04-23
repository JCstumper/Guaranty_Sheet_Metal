
import React from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css'; 

const DeleteProductModal = ({ showModal, setShowModal, deletePartNumber, fetchProductsWithInventory, API_BASE_URL }) => {
    if (!showModal) return null;

    const performDeleteProduct = async () => {
        const token = localStorage.getItem('token');
    
        try {
            let response = await fetch(`${API_BASE_URL}/products/${deletePartNumber}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token, 
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete the product');
            }

            const productData = await response.json();
            const category = productData.deletedProduct.type; 

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
            setShowModal(false); 
            fetchProductsWithInventory(); 
        } catch (error) {
            console.error('Error deleting product or category:', error);
            toast.error(`Error: ${error.message}`);
        }
    };
    

    return (
        <div className="modal-backdrop" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
