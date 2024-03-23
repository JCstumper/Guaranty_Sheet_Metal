import React, { useState, useEffect } from 'react';
import './Inventory.css';
import * as XLSX from 'xlsx';
import Topbar from './components/topbar';

const Inventory = ({ setAuth }) => {
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState(null);
    const [filter, setFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditQuantityModal, setShowEditQuantityModal] = useState(false);
    const [editItem, setEditItem] = useState({ partNumber: '', quantityInStock: 0 });
    const count = 0;

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
            setProducts(jsonData.products);
        } catch (error) {
            console.error('Error fetching products with inventory:', error);
        }
    };
    

    useEffect(() => {
        // fetchProducts();
        fetchProductsWithInventory();
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase());
    };

    const handleAddProducts = async () => {
        console.log("Attempting to add inventory item..."); // Debug log
        // console.log(newProductItem);
        try {
            const response = await fetch('https://localhost/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProductItem),
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
    };

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
                    partNumber: item[columnIndices['partnumber']],
                    radiusSize: item[columnIndices['size']],
                    materialType: item[columnIndices['materialtype']],
                    color: item[columnIndices['color']],
                    description: item[columnIndices['description']],
                    type: item[columnIndices['type']],
                    quantityOfItem: item[columnIndices['quantity']],
                    unit: item[columnIndices['unit']],
                    price: item[columnIndices['price']],
                    markUpPrice: item[columnIndices['markupprice']]
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
                count = count + 1

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

    const renderProductRows = products.filter(product =>
        product.part_number && product.part_number.toLowerCase().includes(filter.toLowerCase()) ||
        product.description && product.description.toLowerCase().includes(filter.toLowerCase()) ||
        product.radius_size !== null && (product.radius_size + '').toLowerCase().includes(filter.toLowerCase()) ||
        product.material_type && product.color && (product.material_type + ' / ' + product.color).toLowerCase().includes(filter.toLowerCase()) ||
        product.type && product.type.toLowerCase().includes(filter.toLowerCase()) ||
        product.quantity_of_item !== null && product.unit && (product.quantity_of_item + ' ' + product.unit).toLowerCase().includes(filter.toLowerCase()) ||
        product.price !== null && (product.price + '').toLowerCase().includes(filter.toLowerCase()) ||
        product.mark_up_price !== null && (product.mark_up_price + '').toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.quantity_in_stock - a.quantity_in_stock)
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
                                <p><strong>Base Quantity of Product:</strong> {product.quantity_of_item} {product.unit}</p>
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
                                <th>Part Number</th>
                                <th>Material/Color</th>
                                <th>Description</th>
                                <th>Quantity In Stock</th>
                                <th className="status-column">Status</th> {/* Add a class here */}
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
                        placeholder="Filter products..."
                        onChange={handleFilterChange}
                    />
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