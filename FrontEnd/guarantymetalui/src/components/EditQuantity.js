// EditQuantity.js
import React from 'react';
import './AddProduct.css'; // Adjust the path if necessary

const EditQuantity = ({ showModal, setShowModal, editItem, setEditItem, handleUpdateQuantity }) => {
    if (!showModal) return null;

    return (
        <div className="modal-backdrop" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Quantity</h2>
                    <button onClick={() => setShowModal(false)} className="modal-close-button">×</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <form onSubmit={handleUpdateQuantity}>
                        <label htmlFor="edit-quantity">Edit Quantity:</label>
                            <input
                                type="number"
                                className="edit-quantity-modal-input"
                                value={editItem.quantityInStock}
                                onChange={(e) => setEditItem({ ...editItem, quantityInStock: parseInt(e.target.value, 10) })}
                            />
                            <div className="modal-actions">
                                <button type="submit" className="edit-quantity-modal-update-btn">Update</button>
                                <button type="button" onClick={() => setShowModal(false)} className="edit-quantity-modal-cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditQuantity;
