import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App'; // Adjust the import based on your actual context file path
import './BarCard.css';

const BarCard = () => {
    const { API_BASE_URL } = useContext(AppContext); // Assuming the base URL is provided by the AppContext
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lowInventoryItems, setLowInventoryItems] = useState([]);
    const [outOfStockItems, setOutOfStockItems] = useState([]);

    useEffect(() => {
        fetchInventoryItems();
        fetchLowInventoryItems();
        fetchOutOfStockItems();
    }, []); // Dependency array is empty to ensure this runs only once

    const fetchInventoryItems = async () => {
        setLoading(true);
        await fetchLowInventoryItems();
        await fetchOutOfStockItems();
        setLoading(false);
    };

    const fetchLowInventoryItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/low-inventory`);
            const data = await response.json();
            if (response.ok) {
                setLowInventoryItems(data);
            } else {
                throw new Error('Failed to fetch low inventory items');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchOutOfStockItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/out-of-stock`);
            const data = await response.json();
            if (response.ok) {
                setOutOfStockItems(data);
            } else {
                throw new Error('Failed to fetch out of stock items');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="bar-card-container">
            {loading ? <p>Loading inventory...</p> : (
                <div className="bar-card">
                    <h2>Stock Level Dashboard</h2>
                    <div className="bar-content">
                        <table>
                            <thead>
                                <tr>
                                <th className="part-number-column-header">Part Number</th>
                                    <th>Material/Type</th>
                                    <th>Description</th>
                                    <th className="status-column-header">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...lowInventoryItems, ...outOfStockItems].map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.part_number}</td>
                                        <td>{item.material_type}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <div className={`status-box-dash ${item.quantity_in_stock === 0 ? 'red' : 'yellow'}`}>
                                                {item.quantity_in_stock === 0 ? 'Out of Stock' : 'Low Stock'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarCard;
