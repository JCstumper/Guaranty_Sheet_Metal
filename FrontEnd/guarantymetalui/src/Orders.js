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

    // Additional function to fetch parts information
    const fetchPartsDetails = async (orderId) => {
        // Fetch parts details for the selected order here
        // You may want to save this data to the state
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

    return (
        <div className="orders">
            <Topbar setAuth={setAuth} />
            <div className="orders-main">
                <div className="order-table">
                    <div className="table-header">
                        <span>Orders</span>
                        <button onClick={handleToggleModal} className="add-button">Add Order</button>
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
                                    // Fragment to wrap multiple elements without adding extra nodes to the DOM
                                    <React.Fragment key={index}>
                                        {/* Clickable row to toggle the detail view */}
                                        <tr onClick={() => handleSelectOrder(order.invoice_id)}>
                                            <td>{order.supplier_name}</td>
                                            <td>{order.total_cost}</td>
                                            <td>{order.invoice_date}</td>
                                            <td>{order.status}</td>
                                        </tr>
                                        {/* Conditional rendering for the expanded section */}
                                        {selectedOrderId === order.invoice_id && (
                                            <tr className="expanded-details">
                                                <td colSpan="4">
                                                    {/* Placeholder for your expanded details */}
                                                    <div className="order-details-expanded">
                                                        {/* Button to generate XLSX */}
                                                        <button className="generate-xlsx-button">Generate XLSX</button>
                                                        <div className="parts-section-container">
                                                            <h4>Parts</h4>
                                                            {/* Low Inventory Section */}
                                                            <div className="parts-subsection">
                                                                <h5>Low Inventory</h5>
                                                                {/* Placeholder for Low Inventory parts list */}
                                                            </div>
                                                            {/* Out of Stock Section */}
                                                            <div className="parts-subsection">
                                                                <h5>Out of Stock</h5>
                                                                {/* Placeholder for Out of Stock parts list */}
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

