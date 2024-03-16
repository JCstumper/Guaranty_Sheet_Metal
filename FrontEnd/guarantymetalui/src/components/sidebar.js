import React, { useState, useEffect } from 'react';
import './sidebar.css';
<<<<<<< HEAD
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
=======
import logo from "../pictures/logo.png";
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople, MdSettings, MdExitToApp } from 'react-icons/md'; // Import MdSettings and MdArrowDropDown icons
import LogoutConfirmation from './LogoutConfirmation'; // Import LogoutConfirmation component

const buttons = ['DASHBOARD', 'INVENTORY', 'ORDERS', 'CUSTOMERS', 'SETTINGS']; // Add 'SETTINGS' button to the list

const Sidebar = ({ setAuth }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(buttons[0]);
    const [userName, setUserName] = useState("");
    const [initialBgColor, setInitialBgColor] = useState('#ffffff');
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);



    useEffect(() => {
        async function getName() {
            try {
                const response = await fetch("https://localhost/api/dashboard", {
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

    const logout = () => {
>>>>>>> origin/main
        localStorage.removeItem("token");
        setAuth(false);
    };

<<<<<<< HEAD
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
=======
    const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

    const handleLinkClick = (button) => {
        setActiveTab(button);
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
            case 'SETTINGS': // Return MdSettings icon for 'SETTINGS' button
                return <MdSettings />;
            default:
                return null;
        }
    };

    return (
        <aside className="sidebar-container">
            <div className="bottom-bar-logo-container">
                <img src={logo} alt="Logo" className="bottom-bar-logo" />
            </div>
            <div className="button-list">
            {buttons.map((button) => {
                    const path = button === 'DASHBOARD' ? '/dashboard' : `/${button.toLowerCase()}`;
                    const icon = getButtonIcon(button);

                    return (
                        <NavLink
                            to={path}
                            key={button}
                            className="list-button"
                            activeClassName="active"
                            onClick={() => handleLinkClick(button)}
                        >
                            {icon}
                            <span>{button}</span>
                        </NavLink>
                    );
                })}
            </div>
            <div className="user-name-dropdown">
                <button className="user-name" onClick={() => setLogoutConfirmationOpen(true)}>
                    {userName}
                    <MdExitToApp className="logout-icon" onClick={logout} />
                </button>
                {logoutConfirmationOpen && (
                    <div className="logout-dropdown">
                        <button onClick={logout}>Sign Out</button>
                    </div>
                )}
            </div>

            <LogoutConfirmation isOpen={logoutConfirmationOpen} onConfirm={logout} onCancel={() => setLogoutConfirmationOpen(false)} />
>>>>>>> origin/main
        </aside>
    );
    
};

export default Sidebar;
