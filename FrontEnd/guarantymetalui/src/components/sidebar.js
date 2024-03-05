// Sidebar.js
import React, { useState, useEffect } from 'react';
import './sidebar.css';
import logo from "../pictures/logo.png";
import settingsIcon from "../pictures/settings.png";
import { Link } from 'react-router-dom';
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople } from 'react-icons/md';
import LogoutConfirmation from './LogoutConfirmation';

const buttons = ['DASHBOARD', 'INVENTORY', 'ORDERS', 'CUSTOMERS'];

const Sidebar = ({ setAuth }) => {
    const [activeTab, setActiveTab] = useState(buttons[0]);
    const [userName, setUserName] = useState("");
    const [initialBgColor, setInitialBgColor] = useState('#ffffff');
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    useEffect(() => {
        async function getName() {
            try {
                const response = await fetch("http://localhost:3000/dashboard", {
                    method: "GET",
                    headers: { token: localStorage.token }
                });

                if (!response.ok) {
                    const responseBody = await response.json();
                    if (responseBody.error === "jwt expired") {
                        setAuth(false);
                    }
                } else {
                    setAuth(true);
                }

                const parseRes = await response.json();
                setUserName(parseRes.username);
            } catch (err) {
                console.error(err.message);
            }
        }

        getName();
        setInitialBgColor(generateRandomColor());
    }, []);

    const logout = (e) => {
        e.preventDefault();
        setLogoutConfirmationOpen(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        setAuth(false);
    };

    const toggleSettingsDropdown = () => {
        setShowSettingsDropdown(!showSettingsDropdown);
    };

    const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

    const handleLinkClick = (button) => {
        setActiveTab(button); // Update active tab immediately
    };

    return (
        <aside className="sidebar-container">
            <div className="bottom-bar-logo-container">
                <img src={logo} alt="Logo" className="bottom-bar-logo" />
            </div>
            <div className="button-list">
                {buttons.map((button) => {
                    const isActive = button === activeTab;
                    const className = isActive ? 'list-button active' : 'list-button';
                    const path = button === 'DASHBOARD' ? '/dashboard' : `/${button.toLowerCase()}`;
                    const icon = getButtonIcon(button);

                    return (
                        <Link
                            to={path}
                            key={button}
                            className={className}
                            onClick={() => handleLinkClick(button)} // Set active tab directly
                        >
                            {icon}
                            <span>{button}</span> {/* Display button name */}
                        </Link>
                    );
                })}
            </div>
            <div className="sidebar-footer">
                <div className="settings-icon-wrapper" onClick={toggleSettingsDropdown} onMouseLeave={() => setShowSettingsDropdown(false)}>
                    <img src={settingsIcon} alt="Settings" className="settings-icon" />
                    {showSettingsDropdown && (
                        <div className="settings-dropdown">
                            <a href="/settings" className="dropdown-item">Settings</a>
                            <a href="#" className="dropdown-item" onClick={logout}>Logout</a>
                        </div>
                    )}
                </div>
                <button className="user-name-button">{userName}</button>
            </div>
            <LogoutConfirmation isOpen={logoutConfirmationOpen} onConfirm={confirmLogout} onCancel={() => setLogoutConfirmationOpen(false)} />
        </aside>
    );
};

const getButtonIcon = (button) => {
    switch (button) {
        case 'DASHBOARD':
            return <MdDashboard />;
        case 'INVENTORY':
            return <MdInventory />;
        case 'ORDERS':
            return <MdShoppingCart />;
        case 'CUSTOMERS':
            return <MdPeople />;
        default:
            return null;
    }
};

export default Sidebar;
