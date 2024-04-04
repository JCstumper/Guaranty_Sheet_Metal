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
            quantityOfItem: parseInt(quantityOfItem, 10),
            unit,
            price: parseFloat(price),
            markUpPrice: parseFloat(markUpPrice),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/products/${originalPartNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error('Failed to update the product');
            }

            toast.success('Product updated successfully.');
            setShowModal(false);
            fetchProductsWithInventory();
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
                        <div className="form-group">
                            <label htmlFor="part-number">Part Number:</label>
                            <input
                                id="part-number"
                                type="text"
                                placeholder="Part Number"
                                value={editProductItem.partNumber}
                                // Removed readOnly as typically, part numbers are editable in an edit scenario. Adjust if needed.
                                onChange={e => setEditProductItem({ ...editProductItem, partNumber: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="supplier-part-number">Supplier Part Number:</label>
                            <input
                                id="supplier-part-number"
                                type="text"
                                placeholder="Supplier Part Number"
                                value={editProductItem.supplierPartNumber}
                                onChange={e => setEditProductItem({ ...editProductItem, supplierPartNumber: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="radius-size">Radius Size:</label>
                            <input
                                id="radius-size"
                                type="text"
                                placeholder="Radius Size"
                                value={editProductItem.radiusSize}
                                onChange={e => setEditProductItem({ ...editProductItem, radiusSize: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="material-type">Material Type:</label>
                            <input
                                id="material-type"
                                type="text"
                                placeholder="Material Type"
                                value={editProductItem.materialType}
                                onChange={e => setEditProductItem({ ...editProductItem, materialType: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="color">Color:</label>
                            <input
                                id="color"
                                type="text"
                                placeholder="Color"
                                value={editProductItem.color}
                                onChange={e => setEditProductItem({ ...editProductItem, color: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                placeholder="Description"
                                value={editProductItem.description}
                                onChange={e => setEditProductItem({ ...editProductItem, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Category:</label>
                            <input
                                id="type"
                                type="text"
                                placeholder="Category"
                                value={editProductItem.type}
                                onChange={e => setEditProductItem({ ...editProductItem, type: e.target.value })}
                            />
                        </div>

                        <div className="category-fields">
                                <div className="form-group category">
                                    <label htmlFor="type">Category:</label>
                                    <input
                                        id="type"
                                        type="text"
                                        placeholder="Category"
                                        value={editProductItem.type}
                                        onChange={e => setEditProductItem({ ...editProductItem, type: e.target.value })}
                                    />
                                </div>
                                <div className="form-group catcode">
                                    <label htmlFor="catcode">CatCode:</label>
                                    <input
                                        id="catcode"
                                        type="text"
                                        placeholder="CatCode"
                                        value={editProductItem.catCode} // Make sure this state exists
                                    />
                                </div>
                            </div>

                        <div className="form-group">
                            <label htmlFor="quantity-of-item">Quantity of Item:</label>
                            <input
                                id="quantity-of-item"
                                type="number"
                                placeholder="Quantity of Item"
                                value={editProductItem.quantityOfItem}
                                onChange={e => setEditProductItem({ ...editProductItem, quantityOfItem: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="unit">Unit:</label>
                            <input
                                id="unit"
                                type="text"
                                placeholder="Unit"
                                value={editProductItem.unit}
                                onChange={e => setEditProductItem({ ...editProductItem, unit: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Price:</label>
                            <input
                                id="price"
                                type="text"
                                placeholder="Price"
                                value={editProductItem.price}
                                onChange={e => setEditProductItem({ ...editProductItem, price: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mark-up-price">Mark Up Price:</label>
                            <input
                                id="mark-up-price"
                                type="text"
                                placeholder="Mark Up Price"
                                value={editProductItem.markUpPrice}
                                onChange={e => setEditProductItem({ ...editProductItem, markUpPrice: e.target.value })}
                            />
                        </div>

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
