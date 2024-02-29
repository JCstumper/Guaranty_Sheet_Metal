// Import necessary modules from React and other components
import React, { useState, useEffect } from 'react';
import './sidebar.css'; // Import the stylesheet for the sidebar
import logo from "../pictures/logo.png"; // Import the standard logo
import collapsedLogo from "../pictures/collapse-logo.png"; // Import the logo for the collapsed state
import settingsIcon from "../pictures/settings.png"; // Import the settings icon
import ButtonList from './ButtonList'; // Import the ButtonList component for navigation
import LogoutConfirmation from './LogoutConfirmation'; // Import the LogoutConfirmation component

// Pre-defined buttons for sidebar navigation
const buttons = ['HOME', 'INVENTORY', 'ORDERS', 'CUSTOMERS'];

// Sidebar component with `setAuth` prop for managing authentication state
const Sidebar = ({ setAuth }) => {
    // State for the active navigation tab
    const [activeTab, setActiveTab] = useState(buttons[0]);
    // State to manage sidebar collapsed or expanded status
    const [isCollapsed, setIsCollapsed] = useState(true);
    // State for storing the user's name
    const [userName, setName] = useState("");
    // State for the initial background color
    const [initialBgColor, setInitialBgColor] = useState('#ffffff');
    // State to control the visibility of the logout confirmation modal
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
    // State for showing or hiding the settings dropdown
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    // Effect hook to fetch the user's name and set a random color for the initial upon component mount or userName change
    useEffect(() => {
        getName();
        setInitialBgColor(generateRandomColor());
    }, [userName]);

    // Function to fetch the user's name, typically from a backend server
    async function getName() {
        try {
            const response = await fetch("http://localhost:3000/dashboard", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            setName(parseRes.username); // Set the fetched username to state
        } catch (err) {
            console.error(err.message);
        }
    }

    // Function to handle logout button click, opens confirmation modal
    const logout = (e) => {
        e.preventDefault();
        setLogoutConfirmationOpen(true);
    };

    // Function to handle confirmation of logout, removes token and updates auth state
    const confirmLogout = () => {
        localStorage.removeItem("token");
        setAuth(false);
    };

    // Function to toggle the visibility of the settings dropdown
    const toggleSettingsDropdown = () => {
        setShowSettingsDropdown(!showSettingsDropdown);
    };

    // Function to generate a random color for the initial background
    const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

    return (
        // Sidebar structure with conditional class for collapsed state
        <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`} onMouseEnter={() => setIsCollapsed(false)} onMouseLeave={() => setIsCollapsed(true)}>
            <a href="/" onClick={(e) => e.preventDefault()}>
                <img src={isCollapsed ? collapsedLogo : logo} alt="Logo" className="sidebar-image" />
            </a>
            <ButtonList buttons={buttons} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} />
            <div className="sidebar-footer">
                {!isCollapsed && (
                    <div className="settings-icon-wrapper" onClick={toggleSettingsDropdown} onMouseLeave={() => setShowSettingsDropdown(false)}>
                        <img src={settingsIcon} alt="Settings" className="settings-icon" />
                        {showSettingsDropdown && (
                            <div className="settings-dropdown">
                                <a href="/settings" className="dropdown-item">Settings</a>
                                <a href="#" className="dropdown-item" onClick={logout}>Logout</a>
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
            <LogoutConfirmation isOpen={logoutConfirmationOpen} onConfirm={confirmLogout} onCancel={() => setLogoutConfirmationOpen(false)} />
        </aside>
    );
};

export default Sidebar; // Export the Sidebar component for use elsewhere in the application
