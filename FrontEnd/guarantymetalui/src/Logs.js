import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './App'; // Adjust the import path as necessary
import { toast } from 'react-toastify';
import { FaFilter } from 'react-icons/fa';
import Topbar from './components/topbar';
import './Logs.css'; // Adjust the path as necessary
import './components/AddProduct.css'

const Logs = ({ setAuth }) => {
    const [originalLogs, setOriginalLogs] = useState([]); // Store the original dataset
    const [logs, setLogs] = useState([]);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [userFilter, setUserFilter] = useState('');
    const [actionTypeFilter, setActionTypeFilter] = useState('');
    const { API_BASE_URL } = useContext(AppContext);

    const openFilterModal = () => setIsFilterModalVisible(true);
    const closeFilterModal = () => setIsFilterModalVisible(false);

    // Function to fetch inventory logs
    const fetchLogs = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/logs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            });
            const jsonData = await response.json();
    
            if (jsonData.logs && Array.isArray(jsonData.logs.rows)) {
                const sortedLogs = jsonData.logs.rows.sort((a, b) => 
                    new Date(b.action_timestamp) - new Date(a.action_timestamp)
                );
                setOriginalLogs(sortedLogs); // Set original logs with sorted data
                setLogs(sortedLogs); // Set logs for display
            } else {
                console.error('Data fetched is not an array:', jsonData);
                setOriginalLogs([]); // Reset original logs
                setLogs([]);
                toast.error('Failed to fetch logs.');
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error('Error fetching logs.');
        }
    };

    useEffect(() => {
        fetchLogs(); // Fetch logs when the component mounts
    }, []);

    const applyFilters = () => {
        const filteredLogs = originalLogs.filter((log) => {
            const matchesUser = userFilter ? log.user_id.includes(userFilter) : true;
            const matchesActionType = actionTypeFilter ? log.action_type.toLowerCase().includes(actionTypeFilter.toLowerCase()) : true;
            return matchesUser && matchesActionType;
        });
        
        setLogs(filteredLogs);
        closeFilterModal();
    };

    const resetFilters = () => {
        setUserFilter('');
        setActionTypeFilter('');
        setLogs(originalLogs); // Reset to original logs
        closeFilterModal();
    };

    return (
        <div className="logs-main">
            <Topbar setAuth={setAuth} />
            <div className="logs-table">
                <div className="table-header">
                    <span className="table-title"><strong>INVENTORY LOGS</strong></span>
                    <button className="filter-button" onClick={openFilterModal}><FaFilter /></button>
                </div>
                <div className="table-content-logs">
                    <table>
                        <thead>
                            <tr>
                                <th>Action Type</th>
                                <th>Username</th>
                                <th>Log Type</th>
                                <th>Change Details</th>
                                <th>Action Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={index}>
                                <td><strong>{log.action_type}</strong></td>
                                <td><strong>{log.user_id}</strong></td>
                                <td><strong>{log.log_type}</strong></td>
                                <td><strong>
                                    {(() => {
                                    // Parse the details JSON string
                                    const details = JSON.parse(log.change_details);
                                    // Build a formatted string to display
                                    let formattedDetails = `${details.message}\n`;
                                    if (details.details) {
                                        for (const [key, value] of Object.entries(details.details)) {
                                        formattedDetails += `${key}: ${value} `;
                                        }
                                    }
                                    return (
                                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                        {formattedDetails}
                                        </pre>
                                    );
                                    })()}</strong>
                                </td>
                                <td><strong>{new Date(log.action_timestamp).toLocaleString()}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isFilterModalVisible && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Filter Logs</h2>
                            <button onClick={closeFilterModal} className="modal-close-button">×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="userFilter">User:</label>
                                <input
                                    type="text"
                                    id="userFilter"
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="actionFilter">Action Type:</label>
                                <select
                                    id="actionFilter"
                                    value={actionTypeFilter}
                                    onChange={(e) => setActionTypeFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="add">Add</option>
                                    <option value="delete">Delete</option>
                                    <option value="update">Update</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button onClick={applyFilters} className="btn-primary">Apply Filters</button>
                            <button onClick={resetFilters} className="btn-secondary">Reset Filters</button>
                            <button onClick={closeFilterModal} className="btn-secondary">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logs;
