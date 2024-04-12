import React, { useState, useEffect } from 'react';
import "./ManageUsers.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

const ManageUsersModal = ({ isOpen, onSave, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {token: localStorage.token}
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUsers(data);
        } catch (e) {
          console.error('Fetching users failed:', e);
          setError('Failed to load users');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]); // This effect runs when the modal opens

  if (!isOpen) return null;

  const handleRemoveUser = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/remove`, {
            method: 'POST',
            headers: {token: localStorage.token},
            body: JSON.stringify({ user_id: id })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // On successful removal, update state
        setUsers(prevUsers => prevUsers.filter(user => user.user_id !== id));
    } catch (e) {
        console.error('Failed to remove user:', e);
        setError('Failed to remove user');
    }
};


  const handleChangeRole = async (id, newRole) => {
    // Call API to update the user role in the backend database
    try {
        const response = await fetch(`${API_BASE_URL}/users/updateRole`, {
            method: 'POST',
            headers: {token: localStorage.token},
            body: JSON.stringify({ user_id: id, new_role: newRole })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // On successful update, update state
        setUsers(prevUsers => prevUsers.map(user =>
            user.user_id === id ? { ...user, role_name: newRole } : user
        ));
    } catch (e) {
        console.error('Failed to update role:', e);
        setError('Failed to update user role');
    }
};


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="manage-users-overlay">
      <div className="manage-users-container">
        <h2>Manage Users</h2>
        {users.map((user, index) => (
        <div key={`${user.user_id}-${index}`} className="user-item">
            <span>{user.username}</span>
            <select
            value={user.role_name}
            onChange={(e) => handleChangeRole(user.user_id, e.target.value)}
            >
            <option value="admin">admin</option>
            <option value="employee">employee</option>
            </select>
            <button onClick={() => handleRemoveUser(user.user_id)}>Remove</button>
        </div>
        ))}
        <button type="submit" className="save-changes-button">Save Changes</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ManageUsersModal;
