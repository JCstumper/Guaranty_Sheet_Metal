import React, { useState, useEffect, useContext } from 'react';
import Topbar from './components/topbar';
import './Orders.css';
import { AppContext } from './App';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';


const Orders = ({ setAuth }) => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { API_BASE_URL } = useContext(AppContext);
    const [lowInventoryItems, setLowInventoryItems] = useState([]);
    const [outOfStockItems, setOutOfStockItems] = useState([]);
    const [newOrderItems, setNewOrderItems] = useState([
        {
            amount_to_order: 15 // Default amount to order for a new item
        }
    ]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);


    // State to track the selected order ID for expansion
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const selectedOrder = orders.find(order => order.invoice_id === selectedOrderId);

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

    const openDeleteModal = (orderId) => {
        setShowDeleteModal(true);
        setOrderToDelete(orderId);
    };
    
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setOrderToDelete(null);
    };
    
    const confirmDelete = async () => {
        if (orderToDelete) {
            await handleDeleteOrder(orderToDelete);
            closeDeleteModal();
        }
    };
    
    const handleSelectOrder = async (invoiceId) => {
        // Determine if we're deselecting or switching orders
        const isDeselectingOrSwitching = selectedOrderId && (selectedOrderId !== invoiceId);

        // If deselecting or switching orders, attempt to update the amounts
        if (isDeselectingOrSwitching) {
            await updateAmountsToOrder();
        }

        // Toggle selection logic
        setSelectedOrderId(prev => prev !== invoiceId ? invoiceId : null);

        // Prevent fetching and updating if we're just deselecting the current order
        if (selectedOrderId !== invoiceId && invoiceId !== null) {
            try {
                const status = await updateInventoryItems(invoiceId);
                if (status) {
                    await fetchCurrentItems(invoiceId);
                } else {
                    console.error('Order details not found or missing status.');
                }
            } catch (error) {
                console.error('Error handling order selection:', error);
            }
        }
    };


    const fetchNewOrderItems = async (invoiceId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/${invoiceId}/new-order-items`);
            if (!response.ok) throw new Error('Failed to fetch new order items');
            const data = await response.json();
            const itemsWithAmount = data.map(item => ({
                ...item,
                amount_to_order: item.amount_to_order || 15 // Ensure amount_to_order is at least 15
            }));
            setNewOrderItems(itemsWithAmount);
        } catch (error) {
            console.error('Error fetching new order items:', error);
            // Handle error appropriately
        }
    };

    const fetchCurrentItems = async (invoiceId) => {
        try {
            // Fetch low inventory and out of stock items in parallel
            const [lowInventoryResponse, outOfStockResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/purchases/${invoiceId}/low-inventory`),
                fetch(`${API_BASE_URL}/purchases/${invoiceId}/out-of-stock`)
            ]);

            if (!lowInventoryResponse.ok || !outOfStockResponse.ok) {
                throw new Error('Failed to fetch order items');
            }

            let lowInventoryData = await lowInventoryResponse.json();
            let outOfStockData = await outOfStockResponse.json();

            // Fetch and process new order items using the dedicated function
            // This ensures amount_to_order is correctly handled for each item
            await fetchNewOrderItems(invoiceId);

            // Since fetchNewOrderItems updates newOrderItems directly,
            // you need to handle low inventory and out of stock items next

            // Assuming you have already updated newOrderItems in the state
            // You now filter lowInventoryData and outOfStockData to exclude items already in newOrderItems
            // This assumes you have a way to identify those items, e.g., by part number
            const newOrderPartNumbers = new Set(newOrderItems.map(item => item.part_number));

            lowInventoryData = lowInventoryData.filter(item => !newOrderPartNumbers.has(item.part_number));
            outOfStockData = outOfStockData.filter(item => !newOrderPartNumbers.has(item.part_number));

            // Update state with fetched and filtered data
            setLowInventoryItems(lowInventoryData);
            setOutOfStockItems(outOfStockData);
        } catch (error) {
            console.error('Error fetching current items for the order:', error);
        }
    };

    const updateInventoryItems = async (invoiceId) => {
        try {
            const orderDetailsResponse = await fetch(`${API_BASE_URL}/purchases/${invoiceId}`);
            if (!orderDetailsResponse.ok) {
                throw new Error(`HTTP error! status: ${orderDetailsResponse.status}`);
            }
            const orderDetails = await orderDetailsResponse.json();

            if (orderDetails && orderDetails.status === 'Building') {
                // If order is in 'Building' status, update low inventory and out-of-stock
                await Promise.all([
                    fetch(`${API_BASE_URL}/purchases/${invoiceId}/update-low-inventory`, { method: 'POST' }),
                    fetch(`${API_BASE_URL}/purchases/${invoiceId}/update-out-of-stock`, { method: 'POST' })
                ]);
            }

            return orderDetails.status;
        } catch (error) {
            console.error('Error updating inventory items:', error);
        }
    };

    const fetchInventoryAndOutOfStockItems = async (invoiceId) => {
        try {
            // Fetch related low inventory and out-of-stock items for the invoice
            const [lowInventoryResponse, outOfStockResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/purchases/${invoiceId}/low-inventory`),
                fetch(`${API_BASE_URL}/purchases/${invoiceId}/out-of-stock`)
            ]);

            if (!lowInventoryResponse.ok || !outOfStockResponse.ok) {
                throw new Error('Failed to fetch items');
            }

            const lowInventoryData = await lowInventoryResponse.json();
            const outOfStockData = await outOfStockResponse.json();

            // Update state with fetched data
            setLowInventoryItems(lowInventoryData);
            setOutOfStockItems(outOfStockData);
        } catch (error) {
            console.error('Error fetching inventory and out-of-stock items:', error);
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
                body: JSON.stringify({
                    ...newOrder,
                    total_cost: null, // Send null or '' as the total_cost
                }),
            });
            if (!response.ok) throw new Error('Failed to add order');
    
            const addedOrder = await response.json();
            setOrders(currentOrders => [...currentOrders, addedOrder]);
            setShowModal(false);
            setNewOrder({ supplier_name: '', total_cost: '', invoice_date: '', status: 'Building' }); // Reset the form
            toast.success('Order added successfully.');
        } catch (error) {
            console.error('Error adding order:', error);
            toast.error(`Failed to add order: ${error.message}`);
        }
    };
    

    const handleGenerateXLSX = async () => {
        if (!selectedOrderId) {
            toast.error('No order selected');
            return;
        }
    
        // Assuming 'selectedOrder' has the supplier name and invoice date
        const { supplier_name, invoice_date } = selectedOrder || {};
    
        if (!supplier_name || !invoice_date) {
            toast.error('Selected order does not have a supplier name or invoice date');
            return;
        }
    
        // Format the date to remove any slashes or spaces
        const formattedDate = invoice_date.replace(/[/\s]+/g, '-');
    
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/${selectedOrderId}/generate-xlsx`);
    
            if (response.ok) {
                const blob = await response.blob();
                // Use the supplier's name and invoice date in the filename
                saveAs(blob, `${supplier_name}_New_Order_${formattedDate}.xlsx`);
                toast.success('XLSX file generated successfully.');
            } else {
                throw new Error('Failed to generate XLSX file');
            }
        } catch (error) {
            console.error('Error generating XLSX:', error);
            toast.error('Failed to generate XLSX file');
        }
    };
    


    const handleAddToNewOrder = async (item, source, amountToOrder = 15) => {
        // Assuming 'selectedOrderId' is the current invoice ID you're working with
        try {
            await fetch(`${API_BASE_URL}/purchases/add-to-new-order/${selectedOrderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partNumber: item.part_number,
                    quantity: item.quantity,
                    source: source,
                    amount_to_order: item.amount_to_order || 15, // Ensure this value is correctly sourced
                }),
            });

            // Update UI accordingly
            setNewOrderItems(prevItems => [...prevItems, item]);
            if (source === 'lowInventory') {
                setLowInventoryItems(prevItems => prevItems.filter(i => i.part_number !== item.part_number));
            } else if (source === 'outOfStock') {
                setOutOfStockItems(prevItems => prevItems.filter(i => i.part_number !== item.part_number));
            }
        } catch (error) {
            console.error('Error adding item to new order:', error);
        }
    };



    const handleRemoveFromNewOrder = async (index) => {
        const item = newOrderItems[index];

        // Determine the correct source based on the item's quantity
        const source = item.quantity <= 30 ? 'lowInventory' : 'outOfStock';

        try {
            const response = await fetch(`${API_BASE_URL}/purchases/remove-from-new-order/${selectedOrderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partNumber: item.part_number,
                    quantity: item.quantity,
                    source: source,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove the item from the newOrderItems state to update the UI
            setNewOrderItems((prevItems) => prevItems.filter((_, i) => i !== index));

            // Re-fetch low inventory and out-of-stock items to update the state
            await fetchInventoryAndOutOfStockItems(selectedOrderId);

        } catch (error) {
            console.error('Error removing item from new order:', error);
        }
    };



    const handleAddAllToNewOrder = async (items, source) => {
        // Assuming 'selectedOrderId' is the current invoice ID you're working with
        const addItemsPromises = items.map(item => {
            return fetch(`${API_BASE_URL}/purchases/add-to-new-order/${selectedOrderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partNumber: item.part_number,
                    quantity: item.quantity,
                    amount_to_order: item.amount_to_order, // Ensure this value is correctly sourced
                    source: source,
                }),
            });
        });

        try {
            await Promise.all(addItemsPromises);

            // Update UI accordingly
            setNewOrderItems(prevItems => [...prevItems, ...items]);
            if (source === 'lowInventory') {
                setLowInventoryItems([]);
            } else if (source === 'outOfStock') {
                setOutOfStockItems([]);
            }

            // Optionally, re-fetch low inventory and out-of-stock items to update the state
            await fetchInventoryAndOutOfStockItems(selectedOrderId);
        } catch (error) {
            console.error('Error adding all items to new order:', error);
        }
    };


    const updateOrderStatus = async (orderId, newStatus) => {
        // Ensure amounts to order are updated before changing status
        await updateAmountsToOrder();
    
        // Prepare items data for updating inventory
        // Assuming we want to update inventory when status changes to 'Received'
        const itemsData = (newStatus === 'Generated' || newStatus === 'Received') ? newOrderItems.map(item => ({
            partNumber: item.part_number,
            amountToOrder: item.amount_to_order // Correct key assumed
        })) : [];
    
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus,
                    items: itemsData,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
    
            // Refresh the orders list or perform other actions on success
            fetchOrders();
            toast.success(`Order status updated to ${newStatus}.`);
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error(`Failed to update order status: ${error.message}`);
        }
    };
    
    const handleAmountChange = async (event, partNumber) => {
        const newAmount = parseInt(event.target.value, 10);
        if (!newAmount) return; // Guard against invalid inputs

        // Update local state
        setNewOrderItems(prevItems =>
            prevItems.map(item =>
                item.part_number === partNumber ? { ...item, amount_to_order: newAmount } : item
            )
        );

        // Immediately update the backend
        try {
            await fetch(`${API_BASE_URL}/purchases/${selectedOrderId}/update-amounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: newOrderItems.map(({ part_number, amount_to_order }) => ({
                        partNumber: part_number,
                        amountToOrder: part_number === partNumber ? newAmount : amount_to_order,
                    })),
                }),
            });
        } catch (error) {
            console.error('Error updating amounts to order:', error);
        }
    };


    // This function updates the 'amount to order' for all items in the current order
    const updateAmountsToOrder = async () => {
        if (!selectedOrderId || !newOrderItems.length) return;

        try {
            const response = await fetch(`${API_BASE_URL}/purchases/${selectedOrderId}/update-amounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: newOrderItems.map(({ part_number, amount_to_order }) => ({
                        partNumber: part_number,
                        amountToOrder: amount_to_order,
                    })),
                }),
            });

            if (!response.ok) throw new Error('Failed to update amounts to order');

            // Optionally, do something on success (e.g., display a message)
        } catch (error) {
            console.error('Error updating amounts to order:', error);
        }
    };

    // Inside the Orders component...

    const handleDeleteOrder = async (invoiceId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/purchases/${invoiceId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete order');
    
            // Remove the deleted order from the state to update the UI
            setOrders(currentOrders => currentOrders.filter(order => order.invoice_id !== invoiceId));
            toast.success('Order successfully deleted.');
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error(`Failed to delete order: ${error.message}`);
        }
    };
    

    const editTotalCost = async (invoiceId) => {
        const newTotalCost = prompt("Enter new total cost:");
        if (newTotalCost) {
            try {
                const response = await fetch(`${API_BASE_URL}/purchases/${invoiceId}/edit-total-cost`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ total_cost: newTotalCost }),
                });
                if (!response.ok) throw new Error('Failed to update total cost');
                toast.success("Total cost updated successfully.");
                fetchOrders(); // Refresh orders to show updated cost
            } catch (error) {
                console.error('Error updating total cost:', error);
                toast.error(`Failed to update total cost: ${error.message}`);
            }
        }
    };
    

    // Call this function when an order is closed or its status is updated
    // For example, you could call `updateAmountsToOrder` before changing the status or before deselecting the order


    return (
        <div className="orders">
            <Topbar setAuth={setAuth} />
            <div className="orders-main">
                <div className="order-table">
                    <div className="table-header">
                        <span className="table-title"><strong>ORDERS</strong></span>
                        <div className="actions">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search orders..."
                                value={filter}
                                onChange={handleFilterChange}
                            />
                            <button onClick={handleToggleModal} className="add-button">+</button>
                        </div>
                    </div>
                    <div className="table-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Supplier Name</th> {/* No change needed */}
                                    <th>Shipping Costs</th>
                                    <th>Invoice Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, index) => (
                                    <React.Fragment key={order.invoice_id}>
                                        <tr key={order.invoice_id} onClick={() => handleSelectOrder(order.invoice_id)}>
                                            <td>{order.supplier_name}</td>
                                            <td>{order.total_cost}
                                                {order.status === "Generated" && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent triggering handleSelectOrder
                                                            editTotalCost(order.invoice_id); // Pass the order ID to edit function
                                                        }} className="edit-button">
                                                        Add Shipping Cost
                                                    </button>
                                                )}
                                            </td>
                                            <td>{order.invoice_date}</td>
                                            <td>
                                                {order.status}
                                            </td>
                                            <td>
                                                {order.status === "Building" && (
                                                    <button onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering handleSelectOrder
                                                        updateOrderStatus(order.invoice_id, "Generated");
                                                    }} className="mark-as-generated">
                                                        Mark as Generated
                                                    </button>
                                                )}
                                                {order.status === "Generated" && (
                                                    <button onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering handleSelectOrder
                                                        updateOrderStatus(order.invoice_id, "Received");
                                                    }} className="mark-as-received">
                                                        Mark as Received
                                                    </button>
                                                )}

                                            <button onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering handleSelectOrder
                                                openDeleteModal(order.invoice_id);
                                            }} className="delete-button">
                                                Delete
                                            </button>

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
                                                            {selectedOrder && selectedOrder.status === "Building" && (
                                                                <div className="parts-subsection low-stock">
                                                                    <h5>Low Inventory</h5>
                                                                    <button onClick={() => handleAddAllToNewOrder(lowInventoryItems, 'lowInventory')}className="add-all">
                                                                        Add All to Order
                                                                    </button>
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
                                                                                <td>{item.quantity}</td>
                                                                                <td>
                                                                                    {selectedOrder && selectedOrder.status === "Building" ? (
                                                                                        <button onClick={() => handleAddToNewOrder(item, 'lowInventory')} className="add-order">
                                                                                            Add to Order
                                                                                        </button>
                                                                                    ) : "N/A"}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                </div>
                                                            )}


                                                            {/* Out of Stock Section */}
                                                            {selectedOrder && selectedOrder.status === "Building" && (
                                                                <div className="parts-subsection out-of-stock">
                                                                    <h5>Out of Stock</h5>
                                                                    <button onClick={() => handleAddAllToNewOrder(outOfStockItems, 'outOfStock')} className="add-all">
                                                                        Add All to Order
                                                                    </button>
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
                                                                                <td>{item.quantity}</td>
                                                                                <td>
                                                                                    {selectedOrder && selectedOrder.status === "Building" ? (
                                                                                        <button onClick={() => handleAddToNewOrder(item, 'outOfStock')} className="add-order">
                                                                                            Add to Order
                                                                                        </button>
                                                                                    ) : "N/A"}

                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                </div>
                                                            )}
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
                                                                            <th>Amount to Order</th> {/* Add this line */}
                                                                            <th>Action</th> {/* For remove button */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {/*In your New Order Section where you map over `newOrderItems` to display rows*/}
                                                                        {newOrderItems.map((item, index) => (
                                                                            <tr key={index}>
                                                                                <td>{item.part_number}</td>
                                                                                <td>{item.material_type}</td>
                                                                                <td>{item.description}</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>
                                                                                    {selectedOrder && selectedOrder.status === "Building" ? (
                                                                                        <input
                                                                                            type="number"
                                                                                            value={item.amount_to_order || 15}
                                                                                            onChange={(e) => handleAmountChange(e, item.part_number)}
                                                                                        />
                                                                                    ) : (
                                                                                        <span>{item.amount_to_order}</span> // Display as text when not "Building"
                                                                                    )}
                                                                                </td>
                                                                                <td>
                                                                                    {selectedOrder && selectedOrder.status === "Building" ? (
                                                                                        <button onClick={() => handleRemoveFromNewOrder(index, item.part_number)}className="remove-button">
                                                                                            Remove
                                                                                        </button>
                                                                                    ) : "N/A"} {/* Only show 'Remove' button if status is "Building" */}
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
                {showModal && (
                    <div className="modal-backdrop" onClick={e => e.stopPropagation()}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add New Order</h2>
                                <button onClick={handleToggleModal} className="modal-close-button">×</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="supplier_name">Supplier Name:</label>
                                    <input type="text" id="supplier_name" name="supplier_name" placeholder="Supplier Name" value={newOrder.supplier_name} onChange={handleInputChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="invoice_date">Invoice Date:</label>
                                    <input type="date" id="invoice_date" name="invoice_date" value={newOrder.invoice_date} onChange={handleInputChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">Status:</label>
                                    <input type="text" id="status" name="status" value={newOrder.status} disabled />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" onClick={handleAddOrder} className="btn-primary">Add Order</button>
                                <button type="button" onClick={handleToggleModal} className="btn-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                {showDeleteModal && (
                    <div className="modal-backdrop" onClick={e => e.stopPropagation()}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Confirm Deletion</h2>
                                <button onClick={closeDeleteModal} className="modal-close-button">×</button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this order? This action cannot be undone.</p>
                            </div>
                            <div className="modal-actions">
                                <button onClick={confirmDelete} className="btn-primary">Delete Order</button>
                                <button onClick={closeDeleteModal} className="btn-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;

