import React, { useState, useEffect } from 'react';
import './BarCard.css'; // Make sure to rename the corresponding CSS file as well

const BarCard = ({ API_BASE_URL }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to fetch inventory items based on stock status
    const fetchInventory = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Fetch low inventory items
            const lowResponse = await fetch(`${API_BASE_URL}/low-inventory`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            });
            const lowInventory = await lowResponse.json();

            // Fetch out of stock items
            const outResponse = await fetch(`${API_BASE_URL}/out-of-stock`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            });
            const outOfStockInventory = await outResponse.json();

            // Combine both lists and update the state
            setProducts([...lowInventory, ...outOfStockInventory]);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInventory();
        // Set up a timer to refresh inventory every 5 minutes
        const interval = setInterval(fetchInventory, 300000); // 300000 ms = 5 minutes
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [API_BASE_URL]);

    return (
        <div className="bar-card">
            {loading ? (
                <p>Loading inventory...</p>
            ) : (
                <div className="bar-card-main">
                    <div className="product-table">
                        <table className="bar-content">
                            <thead>
                                <tr>
                                    <th>Part Number</th>
                                    <th>Material/Type</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.part_number}</td>
                                        <td>{product.material_type}</td>
                                        <td>{product.description}</td>
                                        <td>
                                            <div className={`status-box ${product.quantity_in_stock === 0 ? 'red' : 'yellow'}`}>
                                                {product.quantity_in_stock === 0 ? 'Out of Stock' : 'Low Stock'}
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
