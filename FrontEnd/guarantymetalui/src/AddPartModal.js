import React, { useState, useEffect } from 'react';

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args); // Removed the use of 'this' as it's unnecessary in this context
        }, delay);
    };
};

const AddPartModal = ({ isOpen, onClose, onAddPart, API_BASE_URL,selectedJobId,partActionType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = debounce(async () => {
        setError('');
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/products/search?term=${encodeURIComponent(searchTerm.trim())}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data); // Assuming the API directly returns the array of parts
            } else {
                console.error('Failed to fetch parts');
                setError('Failed to fetch parts');
            }
        } catch (error) {
            console.error('Error fetching parts:', error);
            setError('Error fetching parts');
        }
    }, 500);

    useEffect(() => {
        handleSearch();
    }, [searchTerm]); // This effect will call handleSearch which is debounced

    const handleAdd = async (part) => {
        // Define requestBody based on partActionType
        const requestBody = partActionType === 'necessary'
            ? { job_id: selectedJobId, part_number: part.part_number, quantity_required: 1 }
            : { job_id: selectedJobId, part_number: part.part_number, quantity_used: 1 };
    
        try {
            // Determine the appropriate endpoint based on partActionType
            const endpoint = partActionType === 'necessary'
                ? `${API_BASE_URL}/jobs/necessary-parts`
                : `${API_BASE_URL}/jobs/used-parts`;
    
            // Make the API request to add the part
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
    
            if (response.ok) {
                const addedPart = await response.json();
                // Invoke the callback function to update the state in the parent component
                onAddPart(addedPart);
                onClose(); // Close the modal after successful operation
            } else {
                // Handle errors such as failure to add the part
                throw new Error(`Failed to add ${partActionType} part`);
            }
        } catch (error) {
            // Log and display errors related to the add operation
            console.error(`Error adding ${partActionType} part:`, error);
            setError(`Failed to add the ${partActionType} part`);
        }
    };
    

    return (
        isOpen && (
            <div className="addPartModal">
                <div className="addPartModal-content">
                    <div className="addPartModal-header">
                        <h2>Add Part</h2>
                        <button onClick={onClose} className="addPartModal-close">X</button>
                    </div>
                    <div className="addPartModal-body">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for parts"
                        />
                        {error && <div className="error-message">{error}</div>}
                        <table>
                            <thead>
                                <tr>
                                    <th>Part Number</th>
                                    <th>Radius Size</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map(part => (
                                    <tr key={part.part_number}>
                                        <td>{part.part_number}</td>
                                        <td>{part.radius_size}</td>
                                        <td>{part.description}</td>
                                        <td><button onClick={() => handleAdd(part)}>Add</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    );
};

export default AddPartModal;



