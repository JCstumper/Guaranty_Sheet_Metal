
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import './AddProduct.css';
import { AppContext } from '../App';

const AddProduct = ({ setShowModal, fetchProductsWithInventory }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [shouldUpdateCategory, setShouldUpdateCategory] = useState(true);
    const [itemType, setItemType] = useState('box');
    const [fileName, setFileName] = useState('');
    const {API_BASE_URL} = useContext(AppContext);
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
        const file = e.target.files[0];
        setUploadedFile(file);
        
        setFileName(file ? file.name : '');
    };

    const requiredColumns = ['radiussize', 'materialtype', 'description', 'type', 'catcode', 'quantityofitem', 'unit'];

    const handleFileUpload = async () => {
        if (!uploadedFile) {
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
    
            const headers = jsonData.shift().map(header => normalizeHeaderName(header, columnVariations));
            const columnIndices = headers.reduce((acc, header, index) => {
                acc[header] = index;
                return acc;
            }, {});

            let failedRows = [];

            for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
                const row = jsonData[rowIndex];

                const missingData = requiredColumns.some(column => {
                    return !row[columnIndices[column]] || sanitizeInput(row[columnIndices[column]].toString()).trim() === '';
                });

                if (missingData) {
                    
                    failedRows.push(`Row ${rowIndex + 2}: Missing required data.`);
                    continue;
                }
    
                let itemData = {
                    partNumber: sanitizeInput(row[columnIndices['partnumber']]),
                    supplierPartNumber: sanitizeInput(row[columnIndices['supplierpartnumber']]),
                    radiusSize: sanitizeInput(row[columnIndices['radiussize']]),
                    materialType: sanitizeInput(row[columnIndices['materialtype']]),
                    color: sanitizeInput(row[columnIndices['color']]),
                    description: sanitizeInput(row[columnIndices['description']]),
                    type: sanitizeInput(row[columnIndices['type']]),
                    quantityOfItem: parseInt(sanitizeInput(row[columnIndices['quantityofitem']]), 10),
                    unit: sanitizeInput(row[columnIndices['unit']]),
                    price: parseFloat(sanitizeInput(row[columnIndices['price']])),
                    markUpPrice: parseFloat(sanitizeInput(row[columnIndices['markupprice']])),
                    catCode: sanitizeInput(row[columnIndices['catcode']])
                };

                if (!itemData.partNumber) {
                    itemData.partNumber = generatePartNumberBasedOnTemp(itemData); 
                }

                const { type, catCode } = itemData;

                const isNewCategory = !categoryMappings.some(cm => cm.category.toLowerCase() === type.toLowerCase());
                const hasCatCode = !!catCode;

                if (isNewCategory && hasCatCode) {
                    const keywords = type.split(' ').map(word => word.toLowerCase());
                    await sendCategoryMappingToBackend(type, catCode, keywords);
                }
                setShowModal(false);
                
                try {
                    await sendDataToBackend(itemData);
                } catch (error) {
                    failedRows.push(`Row ${rowIndex + 2}: Failed to upload due to server error.`);
                }
            }

            failedRows.forEach(failureMessage => {
                toast.error(failureMessage);
            });

            if (failedRows.length === 0) {
                toast.success('All items uploaded successfully.');
            } else if (failedRows.length > jsonData.length) {
                toast.error('Failed to upload any items.');
            }
        };
        reader.readAsArrayBuffer(uploadedFile);
    };

    
    const columnVariations = {
        'partnumber': ['Part Number', 'partnumber', 'part #', 'P/N', 'Part No', 'Part Num'],
        'supplierpartnumber': ['Supplier Part Number', 'supplierpartnumber', 'supplier part #', 'Supplier P/N', 'Supp Part No', 'Supp Part Num'],
        'radiussize': ['Radius Size', 'radius_size', 'Size', 'size', 'Radius', 'radius'],
        'materialtype': ['Material Type', 'materialtype', 'Material', 'material'],
        'color': ['Color', 'color', 'Colour', 'colour'],
        'description': ['Description', 'description', 'Desc', 'desc', 'Description of Item', 'Item Description'],
        'type': ['Type', 'type', 'Category', 'category', 'Item Type', 'item type'],
        'quantityofitem': ['quantity_of_item','Quantity_of_Item','Quantity of Item', 'quantityofitem', 'Quantity', 'quantity', 'Qty', 'qty', 'Amount', 'amount', 'quantity_of_items', 'Quantity_of_Items', 'Quantity of Items', 'quantityofitems'],
        'unit': ['Unit', 'unit', 'Units', 'units', 'Measurement Unit', 'measurement unit'],
        'price': ['Price', 'price', 'Cost', 'cost', 'Unit Price', 'unit price'],
        'markupprice': ['Markup Price', 'markupprice', 'Mark Up', 'Mark-Up', 'mark up', 'Selling Price', 'selling price', 'w_trans', 'W_Trans'],
        'catcode': ['Cat Code', 'cat code','cat_code', 'Category Code', 'category code', 'CatCode', 'Cat', 'cat',],
        
    };
    
    function normalizeHeaderName(headerName, variationsMap) {
        const normalized = headerName.toLowerCase().replace(/[^a-z0-9]+/g, '');
        for (const key in variationsMap) {
            if (variationsMap[key].map(v => v.replace(/[^a-z0-9]+/g, '').toLowerCase()).includes(normalized)) {
                return key;
            }
        }
        return normalized; 
    }

    const sanitizeInput = (value) => {
        
        if (typeof value === 'string') {
            return value.trim().replace(/\s\s+/g, ' ');
        } else {
            
            return value;
        }
    };

    const sendDataToBackend = async (data) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                body: JSON.stringify(data),
            });
    
            const responseData = await response.json();  
            if (!response.ok) {
                toast.error(`Error: ${responseData.error || 'Failed to send data'}`);
                throw new Error(responseData.message || 'Failed to send data to the server');
            }
    
            await fetchProductsWithInventory();
            toast.success('Item added successfully.');
            return true;
        } catch (error) {
            console.error('Error sending data to server:', error);
            return false;
        }
    };

    const fetchCategoryMappings = async () => {
        const url = `${API_BASE_URL}/categories`; 
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'), 
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCategoryMappings(data); 
        } catch (error) {
            console.error('Fetching category mappings failed: ', error);
            toast.error('Failed to fetch category mappings');
        }
    };

    const sendCategoryMappingToBackend = async (category, catcode, keywords) => {
        const url = `${API_BASE_URL}/categories`;

        try {
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'), 
                },
                body: JSON.stringify({ category, catcode, keywords }),
            });

            fetchCategoryMappings();
        } catch (error) {
            console.error('Error sending category mapping to server:', error);
        }
    };

    const handleAddProducts = async () => {
        const sanitizedNewProductItem = {
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
                catCode: '',
            });

            const { type, catCode } = newProductItem;
            const isNewCategory = !categoryMappings.some(cm => cm.category.toLowerCase() === type.toLowerCase());
            const hasCatCode = !!catCode;

            if (isNewCategory && hasCatCode) {
                const keywords = type.split(' ').map(word => word.toLowerCase());
                await sendCategoryMappingToBackend(type, catCode, keywords);
            }
        }
    };

    const [autoGeneratePartNumber, setAutoGeneratePartNumber] = useState(true);

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

    const generatePartNumberBasedOnTemp = (itemData) => {
        const { materialType, color, radiusSize, catCode, unit, quantityOfItem } = itemData;
        const colorCode = getColorCode(color) || ''; 
        let partNumber = `${materialType[0] || ''}${colorCode || ''}${radiusSize}${catCode || ''}`;
    
        if (unit === 'ft') {
            partNumber += quantityOfItem;
        }
    
        return partNumber.toUpperCase();
    };
    
    const generatePartNumber = () => {
        const { materialType, color, radiusSize, catCode, unit, quantityOfItem } = newProductItem;
        const colorCode = getColorCode(color) || ''; 
        let partNumber = `${materialType[0] || ''}${colorCode}${radiusSize}${catCode || ''}`;
    
        if (unit === 'ft') {
            partNumber += quantityOfItem;
        }
    
        return partNumber.toUpperCase();
    };

    
    useEffect(() => {
        if (autoGeneratePartNumber) {
            const generatedPartNumber = generatePartNumber();
            setNewProductItem(prev => ({
                ...prev,
                partNumber: generatedPartNumber
            }));
        }
    }, [autoGeneratePartNumber, newProductItem.materialType, newProductItem.color, newProductItem.radiusSize, newProductItem.catCode, newProductItem.unit, newProductItem.quantityOfItem]);

    
    
    useEffect(() => {
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
        const calculateMarkup = (price) => {
        const markupPercentage = 30;
        return (parseFloat(price) * (1 + markupPercentage / 100)).toFixed(2); 
        };

        if (newProductItem.price && !isNaN(newProductItem.price)) {
            const markupPrice = calculateMarkup(newProductItem.price);
            setNewProductItem(prevState => ({
                ...prevState,
                markUpPrice: markupPrice
            }));
        }
    }, [newProductItem.price]);

    const [categoryMappings, setCategoryMappings] = useState([]);

    useEffect(() => {
        fetchCategoryMappings();
    }, []);

    useEffect(() => {
        const updateCategoryAndCatCode = description => {
            const sortedMappings = [...categoryMappings].sort((a, b) => b.keywords.length - a.keywords.length);
            
            for (const mapping of sortedMappings) {
                if (mapping.keywords.every(keyword => description.toLowerCase().includes(keyword.toLowerCase()))) {
                setNewProductItem(prev => ({
                    ...prev,
                    type: mapping.category,
                    catCode: mapping.catcode
                }));
                return;
                }
            }
            
            setNewProductItem(prev => ({
                ...prev,
                type: '',
                catCode: ''
            }));
        };
    
        if (shouldUpdateCategory) {
            updateCategoryAndCatCode(newProductItem.description);
        }
        
    }, [newProductItem.description, categoryMappings, shouldUpdateCategory]);

    useEffect(() => {
        const mapping = categoryMappings.find(cm => cm.category === newProductItem.type);
        if (mapping) {
            setNewProductItem(prevState => ({
                ...prevState,
                catCode: mapping.catcode
            }));
        } else {
            setNewProductItem(prevState => ({
                ...prevState,
                catCode: ''
            }));
        }
    }, [newProductItem.type, categoryMappings]);

    
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
                    <button onClick={() => setShowModal(false)} className="modal-close-button">×</button>
                </div>
                <div className="modal-body">
                    {isUploading ? (
                        <div>
                            <p>Please ensure your Excel file includes the following columns:</p>
                            <ul>
                                <li>Radius Size</li>
                                <li>Material Type</li>
                                <li>Description</li>
                                <li>Type</li>
                                <li>CatCode</li>
                                <li>Quantity of Item</li>
                                <li>Unit</li>
                            </ul>
                            <strong>The column headers must be in row 1!</strong>
                            <label htmlFor="file-upload" className="custom-file-upload">
                                {fileName || 'No file selected'}
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
                                    type="number"
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
                                        value={newProductItem.catCode} 
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
                                        type="number"
                                        placeholder={itemType === 'box' ? 'Enter quantity' : 'Enter length'}
                                        value={newProductItem.quantityOfItem}
                                        onChange={e => setNewProductItem({ ...newProductItem, quantityOfItem: e.target.value })}
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
