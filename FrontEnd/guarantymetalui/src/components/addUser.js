import React, { useState, useContext, useEffect } from 'react';
import "./AddProduct.css"; // Assuming this CSS file contains styles for `.form-group`
import { toast } from 'react-toastify';
import { AppContext } from '../App';

const AddUser = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('employee'); // Default to 'employee'
    const {API_BASE_URL} = useContext(AppContext);

    useEffect(() => {
        // Reset state when modal is opened
        if (isOpen) {
            setUsername('');
            setPassword('');
            setEmail('');
            setRole('employee');
        }
    }, [isOpen]); // Dependency on isOpen means this effect runs when isOpen changes

    if (!isOpen) return null;

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token
                },
                body: JSON.stringify({ username, password, email, role })
            });
            const data = await response.json();

            if (response.status === 200) {
                toast.success('Registration successful');
                onClose(); // Close the modal on success
            } else {
                toast.error(`Registration failed: ${data}`);
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Error during registration');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <form onSubmit={handleRegister}>
                    <div className="modal-header">
                        <h2>Register User</h2>
                        <button onClick={onClose} className="modal-close-button">×</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role:</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Register</button>
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
