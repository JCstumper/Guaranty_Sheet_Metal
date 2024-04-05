// EditProductModal.js
import React from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css';

const EditProductModal = ({
    showModal,
    setShowModal,
    editProductItem,
    setEditProductItem,
    fetchProductsWithInventory,
    API_BASE_URL
}) => {
    if (!showModal) return null;

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const {
            originalPartNumber,
            partNumber,
            supplierPartNumber,
            radiusSize,
            materialType,
            color,
            description,
            type,
            quantityOfItem,
            unit,
            price,
            markUpPrice
        } = editProductItem;

        const updateData = {
            partNumber, // If the part number is editable
            supplierPartNumber,
            radiusSize,
            materialType,
            color,
            description,
            type,
            quantityOfItem,
            unit,
            price,
            markUpPrice,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/products/${originalPartNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token, // Include the token in the request headers
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error('Failed to update the product');
            }

            toast.success('Product updated successfully.');
            setShowModal(false); // Close the modal
            fetchProductsWithInventory(); // Refresh the inventory list
        } catch (error) {
            toast.error('Error updating product: ' + error.message);
            console.error('Error updating product:', error);
        }
    };


    // You can keep the existing form and input handlers intact

    return (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Product</h2>
                    <button onClick={() => setShowModal(false)} className="modal-close-button">X</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleUpdateProduct}>
                        <input
                            type="text"
                            placeholder="Part Number"
                            value={editProductItem.partNumber}
                            onChange={e => setEditProductItem({ ...editProductItem, partNumber: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Supplier Part Number"
                            value={editProductItem.supplierPartNumber}
                            onChange={e => setEditProductItem({ ...editProductItem, supplierPartNumber: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Radius Size"
                            value={editProductItem.radiusSize}
                            onChange={e => setEditProductItem({ ...editProductItem, radiusSize: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Material Type"
                            value={editProductItem.materialType}
                            onChange={e => setEditProductItem({ ...editProductItem, materialType: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Color"
                            value={editProductItem.color}
                            onChange={e => setEditProductItem({ ...editProductItem, color: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            value={editProductItem.description}
                            onChange={e => setEditProductItem({ ...editProductItem, description: e.target.value })}
                        ></textarea>
                        <input
                            type="text"
                            placeholder="Type"
                            value={editProductItem.type}
                            onChange={e => setEditProductItem({ ...editProductItem, type: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Quantity of Item"
                            value={editProductItem.quantityOfItem}
                            onChange={e => setEditProductItem({ ...editProductItem, quantityOfItem: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Unit"
                            value={editProductItem.unit}
                            onChange={e => setEditProductItem({ ...editProductItem, unit: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Price"
                            value={editProductItem.price}
                            onChange={e => setEditProductItem({ ...editProductItem, price: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Mark Up Price"
                            value={editProductItem.markUpPrice}
                            onChange={e => setEditProductItem({ ...editProductItem, markUpPrice: e.target.value })}
                        />
                        <div className="modal-actions">
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal;
