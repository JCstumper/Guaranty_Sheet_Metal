import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import './AddProduct.css'; 

const InitialSetupModal = ({ showInitialSetup, setShowInitialSetup, API_BASE_URL }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        role: 'admin' 
    });

    if (!showInitialSetup) return null;

    const handleInputChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const validateFields = () => {
        const { username, password, confirmPassword, email } = credentials;
        if (!username || !password || !confirmPassword || !email) {
            toast.error('Please fill in all fields.');
            return false;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/firstregister`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                    email: credentials.email,
                    role: credentials.role
                })
            });
            const data = await response.json();
            if (response.ok) {
                setShowInitialSetup(false);
                toast.success('Initial setup completed successfully!');
                window.location.reload();
            } else {
                throw new Error(data.message || 'Failed to complete initial setup');
            }
        } catch (error) {
            toast.error('Error: ' + error.message);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h2>Initial Setup</h2>
                    </div>
                    <div className="modal-body">
                        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Welcome to the Guaranty Sheet Metal Inventory Management Application.</p>
                        <p style={{ fontSize: '14px', color: 'gray' }}>Since you are the first user in the application, we need to update the Admin account information.</p>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" value={credentials.username} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" value={credentials.password} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={credentials.confirmPassword} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" value={credentials.email} onChange={handleInputChange} />
                        </div>
                        <div className="modal-actions">
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InitialSetupModal;
