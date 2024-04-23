import React, { useState } from 'react';
import "./AddProduct.css"; 

const EditProfilePopup = ({ isOpen, onSave, onClose }) => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');

    if (!isOpen) return null;
        
    const handleSave = (e) => {
        e.preventDefault();
        onSave({ newUsername, newPassword, newEmail });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <form onSubmit={handleSave}>
                    <div className="modal-header">
                        <h2>Edit Profile</h2>
                        <button onClick={onClose} className="modal-close-button">×</button>
                    </div>
                    <div className="modal-body">
                        {/* Wrap each input with the form-group class */}
                        <div className="form-group">
                            <input
                                id="Username"
                                type="text"
                                placeholder="New username"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                id="Password"
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                id="Email"
                                type="email"
                                placeholder="New email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Save Changes</button>
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePopup;
