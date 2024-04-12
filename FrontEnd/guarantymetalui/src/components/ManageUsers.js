import React, { useState, useEffect } from 'react';
import "./ManageUsers.css";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

const ManageUsersModal = ({ isOpen, onSave, onClose }) => {
  const [users, setUsers] = useState([]);
  const [tempUsers, setTempUsers] = useState({});
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
      // Update roles on the backend
      await Promise.all(Object.values(tempUsers).filter(user => {
        const originalUser = users.find(u => u.user_id === user.user_id);
        return originalUser.role_name !== user.role_name;
      }).map(user => {
        return fetch(`${API_BASE_URL}/users/updateRole`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.token
          },
          body: JSON.stringify({ user_id: user.user_id, role: user.role_name })
        });
      }));
      setUsers(Object.values(tempUsers));  // Update local state after changes
    } catch (e) {
      console.error('Failed to save changes:', e);
      setError('Failed to save changes');
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
            <button onClick={() => handleRemoveUser(user.user_id)}>Remove</button>
          </div>
        ))}
        <button type="submit" onClick={saveChanges} className="save-changes-button">Save Changes</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ManageUsersModal;
