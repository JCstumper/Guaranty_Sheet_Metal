import React, { useState, useEffect } from 'react';
import './sidebar.css';
import collapsedLogo from "../pictures/collapse-logo.png";
import ButtonList from './ButtonList';
import LogoutConfirmation from './LogoutConfirmation';

const buttons = ['HOME', 'INVENTORY', 'ORDERS', 'CUSTOMERS'];

const Sidebar = ({ setAuth }) => {
    const [activeTab, setActiveTab] = useState(buttons[0]);
    const [userName, setName] = useState("");
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
    const [initialBgColor, setInitialBgColor] = useState('#d1cece'); // Now correctly placed within the component
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
    const toggleSettingsDropdown = () => {
        setShowSettingsDropdown(prevState => !prevState);
    };
    
    useEffect(() => {
        // Attempt to fetch an existing color for the user from local storage
        let color = localStorage.getItem('userColor');
        if (!color) {
            // If not found, generate a new one and store it
            color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            localStorage.setItem('userColor', color);
        }
        setInitialBgColor(color);
    }, []); // Empty dependency array ensures this runs once on component mount
    
    const logout = (e) => {
        e.preventDefault();
        setLogoutConfirmationOpen(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        setAuth(false);
    };

    return (
        <aside className="sidebar-container">
            <a href="/" onClick={(e) => e.preventDefault()}>
                <img src={collapsedLogo} alt="Logo" className="sidebar-image" />
            </a>
            <ButtonList buttons={buttons} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="sidebar-footer">
                <div 
                    className="user-name-initial" 
                    style={{ backgroundColor: initialBgColor }}
                    onClick={toggleSettingsDropdown}
                >
                    {userName.charAt(0).toUpperCase()}
                </div>
    
                {/* Conditional rendering for showing the settings/options modal or dropdown */}
                {showSettingsDropdown && (
                    <div className="settings-dropdown">
                        <a href="/settings" className="dropdown-item">Settings</a>
                        <a href="#" className="dropdown-item" onClick={logout}>Logout</a>
                    </div>
                )}
            </div>
    
            <LogoutConfirmation isOpen={logoutConfirmationOpen} onConfirm={confirmLogout} onCancel={() => setLogoutConfirmationOpen(false)} />
        </aside>
    );
    
};

export default Sidebar;
