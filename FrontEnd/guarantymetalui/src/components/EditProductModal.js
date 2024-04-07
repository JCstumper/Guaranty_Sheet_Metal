// EditProductModal.js
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css';

const EditProductModal = ({ showModal, setShowModal, editProductItem, setEditProductItem, fetchProductsWithInventory, API_BASE_URL }) => {
    const initialItemType = editProductItem.unit === 'pcs' ? 'box' : 'length';
    const [itemType, setItemType] = useState(initialItemType);
    const [markupPriceManuallySet, setMarkupPriceManuallySet] = useState(false);
    const [isCatCodeManuallyChanged, setIsCatCodeManuallyChanged] = useState(false);
    const [autoGeneratePartNumber, setAutoGeneratePartNumber] = useState(true);
    const [initialType, setInitialType] = useState('');

    useEffect(() => {
        if (showModal) {
            const currentType = editProductItem.unit === 'pcs' ? 'box' : 'length';
            setItemType(currentType);
            
            setInitialType(editProductItem.type);
        }
    }, [showModal, editProductItem.unit]);

    useEffect(() => {
        // Only fetch catCode if it hasn't been manually changed
        if (editProductItem.type && !isCatCodeManuallyChanged && showModal) {
            const fetchCatCode = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories/getCatCode/${editProductItem.type}`);
                const data = await response.json();
                if (data.catcode) {
                    setEditProductItem(prev => ({ ...prev, catCode: data.catcode }));
                }
            } catch (error) {
                // console.error('Error fetching catCode:', error);
                // toast.error('Error fetching category code: ' + error.message);
            }
            };

            fetchCatCode();
        }
    }, [editProductItem.type, API_BASE_URL, showModal, isCatCodeManuallyChanged]);

    useEffect(() => {
        if (autoGeneratePartNumber) {
            const generatedPartNumber = generatePartNumber();
            setEditProductItem(prev => ({
                ...prev,
                partNumber: generatedPartNumber
            }));
        }
    }, [autoGeneratePartNumber, editProductItem.materialType, editProductItem.color, editProductItem.radiusSize, editProductItem.catCode, editProductItem.unit, editProductItem.quantityOfItem]);
    

    if (!showModal) return null;

    const colorCodes = {
        'red': 'RD',
        'dark red': 'DR',
        'light red': 'LR',
        'blue': 'BL',
        'dark blue': 'DB',
        'light blue': 'LB',
        'green': 'GN',
        'dark green': 'DG',
        'light green': 'LG',
        'yellow': 'YL',
        'dark yellow': 'DY',
        'light yellow': 'LY',
        'orange': 'OR',
        'dark orange': 'DO',
        'light orange': 'LO',
        'purple': 'PR',
        'dark purple': 'DP',
        'light purple': 'LP',
        'pink': 'PK',
        'dark pink': 'DK',
        'light pink': 'LK',
        'brown': 'BN',
        'dark brown': 'DB',
        'light brown': 'LB',
        'grey': 'GY',
        'dark grey': 'DG',
        'light grey': 'LG',
        'black': 'BK',
        'white': 'WH',
        'cyan': 'CY',
        'dark cyan': 'DC',
        'light cyan': 'LC',
        'magenta': 'MG',
        'dark magenta': 'DM',
        'light magenta': 'LM',
        'lime': 'LM',
        'dark lime': 'DL',
        'light lime': 'LL',
        'navy': 'NV',
        'dark navy': 'DN',
        'light navy': 'LN',
        'olive': 'OL',
        'dark olive': 'DO',
        'light olive': 'LO',
        'teal': 'TL',
        'dark teal': 'DT',
        'light teal': 'LT',
        'indigo': 'IN',
        'dark indigo': 'DI',
        'light indigo': 'LI',
        'violet': 'VT',
        'dark violet': 'DV',
        'light violet': 'LV',
        'tan': 'TN',
        'dark tan': 'DT',
        'light tan': 'LT',
        'beige': 'BG',
        'dark beige': 'DB',
        'light beige': 'LB',
        'coral': 'CO',
        'dark coral': 'DC',
        'light coral': 'LC',
        'turquoise': 'TQ',
        'dark turquoise': 'DT',
        'light turquoise': 'LT',
        'silver': 'SV',
        'gold': 'GD',
        'rose': 'RS',
        'dark rose': 'DR',
        'light rose': 'LR',
        'amber': 'AB',
        'cream': 'CM',
        'sand': 'SD',
        'dark sand': 'DS',
        'light sand': 'LS',
        'rust': 'RT',
        'dark rust': 'DR',
        'light rust': 'LR',
        'charcoal': 'CL',
        'sapphire': 'SF',
        'dark sapphire': 'DS',
        'light sapphire': 'LS',
        'plum': 'PM',
        'dark plum': 'DP',
        'light plum': 'LP',
        'mint': 'MT',
        'dark mint': 'DM',
        'light mint': 'LM',
        'peach': 'PH',
        'dark peach': 'DP',
        'light peach': 'LP',
        'lavender': 'LV',
        'dark lavender': 'DL',
        'light lavender': 'LL',
        'ivory': 'IV',
        'dark ivory': 'DI',
        'light ivory': 'LI',
        'maroon': 'MN',
        'dark maroon': 'DM',
        'light maroon': 'LM',
        '':'',
    };    
    
    const getColorCode = (colorName) => {
        // Ensure colorName is a string to avoid errors calling .trim() on undefined
        const cleanedColorName = (colorName || '').trim().toLowerCase();
        return colorCodes[cleanedColorName] || '';
    };    

    const generatePartNumber = () => {
        const { materialType, color, radiusSize, catCode, unit, quantityOfItem } = editProductItem;
        const colorCode = getColorCode(color) || ''; // Use the color code instead of the first letter
        let partNumber = `${materialType[0] || ''}${colorCode}${radiusSize}${catCode || ''}`;
    
        if (unit === 'ft') {
            const roundedQuantity = Math.ceil(Number(quantityOfItem));
            partNumber += roundedQuantity;
        }
    
        return partNumber.toUpperCase();
    };
    
    const handleItemTypeChange = (e) => {
        const selectedType = e.target.value;
        setItemType(selectedType);
        // Set the unit based on the selected item type
        const newUnit = selectedType === 'box' ? 'pcs' : 'ft';
        setEditProductItem(prev => ({ ...prev, unit: newUnit }));
    };

    const validateDollarAmount = value => {
        const regex = /^\d*\.?\d{0,2}$/;
        return regex.test(value);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/^\$/, '');
        if (validateDollarAmount(value)) {
            setEditProductItem({ ...editProductItem, price: value });
            // Check if the price is not empty before calculating markup price
            if (value !== '') {
                if (!markupPriceManuallySet) {
                    const markUpPrice = (parseFloat(value) * 1.30).toFixed(2); // Add 30% to the price
                    setEditProductItem(prev => ({ ...prev, markUpPrice: markUpPrice.toString() }));
                }
            } else {
                // If price is empty, set markup price to zero (or keep it empty based on requirement)
                setEditProductItem(prev => ({ ...prev, markUpPrice: '0' }));
            }
        } else if (value === '') {
            // Also handle the case where the price field becomes empty, resetting both price and markup price
            setEditProductItem(prev => ({ ...prev, price: '', markUpPrice: '0' }));
        }
    };    
    
    const handleMarkupPriceChange = (e) => {
        const value = e.target.value.replace(/^\$/, '');
        if (validateDollarAmount(value)) {
            setEditProductItem({ ...editProductItem, markUpPrice: value });
            setMarkupPriceManuallySet(true); // Mark that the markup price was manually set
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
            markUpPrice,
            catCode
        } = editProductItem;

        const updateData = {
            partNumber,
            supplierPartNumber,
            radiusSize,
            materialType,
            color,
            description,
            type, // This is the new type
            oldType: initialType, // Include the old type in the update payload
            quantityOfItem,
            unit,
            price,
            markUpPrice,
            catCode
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

    const handleCategoryChange = (e) => {
        const newType = e.target.value;
        setEditProductItem({ ...editProductItem, type: newType });
        setIsCatCodeManuallyChanged(false);
    };
    
      // When the catCode changes, set the manual change flag
    const handleCatCodeChange = (e) => {
        const newCatCode = e.target.value;
        setEditProductItem({ ...editProductItem, catCode: newCatCode });
        setIsCatCodeManuallyChanged(true);
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
                                    onChange={handleCatCodeChange}
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
                                onChange={handleItemTypeChange} // Use the new handler here
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
