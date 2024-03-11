import React, { useState, useEffect } from 'react';
import Topbar from './components/topbar';
import './Inventory.css';

const Inventory = ({ setAuth }) => {
    const [materials, setMaterials] = useState([]);
    const [filter, setFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newInventoryItem, setNewInventoryItem] = useState({
        partNumber: '', // maps to part_number
        size: '',
        materialType: '', // maps to material_type
        description: '',
        productType: '', // maps to product_type
        length: '', // should be a string that can be converted to DECIMAL
        price: '', // should be a string that can be converted to DECIMAL
        priceWithTransport: '', // should be a string that can be converted to DECIMAL
        unit: '',
        categoryName: '', // maps to category_name
    });
    
    

    // Function to fetch materials from your API
    const fetchMaterials = async () => {
        try {
            const response = await fetch('http://localhost:3000/products');
            const jsonData = await response.json();
            // console.log(jsonData.rows);
            console.log(jsonData.products.rows);
            // jsonData.rows.forEach((rows, index) => {
            //     console.log(`Row ${index}:`, rows);
            // });
            setMaterials(jsonData.products.rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase());
    };

    const handleAddInventory = async () => {
        console.log("Attempting to add inventory item..."); // Debug log
        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newInventoryItem),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            setShowModal(false); // Close modal
            fetchMaterials(); // Refresh materials list
            setNewInventoryItem({
                partNumber: '', // maps to part_number
                size: '',
                materialType: '', // maps to material_type
                description: '',
                productType: '', // maps to product_type
                length: '', // should be a string that can be converted to DECIMAL
                price: '', // should be a string that can be converted to DECIMAL
                priceWithTransport: '', // should be a string that can be converted to DECIMAL
                unit: '',
                categoryName: '', // maps to category_name
            }); // Reset form
        } catch (error) {
            console.error('Error adding inventory item:', error);
        }
    };
    
    const filteredMaterials = materials.filter(material =>
        material.description.toLowerCase().includes(filter) ||
        material.material_type.toLowerCase().includes(filter)
    );

    return (
        <div className="inventory">
            <Topbar setAuth={setAuth} />
            <div className="inventory-main">
                <div className="material-table">
                    <div className="table-header">
                        <span className="table-title">Inventory</span>
                        <button className="add-button" onClick={() => setShowModal(true)}>+</button>
                    </div>
                    <table className="table-content">
                        <thead>
                            <tr>
                                <th>Part Number</th>
                                <th>Material</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Cost</th>
                                <th>Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaterials.map((material, index) => (
                                <tr key={index}>
                                    <td>{material.part_number}</td>
                                    <td>{material.material_type}</td>
                                    <td>{material.description}</td>
                                    <td>{material.quantity}</td>
                                    <td>${material.price}</td>
                                    <td>{material.size}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="filtering-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Filter materials..."
                        onChange={handleFilterChange}
                    />
                </div>
                {showModal && (
                    <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add New Inventory Item</h2>
                            </div>
                            <div className="modal-body">
                                <input type="text" placeholder="Part Number" value={newInventoryItem.partNumber} onChange={e => setNewInventoryItem({ ...newInventoryItem, partNumber: e.target.value })} />
                                <input type="text" placeholder="Size" value={newInventoryItem.size} onChange={e => setNewInventoryItem({ ...newInventoryItem, size: e.target.value })} />
                                <input type="text" placeholder="Material Type" value={newInventoryItem.materialType} onChange={e => setNewInventoryItem({ ...newInventoryItem, materialType: e.target.value })} />
                                <textarea placeholder="Description" value={newInventoryItem.description} onChange={e => setNewInventoryItem({ ...newInventoryItem, description: e.target.value })} />
                                <input type="text" placeholder="Product Type" value={newInventoryItem.productType} onChange={e => setNewInventoryItem({ ...newInventoryItem, productType: e.target.value })} />
                                <input type="text" placeholder="Length" value={newInventoryItem.length} onChange={e => setNewInventoryItem({ ...newInventoryItem, length: e.target.value })} />
                                <input type="text" placeholder="Price" value={newInventoryItem.price} onChange={e => setNewInventoryItem({ ...newInventoryItem, price: e.target.value })} />
                                <input type="text" placeholder="Price with Transport" value={newInventoryItem.priceWithTransport} onChange={e => setNewInventoryItem({ ...newInventoryItem, priceWithTransport: e.target.value })} />
                                <input type="text" placeholder="Unit" value={newInventoryItem.unit} onChange={e => setNewInventoryItem({ ...newInventoryItem, unit: e.target.value })} />
                                <input type="text" placeholder="Category Name" value={newInventoryItem.categoryName} onChange={e => setNewInventoryItem({ ...newInventoryItem, categoryName: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button onClick={handleAddInventory}>Add Item</button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
