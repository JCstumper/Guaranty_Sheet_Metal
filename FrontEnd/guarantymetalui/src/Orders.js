import React, { useState, useEffect, useContext } from 'react';
import Topbar from './components/topbar';
import './Orders.css';
import { AppContext } from './App';

const Orders = ({ setAuth }) => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { API_BASE_URL } = useContext(AppContext);
    const [lowInventoryItems, setLowInventoryItems] = useState([]);
    const [outOfStockItems, setOutOfStockItems] = useState([]);
    const [newOrderItems, setNewOrderItems] = useState([]);



    // State to track the selected order ID for expansion
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Changed state to match updated field names
    const [newOrder, setNewOrder] = useState({
        supplier_name: '',
        total_cost: '',
        invoice_date: '',
        status: ''
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        // Change supplier_id to supplier_name
        const filtered = orders.filter(order =>
            order.supplier_name.toLowerCase().includes(filter.toLowerCase()) ||
            order.total_cost.toString().includes(filter) ||
            (order.invoice_date && order.invoice_date.includes(filter)) ||
            order.status.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredOrders(filtered);
    }, [filter, orders]);

    const handleSelectOrder = (invoiceId) => {
        // Set the selectedOrderId to the clicked order's ID
        // If the same order is clicked again, it will toggle (close)
        setSelectedOrderId(selectedOrderId !== invoiceId ? invoiceId : null);
    };


    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases`);
            const data = await response.json();
            if (response.ok) {
                setOrders(data);
            } else {
                throw new Error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleToggleModal = () => {
        setShowModal(!showModal);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/purchases`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });
            if (!response.ok) throw new Error('Failed to add order');

            const addedOrder = await response.json();
            setOrders(currentOrders => [...currentOrders, addedOrder]);
            setShowModal(false);
            setNewOrder({ supplier_name: '', total_cost: '', invoice_date: '', status: '' });
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    const handleGenerateXLSX = () => {
        console.log('Generating XLSX...');
        // Here you would implement the logic to generate and download the XLSX file.
        // You might use a library like xlsx or SheetJS for this.
    };

    useEffect(() => {
        fetchLowInventoryItems();
        fetchOutOfStockItems();
    }, []); // The empty array ensures these run only once when the component mounts

    const fetchLowInventoryItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/low-inventory`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLowInventoryItems(data);
        } catch (error) {
            console.error('Error fetching low inventory items:', error);
            // Optionally, set lowInventoryItems to an empty array or handle the error as needed
        }
    };

    const fetchOutOfStockItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/out-of-stock`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOutOfStockItems(data);
        } catch (error) {
            console.error('Error fetching out of stock items:', error);
            // Optionally, set outOfStockItems to an empty array or handle the error as needed
        }
    };

    const handleAddToNewOrder = (item, source) => {
        setNewOrderItems(prevItems => [...prevItems, item]);
        if (source === 'lowInventory') {
            setLowInventoryItems(prevItems => prevItems.filter(i => i.part_number !== item.part_number));
        } else if (source === 'outOfStock') {
            setOutOfStockItems(prevItems => prevItems.filter(i => i.part_number !== item.part_number));
        }
    };


    const handleRemoveFromNewOrder = (index) => {
        const item = newOrderItems[index];
        setNewOrderItems(prevItems => prevItems.filter((_, i) => i !== index));

        if (item.quantity_in_stock > 0 && item.quantity_in_stock <= 15) {
            setLowInventoryItems(prevItems => {
                const newItems = [...prevItems, item];
                return newItems.sort((a, b) => a.quantity_in_stock - b.quantity_in_stock);
            });
        } else if (item.quantity_in_stock === 0) {
            setOutOfStockItems(prevItems => {
                const newItems = [...prevItems, item];
                return newItems.sort((a, b) => a.part_number.localeCompare(b.part_number));
            });
        }
    };



    const handleAddAllToNewOrder = (items, source) => {
        setNewOrderItems(prevItems => [...prevItems, ...items]);
        if (source === 'lowInventory') {
            setLowInventoryItems([]);
        } else if (source === 'outOfStock') {
            setOutOfStockItems([]);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Assuming you have a method to re-fetch orders after status update
                fetchOrders();
            } else {
                // Handle error
                alert('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };


    return (
        <div className="orders">
            <Topbar setAuth={setAuth} />
            <div className="orders-main">
                <div className="order-table">
                    <div className="table-header">
                        <span className="table-title"><strong>ORDERS</strong></span>
                        <button onClick={handleToggleModal} className="add-button">+</button>
                    </div>
                    <div className="table-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Supplier Name</th> {/* No change needed */}
                                    <th>Total Cost</th>
                                    <th>Invoice Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, index) => (
                                    <React.Fragment key={order.invoice_id}>
                                        <tr key={order.invoice_id} onClick={() => handleSelectOrder(order.invoice_id)}>
                                            <td>{order.supplier_name}</td>
                                            <td>{order.total_cost}</td>
                                            <td>{order.invoice_date}</td>
                                            <td>
                                                {order.status}
                                                {order.status === "Building" && (
                                                    <button onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering handleSelectOrder
                                                        updateOrderStatus(order.invoice_id, "Generated");
                                                    }}>
                                                        Mark as Generated
                                                    </button>
                                                )}
                                                {order.status === "Generated" && (
                                                    <button onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering handleSelectOrder
                                                        updateOrderStatus(order.invoice_id, "Received");
                                                    }}>
                                                        Mark as Received
                                                    </button>
                                                )}
                                            </td>
                                        </tr>

                                        {selectedOrderId === order.invoice_id && (
                                            <tr className="expanded-details">
                                                <td colSpan="4">
                                                    <div className="order-details-expanded">
                                                        {/* Generate XLSX button */}
                                                        <button className="generate-xlsx-button" onClick={handleGenerateXLSX}>Generate XLSX</button>

                                                        {/* Parts Section Container */}
                                                        <div className="parts-section-container">
                                                            <h4>Parts</h4>
                                                            {/* Low Inventory Section */}
                                                            <div className="parts-subsection low-stock">
                                                                <h5>Low Inventory</h5>
                                                                <button onClick={() => handleAddAllToNewOrder(lowInventoryItems, 'lowInventory')}>Add All to Order</button>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Part Number</th>
                                                                            <th>Material</th>
                                                                            <th>Description</th>
                                                                            <th>Quantity in Stock</th>
                                                                            <th>Action</th> {/* For add button */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {lowInventoryItems.map((item) => (
                                                                            <tr key={item.part_number}>
                                                                                <td>{item.part_number}</td>
                                                                                <td>{item.material_type}</td>
                                                                                <td>{item.description}</td>
                                                                                <td>{item.quantity_in_stock}</td>
                                                                                <td>
                                                                                    <button onClick={() => handleAddToNewOrder(item, 'lowInventory')}>Add to Order</button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* Out of Stock Section */}
                                                            <div className="parts-subsection out-of-stock">
                                                                <h5>Out of Stock</h5>
                                                                <button onClick={() => handleAddAllToNewOrder(outOfStockItems, 'outOfStock')}>Add All to Order</button>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Part Number</th>
                                                                            <th>Material</th>
                                                                            <th>Description</th>
                                                                            <th>Quantity in Stock</th>
                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {outOfStockItems.map((item) => (
                                                                            <tr key={item.part_number}>
                                                                                <td>{item.part_number}</td>
                                                                                <td>{item.material_type}</td>
                                                                                <td>{item.description}</td>
                                                                                <td>{item.quantity_in_stock}</td>
                                                                                <td>
                                                                                    <button onClick={() => handleAddToNewOrder(item, 'outOfStock')}>Add to Order</button>

                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* New Order Section */}
                                                            <div className="parts-subsection new-order">
                                                                <h5>New Order</h5>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Part Number</th>
                                                                            <th>Material</th>
                                                                            <th>Description</th>
                                                                            <th>Quantity in Stock</th>
                                                                            <th>Action</th> {/* For remove button */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {newOrderItems.map((item, index) => (
                                                                            <tr key={index}>
                                                                                <td>{item.part_number}</td>
                                                                                <td>{item.material_type}</td>
                                                                                <td>{item.description}</td>
                                                                                <td>{item.quantity_in_stock}</td>
                                                                                <td>
                                                                                    <button onClick={() => handleRemoveFromNewOrder(index)}>Remove</button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="4">No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="filtering-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Filter orders..."
                        value={filter}
                        onChange={handleFilterChange}
                    />
                </div>
                {showModal && (
                    <div className="modalAddOrder">
                        <div className="modalAddOrder-content">
                            <div className="modalAddOrder-header">
                                <h2>Add New Order</h2>
                                <button onClick={handleToggleModal} className="close-modalAddOrder">X</button>
                            </div>
                            <div className="modalAddOrder-body">
                                <form onSubmit={handleAddOrder}>
                                    {/* Updated to supplier_name */}
                                    <label htmlFor="supplier_name">Supplier Name:</label>
                                    <input type="text" id="supplier_name" name="supplier_name" placeholder="Supplier Name" value={newOrder.supplier_name} onChange={handleInputChange} required />

                                    {/* Updated to format as currency */}
                                    <label htmlFor="total_cost">Total Cost:</label>
                                    <input type="text" id="total_cost" name="total_cost" placeholder="Total Cost i.e. 1200.00" value={newOrder.total_cost} onChange={handleInputChange} required />

                                    {/* Updated to accept only date */}
                                    <label htmlFor="invoice_date">Invoice Date:</label>
                                    <input type="date" id="invoice_date" name="invoice_date" value={newOrder.invoice_date} onChange={handleInputChange} required />

                                    <label htmlFor="status">Status:</label>
                                    <input type="text" id="status" name="status" placeholder="Paid/Unpaid/Ordered" value={newOrder.status} onChange={handleInputChange} required />

                                    <div className="modalAddOrder-footer">
                                        <button type="submit" className="btn btn-primary">Add Order</button>
                                        <button type="button" onClick={handleToggleModal} className="btn btn-secondary">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

