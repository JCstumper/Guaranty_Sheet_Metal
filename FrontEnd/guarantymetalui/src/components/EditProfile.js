import React, { useState } from 'react';
import "./EditProfile.css";

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
    <div className="edit-profile-overlay">
        <div className="edit-profile-container">
            <form onSubmit={handleSave}>
                <input
                    type="text"
                    placeholder="New username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="e-mail"
                    placeholder="New email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    </div>
  );
};

export default EditProfilePopup;
