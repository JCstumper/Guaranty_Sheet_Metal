import React, { useState, useEffect } from 'react';
import './Inventory.css';
import * as XLSX from 'xlsx';
import Topbar from './components/topbar';

const Inventory = ({ setAuth }) => {
    const [products, setProducts] = useState([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState(null);
    const [filter, setFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditQuantityModal, setShowEditQuantityModal] = useState(false);
    const [editItem, setEditItem] = useState({ partNumber: '', quantityInStock: 0 });
    const [sortColumn, setSortColumn] = useState(null); // e.g., 'part_number', 'quantity_in_stock'
    const [sortDirection, setSortDirection] = useState('ascending'); // or 'descending'
    const [filterOptions, setFilterOptions] = useState({
        radius_size: [],
        material_type: [],
        color: [],
        type: [],
    });
    const [activeFilters, setActiveFilters] = useState({
        radius_size: [],
        material_type: [],
        color: [],
        type: [],
    });

    const [newProductItem, setNewProductItem] = useState({
        partNumber: '',
        radiusSize: '', // Corresponds to radius_size in your table
        materialType: '',
        color: '',
        description: '',
        type: '', // Corresponds to product type
        quantityOfItem: '', // Should be converted to INT before sending
        unit: '',
        price: '', // Should handle conversion to MONEY type/format as needed
        markUpPrice: '', // Should handle conversion to MONEY type/format as needed
    });
    
    // // Function to fetch products from your API
    // const fetchProducts = async () => {
    //     try {
    //         const response = await fetch('https://localhost/api/products');
    //         const jsonData = await response.json();
    //         // console.log(jsonData.products.rows);
    //         setProducts(jsonData.products.rows);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    const fetchProductsWithInventory = async () => {
        try {
            const response = await fetch('https://localhost/api/products/with-inventory');
            const jsonData = await response.json();
            
            if (Array.isArray(jsonData.products)) {
                setProducts(jsonData.products);
            } else {
                console.error('Unexpected response format:', jsonData);
                setProducts([]); // Set to an empty array or handle appropriately
            }
            
        } catch (error) {
            console.error('Error fetching products with inventory:', error);
            setProducts([]); // Ensure products is always an array
        }
    };
    

    useEffect(() => {
        // fetchProducts();
        fetchProductsWithInventory();
    }, []);

    useEffect(() => {
        // Dynamically generate filter options based on products data
        const generateOptions = (items) => {
            let options = [...new Set(items.map(item => item ?? '(blank)').filter((item, index, array) => array.indexOf(item) === index))];
            // Remove '(blank)' if it exists to sort the rest
            const blankExists = options.includes('(blank)');
            if (blankExists) {
                options = options.filter(item => item !== '(blank)');
            }
            // Sort options and append '(blank)' at the end if it was originally there
            options.sort();
            if (blankExists) {
                options.push('(blank)');
            }
            return options;
        };
    
        const newFilterOptions = {
            radius_size: generateOptions(products.map(product => product.radius_size?.trim() === '' || product.radius_size == null ? '(blank)' : `${product.radius_size}"`)),
            material_type: generateOptions(products.map(product => product.material_type?.trim() === '' || product.radius_size == null ? '(blank)' : product.material_type)),
            color: generateOptions(products.map(product => product.color?.trim() === '' || product.radius_size == null ? '(blank)' : product.color)),
            type: generateOptions(products.map(product => product.type?.trim() === '' || product.radius_size == null ? '(blank)' : product.type)),
        };
    
        setFilterOptions(newFilterOptions);
    }, [products]);
    
    
    

    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase());
    };

    const handleAddProducts = async () => {
        console.log("Attempting to add inventory item..."); // Debug log
    
        // Sanitize each field in newProductItem before sending it
        const sanitizedNewProductItem = Object.keys(newProductItem).reduce((acc, key) => {
            acc[key] = typeof newProductItem[key] === 'string' ? sanitizeInput(newProductItem[key]) : newProductItem[key];
            return acc;
        }, {});
    
        try {
            const response = await fetch('https://localhost/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Use the sanitized item for the request
                body: JSON.stringify(sanitizedNewProductItem),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            setShowModal(false); // Close modal
            await fetchProductsWithInventory(); // Note: This is an async call
            setNewProductItem({
                partNumber: '',
                radiusSize: '', // Corresponds to radius_size in your table
                materialType: '',
                color: '',
                description: '',
                type: '', // Corresponds to product type
                quantityOfItem: '', // Should be converted to INT before sending
                unit: '',
                price: '', // Should handle conversion to MONEY type/format as needed
                markUpPrice: '', // Should handle conversion to MONEY type/format as needed
            }); // Reset form
        } catch (error) {
            console.error('Error adding inventory item:', error);
        }
    }    

    const handleFileChange = (e) => {
        setUploadedFile(e.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!uploadedFile) {
            console.error('No file selected!');
            return;
        }
    
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { blankrows: false, header: 1 });
            
            // Remove the header row and standardize it
            const headers = jsonData.shift().map(header => normalizeHeaderName(header, columnVariations));
            console.log("these are the headers:");
            console.log(headers);
            // Map standardized column names to their indices
            const columnIndices = {};
            headers.forEach((name, index) => {
                columnIndices[name] = index;
            });
    
            jsonData.forEach((item) => {
                const itemData = {
                    partNumber: sanitizeInput(item[columnIndices['partnumber']]),
                    radiusSize: sanitizeInput(item[columnIndices['size']]),
                    materialType: sanitizeInput(item[columnIndices['materialtype']]),
                    color: sanitizeInput(item[columnIndices['color']]),
                    description: sanitizeInput(item[columnIndices['description']]),
                    type: sanitizeInput(item[columnIndices['type']]),
                    quantityOfItem: sanitizeInput(item[columnIndices['quantity']]),
                    unit: sanitizeInput(item[columnIndices['unit']]),
                    price: sanitizeInput(item[columnIndices['price']]),
                    markUpPrice: sanitizeInput(item[columnIndices['markupprice']])
                };
    
                if (itemData.partNumber) {
                    sendDataToBackend(itemData);
                }
            });
        };
        reader.readAsArrayBuffer(uploadedFile);
    };
    
    // Mapping of variations to a standardized name
    const columnVariations = {
        'partnumber': ['partnumber', 'part #', 'partnum', 'pn', 'part_no', 'partno'],
        'size': ['size', 'radius', 'radius size', 'size (radius)', 'sizeradius', 'dimension'],
        'materialtype': ['materialtype', 'material', 'type of material', 'material_type', 'mattype', 'material kind'],
        'color': ['color', 'colour', 'clr', 'colorcode', 'color code'],
        'description': ['description', 'desc', 'description of item', 'item description', 'desc.', 'itemdesc'],
        'type': ['type', 'itemtype', 'producttype', 'type of item', 'typeofitem', 'item type'],
        'quantity': ['quantity', 'qty', 'quantity of item', 'amount', 'numberofitems', 'no of items', 'quantityofitem'],
        'unit': ['unit', 'unitofmeasure', 'measurement unit', 'uom', 'unit of measurement', 'unitmeasure'],
        'price': ['price', 'cost', 'item price', 'price per unit', 'unitprice', 'price/unit'],
        'markupprice': ['markupprice', 'price with trans', 'w_trans', 'price_w_trans', 'pricetrans', 'transprice', 'price trans', 'pricewithtrans', 'markup price', 'wtrans']
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
            await fetchProductsWithInventory(); // Note: This is an async call
            // You might want to refresh your frontend data here
        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    };

    // Toggle the expanded state of a product row
    const toggleProductExpansion = (index) => {
        if (expandedRowIndex === index) {
            // If clicking the already expanded row, collapse it
            setExpandedRowIndex(null);
        } else {
            // Expand the new row and collapse others
            setExpandedRowIndex(index);
        }
    };

    const normalizeText = (text) => {
        return text ? text.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    };

    const matchesFilter = (product) => {
        const normalizedFilter = filter.toLowerCase();
        return (
            product.part_number.toLowerCase().includes(normalizedFilter) ||
            product.description.toLowerCase().includes(normalizedFilter)
        ) && Object.keys(activeFilters).every(key =>
            activeFilters[key].length === 0 || activeFilters[key].includes(product[key])
        );
    };
    
    // const matchesFilter = (product, filter) => {
    //     const normalizedFilter = normalizeText(filter);
    
    //     // Check if the part number or description matches the normalized filter
    //     const partNumberMatch = normalizeText(product.part_number).includes(normalizedFilter);
    //     const descriptionMatch = normalizeText(product.description).includes(normalizedFilter);
    
    //     return partNumberMatch || descriptionMatch;
    // };
    
    const sortProducts = (a, b) => {
        if (sortColumn === null) return 0;
    
        // Special handling for "status"
        if (sortColumn === 'status') {
            const statusA = a.quantity_in_stock > 0 ? 1 : 0; // 1 for In Stock, 0 for Out of Stock
            const statusB = b.quantity_in_stock > 0 ? 1 : 0;
    
            // Ascending: Show "Out of Stock" before "In Stock"
            // Descending: Show "In Stock" before "Out of Stock"
            return sortDirection === 'ascending' ? statusA - statusB : statusB - statusA;
        }
    
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];
        
        // Handle numeric sorting
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortDirection === 'ascending' ? valueA - valueB : valueB - valueA;
        }
        
        // Handle string sorting
        valueA = valueA ? valueA.toString().toLowerCase() : '';
        valueB = valueB ? valueB.toString().toLowerCase() : '';
        if (valueA < valueB) return sortDirection === 'ascending' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'ascending' ? 1 : -1;
        
        return 0;
    };    

    const sortedProducts = [...products].filter(product => matchesFilter(product, filter)).sort(sortProducts);

    const renderProductRows = sortedProducts
    .filter(product => matchesFilter(product, filter))
    .map((product, index) => (
        <React.Fragment key={index}>
            <tr onClick={() => toggleProductExpansion(index)}>
                <td>{product.part_number}</td>
                <td>{product.material_type && product.color ? `${product.material_type} / ${product.color}` : product.material_type ? product.material_type : product.color ? product.color : ''}</td>
                <td>{product.description}</td>
                <td>{product.quantity_in_stock} <button onClick={(e) => {
                        e.stopPropagation(); // Prevent row expansion
                        openEditQuantityModal(product);
                    }}>Edit Quantity</button>
                </td>
                <td>
                <div className={`status-box ${product.quantity_in_stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.quantity_in_stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
                </td>
            </tr>
            {expandedRowIndex === index && (
                <tr className={`product-details ${expandedRowIndex === index ? 'expanded' : ''}`}>
                    <td colSpan="5">
                        <div className="product-details-content">
                            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '10px' }}>
                                <p><strong>Part Number:</strong> {product.part_number}</p>
                                <p><strong>Size:</strong> {product.radius_size}"</p>
                                <p><strong>Material/Color:</strong> {product.material_type && product.color ? `${product.material_type} / ${product.color}` : product.material_type ? product.material_type : product.color ? product.color : ''}</p>
                                <p><strong>Description:</strong> {product.description}</p>
                                <p><strong>Product Type:</strong> {product.type}</p>
                                <p><strong>Base Quantity of Product:</strong> {Number.isInteger(parseFloat(product.quantity_of_item)) ? parseInt(product.quantity_of_item, 10) : product.quantity_of_item}{product.unit}</p>
                                <p><strong>Base Price:</strong> {product.price}</p>
                                <p><strong>Mark Up Price:</strong> {product.mark_up_price}</p>
                                {/* Additional details can go here if needed */}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    ));

    const handleCheckboxChange = (category, option) => {
        setActiveFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(option) ?
                prev[category].filter(item => item !== option) :
                [...prev[category], option],
        }));
    };

    // Function to render checkboxes for a given category
    const renderCategoryCheckboxes = (category) => {
        return (
            <div className="filter-category">
                <h3>{category.replace(/_/g, ' ').toUpperCase()}</h3>
                {filterOptions[category].map(option => (
                    <label key={option} className="category-checkbox">
                        <input
                            type="checkbox"
                            checked={activeFilters[category].includes(option)}
                            onChange={() => handleCheckboxChange(category, option)}
                        />
                        {option}
                    </label>
                ))}
            </div>
        );
    };

    const filteredProducts = products.filter(matchesFilter);

    const handleSort = (columnName) => {
        if (sortColumn === columnName) {
            setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
        } else {
            setSortColumn(columnName);
            setSortDirection('ascending');
        }
    };
    

    const openEditQuantityModal = (item) => {
        setEditItem({ partNumber: item.part_number, quantityInStock: item.quantity_in_stock });
        setShowEditQuantityModal(true);
    };
    
    const handleUpdateQuantity = async (e) => {
        e.preventDefault();
        console.log("made it into handleupdatequantity");
        try {
            const response = await fetch(`/api/inventory/${editItem.partNumber}/quantity`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity_in_stock: editItem.quantityInStock })
            });
            if (response.ok) {
                setShowEditQuantityModal(false); // Close the modal on success
                fetchProductsWithInventory(); // Refresh the inventory list
            } else {
                console.error("Failed to update item.");
            }
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };
    
    return (
        <div className="inventory">
            <Topbar setAuth={setAuth} />
            <div className="inventory-main">
                <div className="product-table">
                    <div className="table-header">
                        <span className="table-title">Inventory</span>
                        <button className="add-button" onClick={() => setShowModal(true)}>+</button>
                    </div>
                    <table className="table-content">
                        <thead>
                            <tr>
                                <th>
                                    <button onClick={() => handleSort('part_number')} className="sortable-header">
                                        Part Number {sortColumn === 'part_number' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('material_type')} className="sortable-header">
                                        Material/Color {sortColumn === 'material_type' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('description')} className="sortable-header">
                                        Description {sortColumn === 'description' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('quantity_in_stock')} className="sortable-header">
                                        Quantity In Stock {sortColumn === 'quantity_in_stock' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('status')} className="sortable-header">
                                        Status {sortColumn === 'status' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderProductRows}
                        </tbody>
                    </table>
                </div>
                <div className="filtering-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for products..."
                        onChange={handleFilterChange}
                    />
                    {Object.keys(filterOptions).map(category => renderCategoryCheckboxes(category))}
                </div>
                {showUploadModal && (
                    <div className="modal-backdrop" onClick={() => setShowUploadModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Upload Products File</h2>
                            </div>
                            <div className="modal-body">
                                <input type="file" onChange={e => setUploadedFile(e.target.files[0])} />
                            </div>
                            <div className="modal-actions">
                                <button onClick={handleFileUpload}>Upload File</button>
                                <button onClick={() => setShowUploadModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                {showModal && (
                    <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{isUploading ? 'Upload Excel File' : 'Add New Inventory Item'}</h2>
                            </div>
                            <div className="modal-body">
                                {isUploading ? (
                                    <div>
                                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                                    </div>
                                ) : (
                                    <div>
                                        {/* Manual input fields */}
                                        <input type="text" placeholder="Part Number" value={newProductItem.partNumber} onChange={e => setNewProductItem({ ...newProductItem, partNumber: e.target.value })} />
                                        <input type="text" placeholder="Radius Size" value={newProductItem.radiusSize} onChange={e => setNewProductItem({ ...newProductItem, radiusSize: e.target.value })} />
                                        <input type="text" placeholder="Material Type" value={newProductItem.materialType} onChange={e => setNewProductItem({ ...newProductItem, materialType: e.target.value })} />
                                        <input type="text" placeholder="Color" value={newProductItem.color} onChange={e => setNewProductItem({ ...newProductItem, color: e.target.value })} />
                                        <textarea placeholder="Description" value={newProductItem.description} onChange={e => setNewProductItem({ ...newProductItem, description: e.target.value })} />
                                        <input type="text" placeholder="Type" value={newProductItem.type} onChange={e => setNewProductItem({ ...newProductItem, type: e.target.value })} />
                                        <input type="number" placeholder="Quantity of Item" value={newProductItem.quantityOfItem} onChange={e => setNewProductItem({ ...newProductItem, quantityOfItem: e.target.value })} />
                                        <input type="text" placeholder="Unit" value={newProductItem.unit} onChange={e => setNewProductItem({ ...newProductItem, unit: e.target.value })} />
                                        <input type="text" placeholder="Price" value={newProductItem.price} onChange={e => setNewProductItem({ ...newProductItem, price: e.target.value })} />
                                        <input type="text" placeholder="Mark Up Price" value={newProductItem.markUpPrice} onChange={e => setNewProductItem({ ...newProductItem, markUpPrice: e.target.value })} />
                                        {/* Include other input fields here */}
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
                                    {isUploading ? 'Switch to Manual Input' : 'Switch to Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showEditQuantityModal && (
                    <div className="edit-quantity-modal-backdrop" onClick={() => setShowEditQuantityModal(false)}>
                        <div className="edit-quantity-modal-container" onClick={e => e.stopPropagation()}>
                            <h2>Edit Quantity in Stock</h2>
                            <form onSubmit={handleUpdateQuantity} className="edit-quantity-modal-form">
                                <div className="edit-quantity-modal-input-group">
                                    <label htmlFor="quantityInStock">Quantity in Stock:</label>
                                    <input
                                        id="quantityInStock"
                                        type="number"
                                        className="edit-quantity-modal-input"
                                        value={editItem.quantityInStock}
                                        onChange={e => setEditItem({ ...editItem, quantityInStock: parseInt(e.target.value, 10) })}
                                    />
                                </div>
                                <div className="edit-quantity-modal-actions">
                                    <button type="submit" className="edit-quantity-modal-update-btn">Update</button>
                                    <button type="button" onClick={() => setShowEditQuantityModal(false)} className="edit-quantity-modal-cancel-btn">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;