import React, { useState, useEffect } from 'react';
import Topbar from './components/topbar';
import './Orders.css';

const Orders = ({ setAuth, API_BASE_URL }) => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [newOrder, setNewOrder] = useState({
        supplier_id: '',
        total_cost: '',
        invoice_date: '',
        status: ''
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter(order =>
            order.supplier_id.toString().includes(filter) ||
            order.total_cost.toString().includes(filter) ||
            (order.invoice_date && order.invoice_date.includes(filter)) ||
            order.status.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredOrders(filtered);
    }, [filter, orders]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases`); // Adjust according to your API endpoint
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
            const response = await fetch(`${API_BASE_URL}/purchases`, { // Adjust according to your API endpoint
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
            setNewOrder({ supplier_id: '', total_cost: '', invoice_date: '', status: '' }); // Reset form fields
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
                                    <th>Supplier ID</th>
                                    <th>Total Cost</th>
                                    <th>Invoice Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, index) => (
                                    <tr key={index}>
                                        <td>{order.supplier_id}</td>
                                        <td>{order.total_cost}</td>
                                        <td>{order.invoice_date}</td>
                                        <td>{order.status}</td>
                                    </tr>
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
                                    <label htmlFor="supplier_id">Supplier ID:</label>
                                    <input type="number" id="supplier_id" name="supplier_id" value={newOrder.supplier_id} onChange={handleInputChange} required />

                                    <label htmlFor="total_cost">Total Cost:</label>
                                    <input type="text" id="total_cost" name="total_cost" value={newOrder.total_cost} onChange={handleInputChange} required />

                                    <label htmlFor="invoice_date">Invoice Date:</label>
                                    <input type="date" id="invoice_date" name="invoice_date" value={newOrder.invoice_date} onChange={handleInputChange} required />

                                    <label htmlFor="status">Status:</label>
                                    <input type="text" id="status" name="status" value={newOrder.status} onChange={handleInputChange} required />

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

