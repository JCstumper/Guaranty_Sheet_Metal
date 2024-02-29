import React, { useState, useEffect } from 'react';
import './sidebar.css';
import logo from "../pictures/logo.png";
import collapsedLogo from "../pictures/collapse-logo.png"; // Assuming you have a collapsed version of the logo
import settingsIcon from "../pictures/settings.png";
import ButtonList from './ButtonList';
import LogoutConfirmation from './LogoutConfirmation'; // Import the confirmation modal component

const buttons = ['HOME', 'INVENTORY', 'ORDERS', 'CUSTOMERS'];

const Sidebar = ({ setAuth }) => {
    const [activeTab, setActiveTab] = useState(buttons[0]);
    const [isCollapsed, setIsCollapsed] = useState(true); // Updated to reflect initial state as not collapsed
    const [userName, setName] = useState("");
    const [initialBgColor, setInitialBgColor] = useState('#ffffff');
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false); // State to control logout confirmation modal
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    useEffect(() => {
        getName();
        setInitialBgColor(generateRandomColor());
    }, [userName]);

    async function getName() {
        try {
            const response = await fetch("http://localhost:3000/dashboard", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            setName(parseRes.username);
        } catch (err) {
            console.error(err.message);
        }
    }

    const logout = (e) => {
        e.preventDefault();
        // Open the logout confirmation modal instead of logging out immediately
        setLogoutConfirmationOpen(true);
    };

    const confirmLogout = () => {
        // Actual logout process handled here
        localStorage.removeItem("token");
        setAuth(false);
    };

    const toggleSettingsDropdown = () => {
        setShowSettingsDropdown(!showSettingsDropdown);
    };

    const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

    return (
        <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`} onMouseEnter={() => setIsCollapsed(false)} onMouseLeave={() => setIsCollapsed(true)}>
            <a href="/" onClick={(e) => e.preventDefault()}>
                <img src={isCollapsed ? collapsedLogo : logo} alt="Logo" className="sidebar-image" />
            </a>

            <ButtonList buttons={buttons} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} />
            <div className="sidebar-footer">
                {!isCollapsed && (
                    <div className="settings-icon-wrapper" onClick={toggleSettingsDropdown} onMouseLeave={() => setShowSettingsDropdown(false)} >
                        <img src={settingsIcon} alt="Settings" className="settings-icon" />
                        {showSettingsDropdown && (
                            <div className="settings-dropdown">
                                <a href="/settings" className="dropdown-item">Settings</a>
                                <a href="#" className="dropdown-item" onClick={logout}>Logout</a> {/* Updated to "#" for href */}
                            </div>
                        )}
                    </div>
                )}
                {isCollapsed ? (
                    <div className="user-name-initial" style={{ backgroundColor: initialBgColor }}>
                        {userName.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <button className="user-name-button">{userName}</button>
                )}
            </div>
            {/* Logout Confirmation Modal */}
            <LogoutConfirmation isOpen={logoutConfirmationOpen} onConfirm={confirmLogout} onCancel={() => setLogoutConfirmationOpen(false)} />
        </aside>
    );
};

export default Sidebar;
