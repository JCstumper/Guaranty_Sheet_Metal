import React, { useState, useEffect } from 'react';
import "./ManageUsers.css";
import  ConfirmUsers from "./ConfirmUsers";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";



const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

const ManageUsersModal = ({ isOpen, onSave, onClose }) => {
    const [users, setUsers] = useState([]);
    const [tempUsers, setTempUsers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirmUsers, setShowConfirmUsers] = useState(false);
    const [currentUserToDelete, setCurrentUserToDelete] = useState(null);

    const currentUserId = jwtDecode(localStorage.token).user;

    useEffect(() => {
        if (isOpen) {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/users`, {
                    method: 'GET',
                    headers: { token: localStorage.token }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
                setTempUsers(data.reduce((acc, user) => {
                    acc[user.user_id] = { ...user };
                    return acc;
            }, {}));
            } catch (e) {
                console.error('Fetching users failed:', e);
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
        }
    }, [isOpen]);

    const handleRemoveUser = async (userId) => {
            setShowConfirmUsers(true);
            setCurrentUserToDelete(userId);
        };

    const confirmDelete = async () => {
        if (!currentUserToDelete) return;
    
        
        const adminCount = users.filter(user => user.role_name === 'admin').length;
        const userIsAdmin = users.find(user => user.user_id === currentUserToDelete).role_name === 'admin';
    
        if (userIsAdmin && adminCount <= 1) {
            toast.error('Cannot delete the last admin.');
            setShowConfirmUsers(false);
            return;
        }
    
        try {
            const response = await fetch(`${API_BASE_URL}/users/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.token
                },
                body: JSON.stringify({ user_id: currentUserToDelete })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            
            setUsers(prevUsers => prevUsers.filter(user => user.user_id !== currentUserToDelete));
            setTempUsers(prevTempUsers => {
                const updatedTempUsers = { ...prevTempUsers };
                delete updatedTempUsers[currentUserToDelete];
                return updatedTempUsers;
            });
    
            setShowConfirmUsers(false);
            setCurrentUserToDelete(null);
            toast.success('User successfully removed');  
        } catch (e) {
            console.error('Failed to remove user:', e);
            setError('Failed to remove user');
            toast.error(`Error: ${e.message}`);  
        }
    };
    

    const handleChangeRole = (userId, newRole) => {
        setTempUsers(prev => ({
        ...prev,
        [userId]: { ...prev[userId], role_name: newRole }
        }));
    };

    const saveChanges = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const currentUserId = jwtDecode(localStorage.token).user;
            const originalAdmins = users.filter(user => user.role_name === 'admin');
    
            // Filter updates where role actually changes
            const validUpdates = Object.values(tempUsers).filter(tempUser => {
                const currentUser = users.find(user => user.user_id === tempUser.user_id);
                return currentUser && currentUser.role_name !== tempUser.role_name;
            });
    
            // Calculate potential number of admins after changes
            let potentialAdminCount = originalAdmins.length;
            validUpdates.forEach(update => {
                const currentUser = users.find(user => user.user_id === update.user_id);
                if (currentUser.role_name === 'admin' && update.role_name !== 'admin') {
                    potentialAdminCount -= 1; // Admin being demoted
                } else if (currentUser.role_name !== 'admin' && update.role_name === 'admin') {
                    potentialAdminCount += 1; // Non-admin being promoted
                }
            });
    
            // Check for zero admin condition
            if (potentialAdminCount <= 0) {
                toast.error('At least one admin must remain.');
                return;
            }
    
            // Send updates to the server
            const updatePromises = validUpdates.map(user => (
                fetch(`${API_BASE_URL}/users/updateRole`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.token
                    },
                    body: JSON.stringify({ user_id: user.user_id, role: tempUsers[user.user_id].role_name })
                }).then(async response => {
                    const data = await response.json();
                    
                    if (data.token && user.user_id === currentUserId) {
                        localStorage.removeItem("token");
                        localStorage.setItem("token", data.token);
                    }
                    return {
                        success: response.ok,
                        user_id: user.user_id,
                        role: tempUsers[user.user_id].role_name,
                        message: data.message || ''
                    };
                })
            ));
    
            const results = await Promise.all(updatePromises);
            const failedUpdates = results.filter(result => !result.success);
            if (failedUpdates.length > 0) {
                setError('Some updates failed to save');
                toast.error('Some updates failed: ' + failedUpdates.map(f => f.message).join(', '));
                throw new Error('Some updates failed');
            }
    
            // Update local state to reflect changes
            setUsers(prevUsers => prevUsers.map(user => {
                const updatedUser = results.find(res => res.user_id === user.user_id);
                return updatedUser ? { ...user, role_name: updatedUser.role } : user;
            }));

            const currentUserUpdate = results.find(result => result.user_id === currentUserId);
            if (currentUserUpdate && currentUserUpdate.role === 'employee') {
                window.location.reload();  // Force a page reload to apply new user permissions
            }
    
            toast.success('Changes saved successfully');
            onClose();
        } catch (e) {
            console.error('Failed to save changes:', e);
            setError('Failed to save changes');
            toast.error(`Failed to save changes: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    if (!isOpen) return null;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="manage-users-overlay">
            <div className="manage-users-container">
                <h2>Manage Users</h2>
                {Object.values(tempUsers).map((user, index) => (
                    <div key={`${user.user_id}-${index}`} className="user-item">
                        <span>{user.username}</span>
                        <select
                            value={user.role_name}
                            onChange={(e) => handleChangeRole(user.user_id, e.target.value)}
                        >
                            <option value="admin">admin</option>
                            <option value="employee">employee</option>
                        </select>
                        <button
                            onClick={() => handleRemoveUser(user.user_id)}
                            disabled={user.user_id === currentUserId}
                            style={{
                                opacity: user.user_id === currentUserId ? 0.5 : 1,
                                cursor: user.user_id === currentUserId ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Remove
                        </button>
                        <ConfirmUsers
                            isOpen={showConfirmUsers}
                            onClose={() => setShowConfirmUsers(false)}
                            onConfirm={confirmDelete}
                        >
                            Are you sure you want to delete this user?
                        </ConfirmUsers>
                    </div>   
                ))}
                <div className='modal-actions'>
                    <button type="submit" onClick={saveChanges} className="btn-primary">Save Changes</button>
                    <button onClick={onClose} className="btn-secondary">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ManageUsersModal;
