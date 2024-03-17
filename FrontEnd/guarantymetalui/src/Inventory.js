import React, { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import Topbar from './components/topbar';
import './Inventory.css';

const Inventory = ({ setAuth }) => {
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [filter, setFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const count = 0;


    
    const [newInventoryItem, setNewInventoryItem] = useState({
        partNumber: '', // maps to part_number
        size: '',
        productType: '', // maps to product_type
        description: '',
        productType: '', // maps to product_type
        length: '', // should be a string that can be converted to DECIMAL
        price: '', // should be a string that can be converted to DECIMAL
        priceWithTransport: '', // should be a string that can be converted to DECIMAL
        unit: '',
        categoryName: '', // maps to category_name
    });

    const [newProductItem, setNewProductItem] = useState({
        partNumber: '',            // maps to Part Number
        size: '',                  // maps to Size
        metalType: '',             // maps to Metal
        description: '',           // maps to Description
        productType: '',           // maps to Type
        length: '',                // should be a string that can be converted to DECIMAL and maps to Length
        pieces: '',                // should be a string that can be converted to an INTEGER and maps to Pieces
        price: '',                 // should be a string that can be converted to DECIMAL and maps to Price
        priceWithTransport: '',    // should be a string that can be converted to DECIMAL and maps to Price w/ Trans
        unit: '',                  // maps to Unit
    });
    
    // Function to fetch products from your API
    const fetchProducts = async () => {
        try {
            const response = await fetch('https://localhost/api/products');
            const jsonData = await response.json();
            // console.log(jsonData.products.rows);
            setProducts(jsonData.products.rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await fetch('https://localhost/api/Inventory');
            const jsonData = await response.json();
            console.log(jsonData.products.rows);
            setInventory(jsonData.products.rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
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
            fetchProducts(); // Refresh products list
            setNewProductItem({
                partNumber: '',            // maps to Part Number
                size: '',                  // maps to Size
                metalType: '',             // maps to Metal
                description: '',           // maps to Description
                productType: '',           // maps to Type
                length: '',                // should be a string that can be converted to DECIMAL and maps to Length
                pieces: '',                // should be a string that can be converted to an INTEGER and maps to Pieces
                price: '',                 // should be a string that can be converted to DECIMAL and maps to Price
                priceWithTransport: '',    // should be a string that can be converted to DECIMAL and maps to Price w/ Trans
                unit: '',                  // maps to Unit
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
            jsonData.shift(); // Remove header row

            jsonData.forEach((item) => {
                const itemData = {
                    partNumber: item[0],
                    size: item[1],
                    metalType: item[2],
                    description: item[3],
                    productType: item[4],
                    length: item[5],
                    pieces: item[6],
                    price: item[7],
                    priceWithTransport: item[8],
                    unit: item[9],
                };

                // Only send data if partNumber is present
                if (itemData.partNumber) {
                    sendDataToBackend(itemData);
                }
            });
        };
        console.log(count);
        reader.readAsArrayBuffer(uploadedFile);
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
                count = count + 1

                console.log(data);
                throw new Error('Failed to send data to the server');
            }
    
            const result = await response.json();
            console.log('Data sent successfully', result);
            // You might want to refresh your frontend data here
        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    };
    
    const filteredProducts = products.filter(product =>
        product.description.toLowerCase().includes(filter) ||
        product.product_type.toLowerCase().includes(filter)
    );

    return (
        <div className="inventory">
            <Topbar setAuth={setAuth} />
            <div className="inventory-main">
                <div className="product-table">
                    <div className="table-header">
                        <span className="table-title">Current Inventory</span>
                    </div>
                    <table className="table-content">
                        <thead>
                            <tr>
                                <th className="th-part-number">Part Number</th>
                                <th className="th-size">Size</th>
                                <th className="th-product-type">Product Type</th>
                                <th className="th-description">Description</th>
                                <th className="th-length">Length</th>
                                <th className="th-base-price">Base Price</th>
                                <th className="th-current-sell-price">Current Sell Price</th>
                                <th className="th-amount-scheduled-out">Amount Scheduled Out</th>
                                <th className="th-amount-scheduled-in">Amount Scheduled In</th>
                                <th className="th-on-hand">On Hand Stock Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={index}>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="product-table">
                    <div className="table-header">
                        <span className="table-title">All Products</span>
                        <button className="add-button" onClick={() => setShowModal(true)}>+</button>
                    </div>
                    <table className="table-content">
                        <thead>
                            <tr className="th">
                                <th>Part Number</th>
                                <th>Size</th>
                                <th>Metal</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Length</th>
                                <th>Pieces</th>
                                <th>Price</th>
                                <th>Price w/ Trans</th>
                                <th>Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.part_number}</td>
                                    <td>{product.size}</td>
                                    <td>{product.material_type}</td>
                                    <td>{product.description}</td>
                                    <td>{product.type}</td>
                                    <td>{product.length}</td>
                                    <td>{product.pieces}</td>
                                    <td>{product.price}</td>
                                    <td>{product.w_trans}</td>
                                    <td>{product.unit}</td>
                                </tr>
                            ))}
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
                                            <input type="text" placeholder="Size" value={newProductItem.size} onChange={e => setNewProductItem({ ...newProductItem, size: e.target.value })} />
                                            <input type="text" placeholder="Metal Type" value={newProductItem.metalType} onChange={e => setNewProductItem({ ...newProductItem, metalType: e.target.value })} />
                                            <textarea placeholder="Description" value={newProductItem.description} onChange={e => setNewProductItem({ ...newProductItem, description: e.target.value })} />
                                            <input type="text" placeholder="Product Type" value={newProductItem.productType} onChange={e => setNewProductItem({ ...newProductItem, productType: e.target.value })} />
                                            <input type="text" placeholder="Length" value={newProductItem.length} onChange={e => setNewProductItem({ ...newProductItem, length: e.target.value })} />
                                            <input type="text" placeholder="Pieces" value={newProductItem.pieces} onChange={e => setNewProductItem({ ...newProductItem, pieces: e.target.value })} />
                                            <input type="text" placeholder="Price" value={newProductItem.price} onChange={e => setNewProductItem({ ...newProductItem, price: e.target.value })} />
                                            <input type="text" placeholder="Price with Transport" value={newProductItem.priceWithTransport} onChange={e => setNewProductItem({ ...newProductItem, priceWithTransport: e.target.value })} />
                                            <input type="text" placeholder="Unit" value={newProductItem.unit} onChange={e => setNewProductItem({ ...newProductItem, unit: e.target.value })} />
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
                {/* {showModal && (
                    <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add New Inventory Item</h2>
                            </div>
                            <div className="modal-body">
                                <input type="text" placeholder="Part Number" value={newProductItem.partNumber} onChange={e => setNewProductItem({ ...newProductItem, partNumber: e.target.value })} />
                                <input type="text" placeholder="Size" value={newProductItem.size} onChange={e => setNewProductItem({ ...newProductItem, size: e.target.value })} />
                                <input type="text" placeholder="Product Type" value={newProductItem.productType} onChange={e => setNewProductItem({ ...newProductItem, productType: e.target.value })} />
                                <textarea placeholder="Description" value={newProductItem.description} onChange={e => setNewProductItem({ ...newProductItem, description: e.target.value })} />
                                <input type="text" placeholder="Product Type" value={newProductItem.productType} onChange={e => setNewProductItem({ ...newProductItem, productType: e.target.value })} />
                                <input type="text" placeholder="Length" value={newProductItem.length} onChange={e => setNewProductItem({ ...newProductItem, length: e.target.value })} />
                                <input type="text" placeholder="Price" value={newProductItem.price} onChange={e => setNewProductItem({ ...newProductItem, price: e.target.value })} />
                                <input type="text" placeholder="Price with Transport" value={newProductItem.priceWithTransport} onChange={e => setNewProductItem({ ...newProductItem, priceWithTransport: e.target.value })} />
                                <input type="text" placeholder="Unit" value={newProductItem.unit} onChange={e => setNewProductItem({ ...newProductItem, unit: e.target.value })} />
                                <input type="text" placeholder="Category Name" value={newProductItem.categoryName} onChange={e => setNewProductItem({ ...newProductItem, categoryName: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button onClick={handleAddProducts}>Add Item</button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default Inventory;
