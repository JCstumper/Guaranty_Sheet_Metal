import React, { useState, useEffect } from 'react';
import './sidebar.css';
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

    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
    };

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
        </aside>
    );
};

export default Sidebar;
