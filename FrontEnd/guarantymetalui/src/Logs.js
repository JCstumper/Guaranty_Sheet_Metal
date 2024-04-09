import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './App'; 
import { toast } from 'react-toastify';
import { FaFilter } from 'react-icons/fa';
import Topbar from './components/topbar';
import './Logs.css'; 
import './components/AddProduct.css'


const Logs = ({ setAuth }) => {
    const [logs, setLogs] = useState([]);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [userFilter, setUserFilter] = useState('');
    const [actionTypeFilter, setActionTypeFilter] = useState('');
    const { API_BASE_URL, userRoles } = useContext(AppContext);

    const openFilterModal = () => setIsFilterModalVisible(true);
    const closeFilterModal = () => setIsFilterModalVisible(false);

    
    const userHasAccess = () => {
        // Ensure userRoles is always treated as an array
        const roles = userRoles || [];
        return roles.includes('admin');
    };

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
                setLogs(jsonData.logs.rows);
            } else {
                console.error('Data fetched is not an array:', jsonData);
                setLogs([]);
                toast.error('Failed to fetch logs.');
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error('Error fetching logs.');
        }
    };

    useEffect(() => {
        if (userHasAccess()) {
        fetchLogs(); // Fetch logs when the component mounts
        }
    }, []);

    const applyFilters = () => {
        const filteredLogs = logs.filter((log) => {
            const matchesUser = userFilter ? log.user_id.includes(userFilter) : true;
            const matchesActionType = actionTypeFilter ? log.action_type === actionTypeFilter : true;
            return matchesUser && matchesActionType;
        });
        
        setLogs(filteredLogs);
        closeFilterModal();
    };

    const resetFilters = () => {
        setUserFilter('');
        setActionTypeFilter('');
        fetchLogs(); // Refetch all logs
        closeFilterModal();
    };

    return userHasAccess() ? (
        <div className="logs-main">
            <Topbar setAuth={setAuth} />
            <div className="logs-table">
                <div className="table-header">
                    <span>Inventory Logs</span>
                    <button className="filter-button" onClick={openFilterModal}><FaFilter /></button>
                </div>
                <div className="table-content">
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
                                <td>{log.action_type}</td>
                                <td>{log.user_id}</td>
                                <td>{log.log_type}</td>
                                <td>
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
                                    })()}
                                </td>
                                <td>{new Date(log.action_timestamp).toLocaleString()}</td>
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
    ): (
        <div> You do not have access to view this page. </div>);
};

export default Logs;
