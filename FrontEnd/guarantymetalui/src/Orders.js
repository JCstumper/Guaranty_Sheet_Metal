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
    // Remove global states for lowInventoryItems and outOfStockItems
    // Replace with an order-specific parts mapping
    const [orderParts, setOrderParts] = useState({}); // Make sure any code accessing orderParts[x] initializes it as {} if it could be undefined.
    const [newOrderItems, setNewOrderItems] = useState([]);

    // State to track the selected order ID for expansion
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Changed state to match updated field names
    const [newOrder, setNewOrder] = useState({
        supplier_name: '',
        total_cost: '',
        invoice_date: '',
        status: 'Building'
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

    const handleSelectOrder = async (invoiceId) => {
        // Deselect if the same order is clicked
        if (selectedOrderId === invoiceId) {
            setSelectedOrderId(null);
            // Optionally reset or clear the previous order's data here if necessary
        } else {
            // Select the new order and fetch its details
            setSelectedOrderId(invoiceId);
            await fetchOrderParts(invoiceId);
        }
    };


    const fetchOrderParts = async (orderId) => {
        try {
            // These URLs should match the actual endpoints defined in your backend.
            const lowInventoryResponse = await fetch(`${API_BASE_URL}/purchases/inventory/low`);
            const outOfStockResponse = await fetch(`${API_BASE_URL}/purchases/inventory/out-of-stock`);

            if (!lowInventoryResponse.ok || !outOfStockResponse.ok) throw new Error('Failed to fetch parts data');

            const lowInventoryItems = await lowInventoryResponse.json();
            const outOfStockItems = await outOfStockResponse.json();

            // Initialize or update parts for the selected order.
            // Note: You might want to consider how orderId is used since these endpoints no longer depend on it.
            setOrderParts(prev => ({
                ...prev,
                [orderId]: {
                    ...prev[orderId],
                    lowInventoryItems: lowInventoryItems.map(item => ({ ...item, source: 'lowInventoryItems' })),
                    outOfStockItems: outOfStockItems.map(item => ({ ...item, source: 'outOfStockItems' })),
                    // Preserves newOrderItems previously added or initializes if none.
                    newOrderItems: prev[orderId]?.newOrderItems || []
                }
            }));
        } catch (error) {
            console.error('Error fetching parts data:', error);
        }
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

    const fetchLowInventoryItems = async (orderId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/${orderId}/low-inventory`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Update the orderParts state with the fetched data
            setOrderParts(prevOrderParts => ({
                ...prevOrderParts,
                [orderId]: {
                    ...prevOrderParts[orderId],
                    lowInventoryItems: data,
                },
            }));
        } catch (error) {
            console.error(`Error fetching low inventory items for order ${orderId}:`, error);
        }
    };


    const fetchOutOfStockItems = async (orderId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/${orderId}/out-of-stock`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Update the orderParts state with the fetched data
            setOrderParts(prevOrderParts => ({
                ...prevOrderParts,
                [orderId]: {
                    ...prevOrderParts[orderId],
                    outOfStockItems: data,
                },
            }));
        } catch (error) {
            console.error(`Error fetching out of stock items for order ${orderId}:`, error);
        }
    };


    const handleAddToNewOrder = (item, source) => {
        if (!selectedOrderId) return;

        setOrderParts(prev => {
            // Ensure we're working with a defined object for the current order.
            const currentOrderParts = prev[selectedOrderId] || { lowInventoryItems: [], outOfStockItems: [], newOrderItems: [] };

            // Double-check that the source list exists and is an array.
            const sourceList = Array.isArray(currentOrderParts[source]) ? currentOrderParts[source] : [];

            // Create a new item with an ensured orderQuantity property.
            const newItem = { ...item, orderQuantity: item.orderQuantity || 1 };

            // Filter the source list to exclude the item being moved to newOrderItems.
            const updatedSourceList = sourceList.filter(i => i.part_number !== item.part_number);

            // Add the new item to the newOrderItems array.
            const updatedNewOrderItems = [...currentOrderParts.newOrderItems, newItem];

            return {
                ...prev,
                [selectedOrderId]: {
                    ...currentOrderParts,
                    [source]: updatedSourceList,
                    newOrderItems: updatedNewOrderItems,
                },
            };
        });
    };



    const handleRemoveFromNewOrder = (index) => {
        if (!selectedOrderId) return;

        setOrderParts(prevOrderParts => {
            const currentOrderParts = prevOrderParts[selectedOrderId];
            if (!currentOrderParts) return prevOrderParts;

            const itemToRemove = currentOrderParts.newOrderItems[index];
            if (!itemToRemove) return prevOrderParts;

            // Remove the item from newOrderItems
            const updatedNewOrderItems = currentOrderParts.newOrderItems.filter((_, i) => i !== index);

            // Decide where to return the removed item based on its quantity_in_stock
            const updatedSource = itemToRemove.quantity_in_stock > 0 && itemToRemove.quantity_in_stock <= 15
                ? 'lowInventoryItems'
                : 'outOfStockItems';

            // Return the removed item to its source list, if applicable
            const updatedSourceList = [...(currentOrderParts[updatedSource] || []), itemToRemove];

            return {
                ...prevOrderParts,
                [selectedOrderId]: {
                    ...currentOrderParts,
                    newOrderItems: updatedNewOrderItems,
                    [updatedSource]: updatedSourceList
                }
            };
        });
    };






    const handleAddAllToNewOrder = (source) => {
        if (!selectedOrderId) return;

        setOrderParts(prev => {
            const currentOrderParts = prev[selectedOrderId] || { lowInventoryItems: [], outOfStockItems: [], newOrderItems: [] };
            // Move all items from the source list to the newOrderItems list
            const allItems = currentOrderParts[source].map(item => ({ ...item, orderQuantity: 1 }));
            const updatedNewOrderItems = [...currentOrderParts.newOrderItems, ...allItems];

            return {
                ...prev,
                [selectedOrderId]: {
                    ...currentOrderParts,
                    [source]: [], // Clear the source list
                    newOrderItems: updatedNewOrderItems
                }
            };
        });
    };



    const updateOrderStatus = async (orderId, newStatus, items) => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, items }),
            });

            if (response.ok) {
                // Assuming you have a method to re-fetch and update the list of orders in your state
                fetchOrders();
                console.log('Order status updated successfully');
                // Optionally, navigate the user to a different page or show a success message
            } else {
                // When the server responded with a status code that falls out of the range of 2xx
                console.error('Failed to update order status');
                // Show an error message to the user
                alert('Failed to update order status. Please try again.');
            }
        } catch (error) {
            // When there was an error sending the request
            console.error('Error updating order status:', error);
            alert('Error updating order status. Please check your internet connection and try again.');
        }
    };


    // Method to update order quantity for a specific item
    const updateOrderQuantity = (index, quantity) => {
        setNewOrderItems(prevItems =>
            prevItems.map((item, idx) => idx === index ? { ...item, orderQuantity: quantity } : item)
        );
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

                                        {selectedOrderId === order.invoice_id && orderParts[selectedOrderId] && (
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
                                                                <button onClick={() => handleAddAllToNewOrder(orderParts[selectedOrderId].lowInventoryItems, 'lowInventory')}>Add All to Order</button>
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
                                                                        {orderParts[selectedOrderId]?.lowInventoryItems?.map((item) => (
                                                                            <tr key={item.part_number}>
                                                                                <td>{item.part_number}</td>
                                                                                <td>{item.material_type}</td>
                                                                                <td>{item.description}</td>
                                                                                <td>{item.quantity_in_stock}</td>
                                                                                <td>
                                                                                    <button onClick={() => handleAddToNewOrder(item, 'lowInventory')}>Add to Order</button>
                                                                                </td>
                                                                            </tr>
                                                                        )) ?? <tr><td colSpan="5">No low inventory items found</td></tr>}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* Out of Stock Section */}
                                                            <div className="parts-subsection out-of-stock">
                                                                <h5>Out of Stock</h5>
                                                                <button onClick={() => handleAddAllToNewOrder(orderParts[selectedOrderId].outOfStockItems, 'outOfStock')}>Add All to Order</button>
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
                                                                        {orderParts[selectedOrderId]?.outOfStockItems?.map((item) => (
                                                                            <tr key={item.part_number}>
                                                                                <td>{item.part_number}</td>
                                                                                <td>{item.material_type}</td>
                                                                                <td>{item.description}</td>
                                                                                <td>{item.quantity_in_stock}</td>
                                                                                <td>
                                                                                    <button onClick={() => handleAddToNewOrder(item, 'outOfStock')}>Add to Order</button>

                                                                                </td>
                                                                            </tr>
                                                                        )) ?? <tr><td colSpan="5">No out of stock items found</td></tr>}
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
                                                                            <th>Amount to Order</th> {/* New column for amount to order */}
                                                                            <th>Action</th> {/* For remove button */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {selectedOrderId && orderParts[selectedOrderId]?.newOrderItems.map((item, index) => (
                                                                            <tr key={index}>
                                                                                <td>{item.part_number}</td>
                                                                                <td>{item.material_type}</td>
                                                                                <td>{item.description}</td>
                                                                                <td>{item.quantity_in_stock}</td>
                                                                                <td>
                                                                                    <input
                                                                                        type="number"
                                                                                        value={item.orderQuantity}
                                                                                        onChange={(e) => updateOrderQuantity(index, parseInt(e.target.value, 10))}
                                                                                        min="1"
                                                                                    />
                                                                                </td>
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
                                    {/* Display the status as a non-editable field */}
                                    <input type="text" id="status" name="status" value={newOrder.status} disabled />

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