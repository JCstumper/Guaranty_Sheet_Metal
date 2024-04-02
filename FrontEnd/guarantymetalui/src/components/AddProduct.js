// AddProducts.js
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import './AddProduct.css';

const AddProduct = ({ setShowModal, fetchProductsWithInventory }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [shouldUpdateCategory, setShouldUpdateCategory] = useState(true);
    const [itemType, setItemType] = useState('box');
    const [newProductItem, setNewProductItem] = useState({
        partNumber: '',
        supplierPartNumber: '',
        radiusSize: '',
        materialType: '',
        color: '',
        description: '',
        type: '',
        quantityOfItem: '',
        unit: '',
        price: '',
        markUpPrice: '',
    });

    const handleFileChange = (e) => {
        setUploadedFile(e.target.files[0]);
    };

    // Adjusted handleFileUpload to reflect the correct schema and ensure proper data handling
    const handleFileUpload = async () => {
        if (!uploadedFile) {
            console.error('No file selected!');
            toast.error('No file selected.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { blankrows: false, header: 1 });
            
            // Remove the header row and standardize it
            const headers = jsonData.shift().map(header => normalizeHeaderName(header, columnVariations));
            // Map standardized column names to their indices
            const columnIndices = {};
            headers.forEach((name, index) => {
                columnIndices[name] = index;
            });

            try {
                for (const item of jsonData) {
                    const itemData = {
                        partNumber: sanitizeInput(item[columnIndices['partnumber']]),
                        supplierPartNumber: sanitizeInput(item[columnIndices['supplierpartnumber']]), // Added field
                        radiusSize: sanitizeInput(item[columnIndices['radius_size']]),
                        materialType: sanitizeInput(item[columnIndices['materialtype']]),
                        color: sanitizeInput(item[columnIndices['color']]),
                        description: sanitizeInput(item[columnIndices['description']]),
                        type: sanitizeInput(item[columnIndices['type']]),
                        quantityOfItem: parseInt(sanitizeInput(item[columnIndices['quantityofitem']]), 10), // Ensure numeric conversion
                        unit: sanitizeInput(item[columnIndices['unit']]),
                        price: parseFloat(sanitizeInput(item[columnIndices['price']])), // Ensure numeric conversion
                        markUpPrice: parseFloat(sanitizeInput(item[columnIndices['markupprice']])) // Ensure numeric conversion
                    };

                    if (itemData.partNumber) {
                        await sendDataToBackend(itemData);
                    }
                }

                setShowUploadModal(false);
                toast.success('File uploaded successfully.');
                fetchProductsWithInventory();
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error('Failed to upload file.');
            }
        };
        reader.readAsArrayBuffer(uploadedFile);
    };

    // Adjust columnVariations mapping to match the expected schema and include all relevant fields
    const columnVariations = {
        'partnumber': ['Part Number', 'partnumber', 'part #'],
        'supplierpartnumber': ['Supplier Part Number', 'supplierpartnumber', 'supplier part #'],
        'radius_size': ['Radius Size', 'radius_size', 'Size', 'size'],
        'materialtype': ['Material Type', 'materialtype', 'Material'],
        'color': ['Color', 'color'],
        'description': ['Description', 'description'],
        'type': ['Type', 'type'],
        'quantityofitem': ['Quantity of Item', 'quantityofitem', 'Quantity'],
        'unit': ['Unit', 'unit'],
        'price': ['Price', 'price'],
        'markupprice': ['Markup Price', 'markupprice', 'Mark Up']
    };

    
    
    function normalizeHeaderName(headerName, variationsMap) {
        const normalized = headerName.toLowerCase().replace(/[^a-z0-9]+/g, '');
        // Check against known variations
        for (const standard in variationsMap) {
            if (variationsMap[standard].includes(normalized)) {
                return standard;
            }
        }
        // Return the name if no variation matches
        return normalized;
    }

    // Sanitization function to remove leading/trailing spaces and convert double spaces to single
    const sanitizeInput = (value) => {
        // Only apply trim and replace operations on strings
        if (typeof value === 'string') {
            return value.trim().replace(/\s\s+/g, ' ');
        } else {
            // For non-string values, return the value as is
            return value;
        }
    };
    

    const sendDataToBackend = async (data) => {
        try {
            console.log(data);
            const response = await fetch('https://localhost/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                console.log(data);
                throw new Error('Failed to send data to the server');
            }
    
            const result = await response.json();
            console.log('Data sent successfully', result);
            await fetchProductsWithInventory();
            return true;
        } catch (error) {
            console.error('Error sending data to server:', error);
            return false;
        }
    };

    const handleAddProducts = async () => {
        console.log("Attempting to add inventory item...");

        const sanitizedNewProductItem = {
            // Sanitize each field in newProductItem before sending it
            ...Object.keys(newProductItem).reduce((acc, key) => {
                acc[key] = typeof newProductItem[key] === 'string' ? newProductItem[key].trim().replace(/\s\s+/g, ' ') : newProductItem[key];
                return acc;
            }, {})
        };

        const wasSuccessful = await sendDataToBackend(sanitizedNewProductItem);

        if (wasSuccessful) {
            setShouldUpdateCategory(true);
            setShowModal(false);
            setNewProductItem({
                partNumber: '',
                supplierPartNumber: '',
                radiusSize: '',
                materialType: '',
                color: '',
                description: '',
                type: '',
                quantityOfItem: '',
                unit: '',
                price: '',
                markUpPrice: '',
            });

            toast.success('Item added successfully.');

            // Check if the category is new and add it to the mappings if so
            const { type } = sanitizedNewProductItem;
            const existingCategory = categoryMappings.find(cm => cm.category.toLowerCase() === type.toLowerCase());

            if (!existingCategory && type) {
                setCategoryMappings(prevMappings => [...prevMappings, { keywords: [type.toLowerCase()], category: type }]);
            }
        } else {
            toast.error('Failed to add the item. Please try again.');
        }
    };

    const [autoGeneratePartNumber, setAutoGeneratePartNumber] = useState(true);

    const generatePartNumber = () => {
        const { materialType, color, radiusSize, catCode } = newProductItem;
        let partNumber = `${materialType[0] || ''}${color[0] || ''}${radiusSize}${catCode || ''}`;
        return partNumber.toUpperCase(); // Customize as needed
    };
    

    useEffect(() => {
        if (autoGeneratePartNumber) {
            const generatedPartNumber = generatePartNumber();
            setNewProductItem(prev => ({
                ...prev,
                partNumber: generatedPartNumber
            }));
        }
        // Add the dependencies you use in your part number generation logic
    }, [autoGeneratePartNumber, newProductItem.materialType, newProductItem.color, newProductItem.radiusSize, newProductItem.catCode]);
    
    useEffect(() => {
        // Automatically update the unit based on the selected item type
        setNewProductItem(prevState => ({
            ...prevState,
            unit: itemType === 'box' ? 'pcs' : 'ft',
        }));
    }, [itemType]);

    const validateDollarAmount = value => {
        const regex = /^\d*\.?\d{0,2}$/;
        return regex.test(value);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (validateDollarAmount(value)) {
            setNewProductItem({ ...newProductItem, price: value });
        }
    };

    const handleMarkupPriceChange = (e) => {
        const value = e.target.value;
        if (validateDollarAmount(value)) {
            setNewProductItem({ ...newProductItem, markUpPrice: value });
        }
    };

    useEffect(() => {
        // Function to calculate the markup
        const calculateMarkup = (price) => {
        const markupPercentage = 30;
        return (parseFloat(price) * (1 + markupPercentage / 100)).toFixed(2); // Ensures the number is treated as a float and fixes to 2 decimal places
        };

        // Check if price is a number and not empty
        if (newProductItem.price && !isNaN(newProductItem.price)) {
        const markupPrice = calculateMarkup(newProductItem.price);
        setNewProductItem(prevState => ({
            ...prevState,
            markUpPrice: markupPrice
        }));
        }
    }, [newProductItem.price]);

    // Mapping of keywords to categories
    const [categoryMappings, setCategoryMappings] = useState([
        { keywords: ['adjustable', 'fascia', 'hanger'], category: 'Adjustable Fascia Hanger', catcode: 'HA' },
        { keywords: ['fascia', 'hanger'], category: 'Fascia Hanger', catcode: 'HF'  },
        { keywords: ['roof', 'mount', 'hanger'], category: 'Roof Mount Hanger', catcode: 'HR'  },
        { keywords: ['end', 'cap', 'universal'], category: 'End Cap Universal', catcode: 'ECU'  },
        { keywords: ['end', 'cap', 'left'], category: 'End Cap Left', catcode: 'ECL'  },
        { keywords: ['end', 'cap', 'right'], category: 'End Cap Right', catcode: 'ECR'  },
        { keywords: ['gutter', 'connector'], category: 'Gutter Connector', catcode: 'GC'  },
        { keywords: ['inside', 'miter'], category: 'Inside Miter', catcode: 'MIN'  },
        { keywords: ['outside', 'miter'], category: 'Outside Miter', catcode: 'MOUT'  },
        { keywords: ['outlet', '4"', 'downspout'], category: 'Downspout', catcode: '4OUT'  },
        { keywords: ['gutter'], category: 'Gutter', catcode: 'G'  },
    ]);
    
    const determineCategory = (description) => {
        const descLower = description.toLowerCase();
        let foundCategory = '';
        let isNewCategory = true;

        for (const mapping of categoryMappings) {
            if (mapping.keywords.every(keyword => descLower.includes(keyword))) {
                foundCategory = mapping.category;
                isNewCategory = false;
                break;
            }
        }

        return { foundCategory, isNewCategory };
    };

    // Modify your useEffect to check shouldUpdateCategory before setting the type
    useEffect(() => {
        if (shouldUpdateCategory) {
            const { foundCategory, isNewCategory } = determineCategory(newProductItem.description);
            
            if (!isNewCategory) {
                setNewProductItem(prev => ({
                    ...prev,
                    type: foundCategory
                }));
            }
        }
        // Reset shouldUpdateCategory whenever the modal is closed or the type is manually edited
    }, [newProductItem.description, shouldUpdateCategory]);

    useEffect(() => {
        // Find the mapping by category name
        const mapping = categoryMappings.find(cm => cm.category === newProductItem.type);
        // If a mapping is found, set the catCode in the state
        if (mapping) {
            setNewProductItem(prevState => ({
                ...prevState,
                catCode: mapping.catcode
            }));
        } else {
            // If no mapping is found (e.g. the user types a category that is not in the list), you can decide to clear the CatCode or leave it as is.
            // Here's how you'd clear the CatCode:
            setNewProductItem(prevState => ({
                ...prevState,
                catCode: '' // Clear the CatCode if the category is not found
            }));
        }
    }, [newProductItem.type, categoryMappings]);

    // In your category input onChange handler, set shouldUpdateCategory to false
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setNewProductItem(prevState => ({
            ...prevState,
            type: value
        }));
        setShouldUpdateCategory(false);
    };

    const handleCatCodeChange = (e) => {
        setNewProductItem({
            ...newProductItem,
            catCode: e.target.value
        });
    };    

    return (
        <div className="modal-backdrop" onClick={e => e.stopPropagation()}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isUploading ? 'Upload Excel File' : 'Add New Inventory Item'}</h2>
                    <button onClick={() => setShowModal(false)} className="modal-close-button">X</button>
                </div>
                <div className="modal-body">
                    {isUploading ? (
                        <div>
                            <label htmlFor="file-upload" className="custom-file-upload">
                                Choose File
                            </label>
                            <input id="file-upload" type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                        </div>
                    ) : (
                        <div>
                            <div className="auto-generate-part">
                                <input
                                    id="auto-generate-part-number"
                                    type="checkbox"
                                    checked={autoGeneratePartNumber}
                                    onChange={(e) => setAutoGeneratePartNumber(e.target.checked)}
                                />
                                <label htmlFor="auto-generate-part-number">Should the Part Number be auto-generated?</label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="part-number">Part Number:</label>
                                <input
                                    id="part-number"
                                    type="text"
                                    placeholder="Part Number"
                                    value={newProductItem.partNumber}
                                    readOnly={autoGeneratePartNumber}
                                    onChange={(e) => setNewProductItem({ ...newProductItem, partNumber: e.target.value })}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="supplier-part-number">Supplier Part Number:</label>
                                <input
                                    id="supplier-part-number"
                                    type="text"
                                    placeholder="Supplier Part Number"
                                    value={newProductItem.supplierPartNumber}
                                    onChange={e => setNewProductItem({ ...newProductItem, supplierPartNumber: e.target.value })}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="radius-size">Radius Size:</label>
                                <input
                                    id="radius-size"
                                    type="text"
                                    placeholder="Radius Size"
                                    value={newProductItem.radiusSize}
                                    onChange={e => setNewProductItem({ ...newProductItem, radiusSize: e.target.value })}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="material-type">Material Type:</label>
                                <input
                                    id="material-type"
                                    type="text"
                                    placeholder="Material Type"
                                    value={newProductItem.materialType}
                                    onChange={e => setNewProductItem({ ...newProductItem, materialType: e.target.value })}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="color">Color:</label>
                                <input
                                    id="color"
                                    type="text"
                                    placeholder="Color"
                                    value={newProductItem.color}
                                    onChange={e => setNewProductItem({ ...newProductItem, color: e.target.value })}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    placeholder="Description"
                                    value={newProductItem.description}
                                    onChange={e => setNewProductItem({ ...newProductItem, description: e.target.value })}
                                />
                            </div>

                            <div className="category-fields">
                                <div className="form-group category">
                                    <label htmlFor="type">Category:</label>
                                    <input
                                        id="type"
                                        type="text"
                                        placeholder="Category"
                                        value={newProductItem.type}
                                        onChange={handleCategoryChange}
                                    />
                                </div>
                                <div className="form-group catcode">
                                    <label htmlFor="catcode">CatCode:</label>
                                    <input
                                        id="catcode"
                                        type="text"
                                        placeholder="CatCode"
                                        value={newProductItem.catCode} // Make sure this state exists
                                        onChange={handleCatCodeChange} // Implement this handler
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
                                        value={newProductItem.quantityOfItem}
                                        onChange={e => setNewProductItem({ ...newProductItem, quantityOfItem: e.target.value })}
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
                                        value={newProductItem.price}
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
                                        value={newProductItem.markUpPrice}
                                        onChange={handleMarkupPriceChange}
                                        className="dollar-input"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal-actions">
                    {isUploading ? (
                        <button onClick={handleFileUpload}>Upload File</button>
                    ) : (
                        <button onClick={handleAddProducts}>Add Item</button>
                    )}
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                    <button onClick={() => setIsUploading(!isUploading)}>
                        {isUploading ? 'Switch to Manual' : 'Switch to Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
