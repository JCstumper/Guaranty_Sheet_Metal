import React, { useState, useEffect } from 'react';
import './components/AddProduct.css';

const AddPartModal = ({ isOpen, onClose, onAddPart, API_BASE_URL, selectedJobId, partActionType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allParts, setAllParts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const fetchParts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/products/with-inventory`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token
                }
            });

            if (response.ok) {
                const result = await response.json();
                setAllParts(result.products); 
                setSearchResults(result.products); 
            } else {
                throw new Error('Failed to fetch parts with inventory');
            }
        } catch (error) {
            console.error('Error fetching parts with inventory:', error);
            setError('Failed to fetch parts with inventory');
        }
    };

    useEffect(() => {
        fetchParts();
    }, []);

    useEffect(() => {
        const filteredResults = allParts.filter(part =>
            part.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
    }, [searchTerm, allParts]);

    const handleAdd = async (part) => {
        const requestBody = partActionType === 'necessary'
            ? { job_id: selectedJobId, part_number: part.part_number, quantity_required: 1 }
            : { job_id: selectedJobId, part_number: part.part_number, quantity_used: 1 };

        const token = localStorage.getItem('token');
        const endpoint = partActionType === 'necessary'
            ? `${API_BASE_URL}/jobs/necessary-parts`
            : `${API_BASE_URL}/jobs/used-parts`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': token
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const addedPart = await response.json();
                onAddPart(addedPart);
                onClose();
            } else {
                throw new Error(`Failed to add ${partActionType} part`);
            }
        } catch (error) {
            console.error(`Error adding ${partActionType} part:`, error);
            setError(`Failed to add the ${partActionType} part`);
        }
    };

    return (
        isOpen && (
            <div className="modal-backdrop">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Add Part</h2>
                        <button onClick={onClose} className="modal-close-button">X</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for parts"
                                className="form-control"
                            />
                        </div>
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
                                        <td><button onClick={() => handleAdd(part)} className="btn-primary">Add</button></td>
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
