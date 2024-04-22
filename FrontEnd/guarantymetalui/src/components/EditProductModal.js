
import React, { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css';

const EditProductModal = ({ showModal, setShowModal, editProductItem, setEditProductItem, fetchProductsWithInventory, API_BASE_URL }) => {
    const initialItemType = editProductItem.unit === 'pcs' ? 'box' : 'length';
    const [itemType, setItemType] = useState(initialItemType);
    const [markupPriceManuallySet, setMarkupPriceManuallySet] = useState(false);
    const [isCatCodeManuallyChanged, setIsCatCodeManuallyChanged] = useState(false);
    const [autoGeneratePartNumber, setAutoGeneratePartNumber] = useState(true);
    const initialTypeRef = useRef(editProductItem.type);

    useEffect(() => {
        if (showModal) {
            const currentType = editProductItem.unit === 'pcs' ? 'box' : 'length';
            setItemType(currentType);

        }
    }, [showModal, editProductItem.unit]);

    useEffect(() => {
        
        if (editProductItem.type && !isCatCodeManuallyChanged && showModal) {
            const fetchCatCode = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories/getCatCode/${editProductItem.type}`);
                const data = await response.json();
                if (data.catcode) {
                    setEditProductItem(prev => ({ ...prev, catCode: data.catcode }));
                }
            } catch (error) {
                
                
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
        
        const cleanedColorName = (colorName || '').trim().toLowerCase();
        return colorCodes[cleanedColorName] || '';
    };    

    const generatePartNumber = () => {
        const { materialType, color, radiusSize, catCode, unit, quantityOfItem } = editProductItem;
        const colorCode = getColorCode(color) || ''; 
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
            
            if (value !== '') {
                if (!markupPriceManuallySet) {
                    const markUpPrice = (parseFloat(value) * 1.30).toFixed(2); 
                    setEditProductItem(prev => ({ ...prev, markUpPrice: markUpPrice.toString() }));
                }
            } else {
                
                setEditProductItem(prev => ({ ...prev, markUpPrice: '0' }));
            }
        } else if (value === '') {
            
            setEditProductItem(prev => ({ ...prev, price: '', markUpPrice: '0' }));
        }
    };    
    
    const handleMarkupPriceChange = (e) => {
        const value = e.target.value.replace(/^\$/, '');
        if (validateDollarAmount(value)) {
            setEditProductItem({ ...editProductItem, markUpPrice: value });
            setMarkupPriceManuallySet(true); 
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
            type, 
            oldType: type !== initialTypeRef.current ? initialTypeRef.current : undefined,
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
                    'token': token, 
                },
                body: JSON.stringify(updateData),
            });

            const responseData = await response.json();
            if (!response.ok) {
                toast.error(`Error updating product: ${responseData.message}`);
                throw new Error(responseData.message);
            }

            toast.success('Product updated successfully.');
            setShowModal(false); 
            fetchProductsWithInventory(); 
        } catch (error) {
        
        }
    };

    const handleCatCodeChange = (e) => {
        const newCatCode = e.target.value;
        setEditProductItem({ ...editProductItem, catCode: newCatCode });
        setIsCatCodeManuallyChanged(true);
    };

    return (
        <div className="modal-backdrop" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Product</h2>
                    <button onClick={() => setShowModal(false)} className="modal-close-button">×</button>
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
                                    value={editProductItem.catCode} 
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
                                onChange={handleItemTypeChange} 
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
                            <label htmlFor="price">Price Per Unit:</label>
                            <div className="input-wrapper">
                                <input
                                    id="price"
                                    type="text"
                                    placeholder="Price"
                                    value={editProductItem.price.replace(/^\$/, '')} 
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
                                    value={editProductItem.markUpPrice.replace(/^\$/, '')} 
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
