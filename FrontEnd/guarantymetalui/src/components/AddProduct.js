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
    const [fileName, setFileName] = useState('');
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
        // Set the file name, or reset to an empty string if no file is selected
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
    
            // Track failed rows for reporting
            let failedRows = [];
    
            for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
                const row = jsonData[rowIndex];
    
                // Ensure all required columns have data
                const missingData = requiredColumns.some(column => {
                    return !row[columnIndices[column]] || sanitizeInput(row[columnIndices[column]].toString()).trim() === '';
                });
    
                if (missingData) {
                    // If any required data is missing, log the failure and skip this row
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

                // Generate part number if not provided
                if (!itemData.partNumber) {
                    itemData.partNumber = generatePartNumberBasedOnTemp(itemData); // Ensure this function exists and works as expected
                }
    
                // Attempt to send the item data to the backend
                try {
                    await sendDataToBackend(itemData);
                } catch (error) {
                    // Log the failure if sendDataToBackend throws an error
                    failedRows.push(`Row ${rowIndex + 2}: Failed to upload due to server error.`);
                }
            }
    
            // After processing all rows, report failures
            failedRows.forEach(failureMessage => {
                toast.error(failureMessage);
            });
    
            if (failedRows.length === 0) {
                toast.success('All items uploaded successfully.');
            } else if (failedRows.length < jsonData.length) {
                toast.warn('Some items failed to upload.');
            } else {
                toast.error('Failed to upload any items.');
            }
        };
        reader.readAsArrayBuffer(uploadedFile);
    };

    // Adjust columnVariations mapping to match the expected schema and include all relevant fields
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
        // Add any other column variations you expect here
    };
    
    function normalizeHeaderName(headerName, variationsMap) {
        const normalized = headerName.toLowerCase().replace(/[^a-z0-9]+/g, '');
        for (const key in variationsMap) {
            if (variationsMap[key].map(v => v.replace(/[^a-z0-9]+/g, '').toLowerCase()).includes(normalized)) {
                return key;
            }
        }
        return normalized; // Return the normalized name if no variation matches
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
            const response = await fetch('https://localhost/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                throw new Error('Failed to send data to the server');
            }
    
            const result = await response.json();
            await fetchProductsWithInventory();
            return true;
        } catch (error) {
            console.error('Error sending data to server:', error);
            return false;
        }
    };

    const handleAddProducts = async () => {
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

    const generatePartNumberBasedOnTemp = (itemData) => {
        const { materialType, color, radiusSize, catCode, unit, quantityOfItem } = itemData;
        const colorCode = getColorCode(color) || ''; // Use the color code instead of the first letter
        let partNumber = `${materialType[0] || ''}${colorCode || ''}${radiusSize}${catCode || ''}`;
    
        if (unit === 'ft') {
            partNumber += quantityOfItem;
        }
    
        return partNumber.toUpperCase();
    };
    
    const generatePartNumber = () => {
        const { materialType, color, radiusSize, catCode, unit, quantityOfItem } = newProductItem;
        const colorCode = getColorCode(color) || ''; // Use the color code instead of the first letter
        let partNumber = `${materialType[0] || ''}${colorCode}${radiusSize}${catCode || ''}`;
    
        if (unit === 'ft') {
            partNumber += quantityOfItem;
        }
    
        return partNumber.toUpperCase();
    };

    // useEffect hook for auto-generating part number whenever necessary state changes
    useEffect(() => {
        if (autoGeneratePartNumber) {
            const generatedPartNumber = generatePartNumber();
            setNewProductItem(prev => ({
                ...prev,
                partNumber: generatedPartNumber
            }));
        }
        // Include itemType and quantityOfItem in the dependency array to re-run the effect when they change
    }, [autoGeneratePartNumber, newProductItem.materialType, newProductItem.color, newProductItem.radiusSize, newProductItem.catCode, newProductItem.unit, newProductItem.quantityOfItem]);

    // ... 
    
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

    // useEffect hook to run a piece of code with specific dependencies
    useEffect(() => {
        // Define an asynchronous function to fetch category mappings from the backend
        const fetchCategoryMappings = async () => {
        try {
            // Initiating a fetch request to the '/categories' endpoint.
            // This is a relative URL, assuming the frontend and backend are served from the same domain.
            const response = await fetch('/categories', {
            method: 'GET', // The HTTP method used for the request
            headers: {
                'Accept': 'application/json', // Tells the server we want JSON data in response
                'Content-Type': 'application/json' // Tells the server we are sending JSON data
            },
            credentials: 'same-origin', // Ensures cookies are only included for requests to the same domain. Adjust as needed for your auth setup.
            });
    
            // Check if the response was successful (status in the range 200-299)
            if (!response.ok) {
            // If not successful, throw an error to jump to the catch block
            throw new Error('Failed to fetch category mappings');
            }
    
            // Parse the JSON response body and update the categoryMappings state with it
            const data = await response.json();
            setCategoryMappings(data); // Updates state with the fetched data. Adjust this line if your state variable is named differently.
        } catch (error) {
            // Log any errors to the console and show an error message to the user
            console.error('Error fetching category mappings:', error);
            toast.error('Failed to fetch categories. Please check your connection and try again.');
        }
        };
  
    // Call the fetchCategoryMappings function to execute the fetch operation
    fetchCategoryMappings();
  }, []); // An empty dependency array means this effect runs once on component mount, similar to componentDidMount in class components
  

    // Mapping of keywords to categories
    const [categoryMappings, setCategoryMappings] = useState([]);
    
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
                            <p>Please ensure your Excel file includes the following columns:</p>
                            <ul>
                                <li>Radius Size</li>
                                <li>Material Type</li>
                                <li>Description</li>
                                <li>Type</li>
                                <li>CatCode</li>
                                <li>Quantity of Item</li>
                                <li>Unit</li>
                                {/* List any other required columns here */}
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
