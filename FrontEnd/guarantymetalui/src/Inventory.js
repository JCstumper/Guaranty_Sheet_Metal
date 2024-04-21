import React, { useState, useEffect, useContext } from 'react';
import './Inventory.css';
import Topbar from './components/topbar';
import AddProduct from './components/AddProduct';
import EditQuantity from './components/EditQuantity';
import DeleteProductModal from './components/DeleteProductModal';
import EditProductModal from './components/EditProductModal';
import { toast } from 'react-toastify';
import { AppContext } from './App';

const Inventory = ({ setAuth }) => {
    const [products, setProducts] = useState([]);
    const [expandedRowIndex, setExpandedRowIndex] = useState(null);
    const [filter, setFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditQuantityModal, setShowEditQuantityModal] = useState(false);
    const [editItem, setEditItem] = useState({ partNumber: '', quantityInStock: 0 });
    const [sortColumn, setSortColumn] = useState(null); 
    const [sortDirection, setSortDirection] = useState('ascending'); 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePartNumber, setDeletePartNumber] = useState(null);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [editProductItem, setEditProductItem] = useState(null);
    const {API_BASE_URL} = useContext(AppContext);

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
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${API_BASE_URL}/products/with-inventory`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token, 
                },
            });
            const jsonData = await response.json();
            
            if (Array.isArray(jsonData.products)) {
                
                const sortedProducts = jsonData.products.sort((a, b) => {
                    return b.quantity_in_stock - a.quantity_in_stock;
                });
                setProducts(sortedProducts);
            } else {
                console.error('Unexpected response format:', jsonData);
                setProducts([]);
            }
            
        } catch (error) {
            console.error('Error fetching products with inventory:', error);
            setProducts([]);
        }
    };

    useEffect(() => {
        
        fetchProductsWithInventory();
    }, []);

    useEffect(() => {
        
        const generateOptions = (items) => {
            let options = [...new Set(items.map(item => item ?? '(blank)').filter((item, index, array) => array.indexOf(item) === index))];
            
            const blankExists = options.includes('(blank)');
            if (blankExists) {
                options = options.filter(item => item !== '(blank)');
            }
            
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

    
    const toggleProductExpansion = (index) => {
        if (expandedRowIndex === index) {
            setExpandedRowIndex(null);
        } else {
            setExpandedRowIndex(index);
        }
    };

    const matchesFilter = (product) => {
        const normalizedFilter = filter?.toLowerCase() ?? '';
        return (
            product.part_number?.toLowerCase().includes(normalizedFilter) ||
            product.supplier_part_number?.toLowerCase().includes(normalizedFilter) || 
            product.description?.toLowerCase().includes(normalizedFilter)
        ) && Object.keys(activeFilters).every(key => {
            const productValue = typeof product[key] === 'number' ? product[key].toString() : product[key] ?? ''; 
            return activeFilters[key].length === 0 || activeFilters[key].includes(productValue);
        });
    };
    

    const sortProducts = (a, b) => {
        if (sortColumn === null) return 0;

        if (sortColumn === 'status') {
            const statusA = a.quantity_in_stock > 0 ? 1 : 0; 
            const statusB = b.quantity_in_stock > 0 ? 1 : 0;

            return sortDirection === 'ascending' ? statusA - statusB : statusB - statusA;
        }

        let valueA = a[sortColumn];
        let valueB = b[sortColumn];

        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortDirection === 'ascending' ? valueA - valueB : valueB - valueA;
        }

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
                <td><strong>{product.part_number}</strong></td>
                <td><strong>{product.material_type && product.color ? `${product.material_type} / ${product.color}` : product.material_type ? product.material_type : product.color ? product.color : ''}</strong></td>
                <td><strong>{product.radius_size && product.description ? `${product.radius_size}" ${product.description}` : product.description}</strong></td>
                <td><strong>{product.quantity_in_stock}</strong></td>
                <td>
                    <div className={`status-box ${product.quantity_in_stock > 0 ? 'inv-in-stock' : 'inv-out-of-stock'}`}>
                        <strong>{product.quantity_in_stock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                    </div>
                </td>
            </tr>
            {expandedRowIndex === index && (
                <tr className={`product-details ${expandedRowIndex === index ? 'expanded' : ''}`}>
                    <td colSpan="5">
                        <div className="product-details-content">
                            <div className="product-details-grid">
                                <div className="product-details-block">
                                    <p><strong>Part Number:</strong> {product.part_number}</p>
                                    <p><strong>Supplier Part Number:</strong> {product.supplier_part_number}</p>
                                    <p><strong>Description:</strong> {product.description}</p>
                                    <p><strong>Material:</strong> {product.material_type || 'N/A'}</p>
                                    <p><strong>Color:</strong> {product.color || 'N/A'}</p>
                                </div>
                                <div className="product-details-block">
                                    <p><strong>Radius Size:</strong> {product.radius_size}"</p>
                                    <p><strong>Product Type:</strong> {product.type}</p>
                                    <p><strong>Quantity of Item:</strong> {product.quantity_of_item} {product.unit}</p>
                                    <p><strong>Base Price:</strong> {product.price}</p>
                                    <p><strong>Mark Up Price:</strong> {product.mark_up_price}</p>
                                </div>
                            </div>
                            <div className="product-action-buttons">
                                <button className="product-action-button edit-button" onClick={() => openEditProductModal(product)}>Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); openEditQuantityModal(product); }} className="product-action-button edit-button">Edit Quantity</button>
                                <button className="product-action-button delete-button" onClick={() => confirmDeleteProduct(product.part_number)}>Delete</button>
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
                        <strong>{category === 'radius_size' && option !== '(blank)' ? `${option}"` : option}</strong>
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
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/inventory/${editItem.partNumber}/quantity`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    'token': token,
                },
                body: JSON.stringify({ quantity_in_stock: editItem.quantityInStock })
            });
            if (response.ok) {
                toast.success('Quantity updated successfully!');
                setShowEditQuantityModal(false); 
                fetchProductsWithInventory(); 
            } else {
                toast.error('Failed to update quantity. Please try again.');
                console.error("Failed to update item.");
            }
        } catch (error) {
            toast.error('An error occurred while updating the quantity.');
            console.error("Error updating item:", error);
        }
    };

    const confirmDeleteProduct = (partNumber) => {
        setDeletePartNumber(partNumber);
        setShowDeleteModal(true);
    };

    
    const openEditProductModal = (product) => {
        setEditProductItem({
            originalPartNumber: product.part_number, 
            partNumber: product.part_number,
            supplierPartNumber: product.supplier_part_number || '', 
            radiusSize: product.radius_size || '', 
            materialType: product.material_type || '',
            color: product.color || '',
            description: product.description || '',
            type: product.type || '',
            quantityOfItem: product.quantity_of_item ? product.quantity_of_item.toString() : '', 
            unit: product.unit || '',
            price: product.price ? product.price.toString() : '', 
            markUpPrice: product.mark_up_price ? product.mark_up_price.toString() : '', 
        });
        setShowEditProductModal(true); 
    };
    
    return (
        <div className="inventory">
            <Topbar setAuth={setAuth} />
            <div className="inventory-main">
                <div className="product-table">
                    <div className="table-header">
                        <span className="table-title"><strong>INVENTORY</strong></span>
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
                    <EditQuantity
                        showModal={showEditQuantityModal}
                        setShowModal={setShowEditQuantityModal}
                        editItem={editItem}
                        setEditItem={setEditItem}
                        handleUpdateQuantity={handleUpdateQuantity}
                    />
                )}
                {showDeleteModal && (
                    <DeleteProductModal
                        showModal={showDeleteModal}
                        setShowModal={setShowDeleteModal}
                        deletePartNumber={deletePartNumber}
                        fetchProductsWithInventory={fetchProductsWithInventory}
                        API_BASE_URL={API_BASE_URL}
                    />
                )}
                {showEditProductModal && (
                    <EditProductModal
                        showModal={showEditProductModal}
                        setShowModal={setShowEditProductModal}
                        editProductItem={editProductItem}
                        setEditProductItem={setEditProductItem}
                        fetchProductsWithInventory={fetchProductsWithInventory}
                        API_BASE_URL={API_BASE_URL}
                    />
                )}
            </div>
        </div>
    );
};

export default Inventory;