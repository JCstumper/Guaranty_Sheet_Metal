// EditProductModal.js
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css';

const EditProductModal = ({ showModal, setShowModal, editProductItem, setEditProductItem, fetchProductsWithInventory, API_BASE_URL }) => {
    const initialItemType = editProductItem.unit === 'pcs' ? 'box' : 'length';
    const [itemType, setItemType] = useState(initialItemType);

    useEffect(() => {
      // Whenever the modal is opened or the item's unit is changed, set the itemType
        if (showModal) {
            const currentType = editProductItem.unit === 'pcs' ? 'box' : 'length';
            setItemType(currentType);
        }
    }, [showModal, editProductItem.unit]);

    if (!showModal) return null;

    const validateDollarAmount = value => {
        const regex = /^\d*\.?\d{0,2}$/;
        return regex.test(value);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/^\$/, ''); // Remove dollar sign at the start
        if (validateDollarAmount(value)) {
            setEditProductItem({ ...editProductItem, price: value });
        }
    };
    
    const handleMarkupPriceChange = (e) => {
        const value = e.target.value.replace(/^\$/, ''); // Remove dollar sign at the start
        if (validateDollarAmount(value)) {
            setEditProductItem({ ...editProductItem, markUpPrice: value });
        }
    };

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
                        <div className="form-group">
                            <label htmlFor="part-number">Part Number:</label>
                            <input
                                id="part-number"
                                type="text"
                                placeholder="Part Number"
                                value={editProductItem.partNumber}
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
                            <label htmlFor="item-type">Item Type:</label>
                            <div className="custom-select-wrapper">
                                <select
                                    id="item-type"
                                    className="custom-select"
                                    value={itemType}
                                    onChange={e => setItemType(e.target.value)}
                                >
                                    <option value="box">Box Item</option>
                                    <option value="length">Length Item</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity-of-item">{itemType === 'box' ? 'Quantity' : 'Length'}:</label>
                            <div className="input-with-unit">
                                <input
                                    id="quantity-of-item"
                                    type="text"
                                    placeholder={itemType === 'box' ? 'Enter quantity' : 'Enter length'}
                                    value={editProductItem.quantityOfItem}
                                    onChange={e => setEditProductItem({ ...editProductItem, quantityOfItem: e.target.value })}
                                    className="quantity-input"
                                />
                                <span className="unit-label">{itemType === 'box' ? 'pcs' : 'ft'}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price:</label>
                            <div className="input-wrapper">
                                <input
                                    id="price"
                                    type="text"
                                    placeholder="Price"
                                    value={editProductItem.price.replace(/^\$/, '')} // Ensure the dollar sign is removed
                                    onChange={handlePriceChange}
                                    className="dollar-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="mark-up-price">Mark up Price:</label>
                            <div className="input-wrapper">
                                <input
                                    id="mark-up-price"
                                    type="text"
                                    placeholder="Mark Up Price"
                                    value={editProductItem.markUpPrice.replace(/^\$/, '')} // Ensure the dollar sign is removed
                                    onChange={handleMarkupPriceChange}
                                    className="dollar-input"
                                />
                            </div>
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
