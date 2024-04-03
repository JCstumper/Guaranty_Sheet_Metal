import React, { useState, useEffect} from 'react';
import './Inventory.css';
import Topbar from './components/topbar';
import AddProduct from './components/AddProduct';
import { toast } from 'react-toastify';

const Inventory = ({ setAuth, API_BASE_URL }) => {
    const [products, setProducts] = useState([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState(null);
    const [filter, setFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditQuantityModal, setShowEditQuantityModal] = useState(false);
    const [editItem, setEditItem] = useState({ partNumber: '', quantityInStock: 0 });
    const [sortColumn, setSortColumn] = useState(null); // e.g., 'part_number', 'quantity_in_stock'
    const [sortDirection, setSortDirection] = useState('ascending'); // or 'descending'
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePartNumber, setDeletePartNumber] = useState(null);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [editProductItem, setEditProductItem] = useState(null);

    const [filterOptions, setFilterOptions] = useState({
        radius_size: [],
        material_type: [],
        color: [],
        type: [],
    });
    const [activeFilters, setActiveFilters] = useState({
        radius_size: [],
        material_type: [],
        color: [],
        type: [],
    });
    
    const fetchProductsWithInventory = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/with-inventory`);
            const jsonData = await response.json();
            
            if (Array.isArray(jsonData.products)) {
                setProducts(jsonData.products);
            } else {
                console.error('Unexpected response format:', jsonData);
                setProducts([]); // Set to an empty array or handle appropriately
            }
            
        } catch (error) {
            console.error('Error fetching products with inventory:', error);
            setProducts([]); // Ensure products is always an array
        }
    };
    

    useEffect(() => {
        // fetchProducts();
        fetchProductsWithInventory();
    }, []);

    useEffect(() => {
        // Dynamically generate filter options based on products data
        const generateOptions = (items) => {
            let options = [...new Set(items.map(item => item ?? '(blank)').filter((item, index, array) => array.indexOf(item) === index))];
            // Remove '(blank)' if it exists to sort the rest
            const blankExists = options.includes('(blank)');
            if (blankExists) {
                options = options.filter(item => item !== '(blank)');
            }
            // Sort options and append '(blank)' at the end if it was originally there
            options.sort();
            if (blankExists) {
                options.push('(blank)');
            }
            return options;
        };
    
        const newFilterOptions = {
            radius_size: generateOptions(products.map(product => product.radius_size?.trim() === '' || product.radius_size == null ? '(blank)' : product.radius_size)),
            material_type: generateOptions(products.map(product => product.material_type?.trim() === '' || product.radius_size == null ? '(blank)' : product.material_type)),
            color: generateOptions(products.map(product => product.color?.trim() === '' || product.radius_size == null ? '(blank)' : product.color)),
            type: generateOptions(products.map(product => product.type?.trim() === '' || product.radius_size == null ? '(blank)' : product.type)),
        };
    
        setFilterOptions(newFilterOptions);
    }, [products]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase());
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

    const matchesFilter = (product) => {
        const normalizedFilter = filter?.toLowerCase() ?? '';
        return (
            product.part_number?.toLowerCase().includes(normalizedFilter) ||
            product.supplier_part_number?.toLowerCase().includes(normalizedFilter) || // Include supplier part number in the filter check
            product.description?.toLowerCase().includes(normalizedFilter)
        ) && Object.keys(activeFilters).every(key => {
            // Convert both to string if numeric values are involved
            const productValue = typeof product[key] === 'number' ? product[key].toString() : product[key] ?? ''; // Ensure non-null string
            return activeFilters[key].length === 0 || activeFilters[key].includes(productValue);
        });
    };
    

    const sortProducts = (a, b) => {
        if (sortColumn === null) return 0;
    
        // Special handling for "status"
        if (sortColumn === 'status') {
            const statusA = a.quantity_in_stock > 0 ? 1 : 0; // 1 for In Stock, 0 for Out of Stock
            const statusB = b.quantity_in_stock > 0 ? 1 : 0;
    
            // Ascending: Show "Out of Stock" before "In Stock"
            // Descending: Show "In Stock" before "Out of Stock"
            return sortDirection === 'ascending' ? statusA - statusB : statusB - statusA;
        }
    
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];
        
        // Handle numeric sorting
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortDirection === 'ascending' ? valueA - valueB : valueB - valueA;
        }
        
        // Handle string sorting
        valueA = valueA ? valueA.toString().toLowerCase() : '';
        valueB = valueB ? valueB.toString().toLowerCase() : '';
        if (valueA < valueB) return sortDirection === 'ascending' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'ascending' ? 1 : -1;
        
        return 0;
    };    

    const sortedProducts = [...products].filter(product => matchesFilter(product, filter)).sort(sortProducts);

    const renderProductRows = sortedProducts
    .filter(product => matchesFilter(product, filter))
    .map((product, index) => (
        <React.Fragment key={index}>
            <tr onClick={() => toggleProductExpansion(index)}>
                <td>{product.part_number}</td>
                <td>{product.material_type && product.color ? `${product.material_type} / ${product.color}` : product.material_type ? product.material_type : product.color ? product.color : ''}</td>
                <td>{product.radius_size && product.description ? `${product.radius_size}" ${product.description}` : product.description}</td>
                <td>
                    <div className="quantity-edit-container">
                        {product.quantity_in_stock}
                        <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row expansion
                            openEditQuantityModal(product);
                        }}
                        className="edit-quantity-btn"
                        >
                        Edit Quantity
                        </button>
                    </div>
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
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                <p><strong>Part Number:</strong> {product.part_number}</p>
                                <p><strong>Supplier Part Number:</strong> {product.supplier_part_number}</p> {/* Added Supplier Part Number */}
                                <p><strong>Radius Size:</strong> {product.radius_size}"</p> {/* Adjusted for clarity */}
                                <p><strong>Material/Color:</strong> {
                                    product.material_type && product.color 
                                    ? `${product.material_type} / ${product.color}` 
                                    : product.material_type ? product.material_type 
                                    : product.color ? product.color : 'N/A' // Improved handling of missing values
                                }</p>
                                <p><strong>Description:</strong> {product.description}</p>
                                <p><strong>Product Type:</strong> {product.type}</p>
                                <p><strong>Quantity of Item:</strong> {product.quantity_of_item} {product.unit}</p> {/* Simplified display */}
                                <p><strong>Base Price:</strong> {product.price}</p>
                                <p><strong>Mark Up Price:</strong> {product.mark_up_price}</p>
                            </div>
                            <div className="product-action-buttons">
                                <button 
                                    className="product-action-button edit-button" 
                                    onClick={() => openEditProductModal(product)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="product-action-button delete-button" 
                                    onClick={() => confirmDeleteProduct(product.part_number)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    ));

    const handleCheckboxChange = (category, option) => {
        setActiveFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(option) ?
                prev[category].filter(item => item !== option) :
                [...prev[category], option],
        }));
    };

    // Function to render checkboxes for a given category
    const renderCategoryCheckboxes = (category) => {
        return (
            <div className="filter-category">
                <h3>{category.replace(/_/g, ' ').toUpperCase()}</h3>
                {filterOptions[category].map(option => (
                    <label key={option} className="category-checkbox">
                        <input
                            type="checkbox"
                            checked={activeFilters[category].includes(option)}
                            onChange={() => handleCheckboxChange(category, option)}
                        />
                        {category === 'radius_size' && option !== '(blank)' ? `${option}"` : option}
                    </label>
                ))}
            </div>
        );
    };


    const handleSort = (columnName) => {
        if (sortColumn === columnName) {
            setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
        } else {
            setSortColumn(columnName);
            setSortDirection('ascending');
        }
    };
    

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

    const confirmDeleteProduct = (partNumber) => {
        setDeletePartNumber(partNumber);
        setShowDeleteModal(true);
    };

    const performDeleteProduct = async (partNumber) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${partNumber}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete the product');
            }
    
            toast.success('Product deleted successfully.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            await fetchProductsWithInventory(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error deleting product.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    // Example function to open the edit modal and set the state with the product's current information
    const openEditProductModal = (product) => {
        setEditProductItem({
            originalPartNumber: product.part_number, // Retain the original part number for identification
            partNumber: product.part_number,
            supplierPartNumber: product.supplier_part_number || '', // Include supplier part number
            radiusSize: product.radius_size || '', // Fallback to empty string if undefined
            materialType: product.material_type || '',
            color: product.color || '',
            description: product.description || '',
            type: product.type || '',
            quantityOfItem: product.quantity_of_item ? product.quantity_of_item.toString() : '', // Convert to string for form input
            unit: product.unit || '',
            price: product.price ? product.price.toString() : '', // Convert to string for form input
            markUpPrice: product.mark_up_price ? product.mark_up_price.toString() : '', // Convert to string for form input
        });
        setShowEditProductModal(true); // Display the modal for editing product details
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
    
        const {
            originalPartNumber,
            partNumber,
            supplierPartNumber, // Include supplierPartNumber in the destructuring
            radiusSize,
            materialType,
            color,
            description,
            type,
            quantityOfItem,
            unit,
            price,
            markUpPrice
        } = editProductItem;
    
        // Prepare the data object for updating, including all relevant product details
        const updateData = {
            originalPartNumber,
            partNumber, // If the part number is editable, otherwise omit this line
            supplierPartNumber, // Added to update data
            radiusSize,
            materialType,
            color,
            description,
            type,
            quantityOfItem: parseInt(quantityOfItem, 10), // Convert quantity to integer
            unit,
            price: parseFloat(price), // Ensure price is a float
            markUpPrice: parseFloat(markUpPrice), // Ensure markUpPrice is a float
        };

        try {
            const response = await fetch(`${API_BASE_URL}/products/${originalPartNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update the product');
            }
    
            const result = await response.json();
            console.log('Product updated successfully', result);
            toast.success('Product updated successfully.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setShowEditProductModal(false); // Close the edit modal
            await fetchProductsWithInventory(); // Refresh the products list to show the updated data
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Error updating product.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
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
                                <th>
                                    <button onClick={() => handleSort('part_number')} className="sortable-header">
                                        Part Number {sortColumn === 'part_number' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('material_type')} className="sortable-header">
                                        Material/Color {sortColumn === 'material_type' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('description')} className="sortable-header">
                                        Description {sortColumn === 'description' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('quantity_in_stock')} className="sortable-header">
                                        Quantity In Stock {sortColumn === 'quantity_in_stock' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('status')} className="sortable-header">
                                        Status {sortColumn === 'status' ? (sortDirection === 'ascending' ? '↑' : '↓') : ''}
                                    </button>
                                </th>
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
                        placeholder="Search for products..."
                        onChange={handleFilterChange}
                    />
                    {Object.keys(filterOptions).map(category => renderCategoryCheckboxes(category))}
                </div>
                {showModal && (
                    <AddProduct
                        fetchProductsWithInventory={fetchProductsWithInventory}
                        setShowModal={setShowModal}
                    />
                )}
                {showEditQuantityModal && (
                    <div className="modal-backdrop" onClick={() => setShowEditQuantityModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Edit Quantity</h2>
                                <button onClick={() => setShowEditQuantityModal(false)} className="modal-close-button">X</button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdateQuantity}>
                                    <input
                                        type="number"
                                        className="edit-quantity-modal-input"
                                        value={editItem.quantityInStock}
                                        onChange={(e) => setEditItem({ ...editItem, quantityInStock: parseInt(e.target.value, 10) })}
                                    />
                                    <div className="modal-actions">
                                        <button type="submit" className="edit-quantity-modal-update-btn">Update</button>
                                        <button type="button" onClick={() => setShowEditQuantityModal(false)} className="edit-quantity-modal-cancel-btn">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {showDeleteModal && (
                    <div className="modal-backdrop">
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Confirm Deletion</h2>
                                <button onClick={() => setShowDeleteModal(false)} className="modal-close-button">X</button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete the product with part number: {deletePartNumber}?
                            </div>
                            <div className="modal-actions">
                                <button onClick={() => {
                                    performDeleteProduct(deletePartNumber);
                                    setShowDeleteModal(false);
                                }} className="delete-confirm">Delete</button>
                                <button onClick={() => setShowDeleteModal(false)} className="delete-cancel">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                {showEditProductModal && (
                    <div className="modal-backdrop" onClick={() => setShowEditProductModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Edit Product</h2>
                                <button onClick={() => setShowEditProductModal(false)} className="modal-close-button">X</button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdateProduct}>
                                    <input
                                        type="text"
                                        placeholder="Part Number"
                                        value={editProductItem.partNumber}
                                        onChange={e => setEditProductItem({ ...editProductItem, partNumber: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Supplier Part Number"
                                        value={editProductItem.supplierPartNumber}
                                        onChange={e => setEditProductItem({ ...editProductItem, supplierPartNumber: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Radius Size"
                                        value={editProductItem.radiusSize}
                                        onChange={e => setEditProductItem({ ...editProductItem, radiusSize: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Material Type"
                                        value={editProductItem.materialType}
                                        onChange={e => setEditProductItem({ ...editProductItem, materialType: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Color"
                                        value={editProductItem.color}
                                        onChange={e => setEditProductItem({ ...editProductItem, color: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={editProductItem.description}
                                        onChange={e => setEditProductItem({ ...editProductItem, description: e.target.value })}
                                    ></textarea>
                                    {/* <DropdownWithInput
                                        options={typeOptions}
                                        value={editProductItem.type}
                                        onChange={(newType) => setEditProductItem({ ...editProductItem, type: newType })}
                                        onNewOption={(newType) => setTypeOptions([...typeOptions, newType])} // Handling new types similarly
                                    /> */}
                                    <input
                                        type="number"
                                        placeholder="Quantity of Item"
                                        value={editProductItem.quantityOfItem}
                                        onChange={e => setEditProductItem({ ...editProductItem, quantityOfItem: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Unit"
                                        value={editProductItem.unit}
                                        onChange={e => setEditProductItem({ ...editProductItem, unit: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Price"
                                        value={editProductItem.price}
                                        onChange={e => setEditProductItem({ ...editProductItem, price: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Mark Up Price"
                                        value={editProductItem.markUpPrice}
                                        onChange={e => setEditProductItem({ ...editProductItem, markUpPrice: e.target.value })}
                                    />
                                    <div className="modal-actions">
                                        <button type="submit">Save Changes</button>
                                        <button type="button" onClick={() => setShowEditProductModal(false)}>Cancel</button>
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

export default Inventory;