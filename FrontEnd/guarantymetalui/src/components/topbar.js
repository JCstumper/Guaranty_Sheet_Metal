import React, { useState, useEffect } from 'react';
import './topbar.css';
import logo from "../pictures/logo.png";
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople, MdSettings, MdExitToApp, } from 'react-icons/md';
import { FaHardHat, FaTruck } from 'react-icons/fa';
import LogoutConfirmation from './LogoutConfirmation'; // Import LogoutConfirmation component

const buttons = ['DASHBOARD', 'INVENTORY', 'PURCHASES', 'JOBS', 'SETTINGS'];

const Topbar = ({ setAuth }) => {
    const [userName, setUserName] = useState("");
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
    }, []);

    const handleLogoutConfirm = () => {
        localStorage.removeItem("token");
        setAuth(false);
        setLogoutConfirmationOpen(false); // Close the modal on logout confirmation
    };

    // Removed the original logout function as its logic moves into handleLogoutConfirm

    const getButtonIcon = (button) => {
        switch (button) {
            case 'DASHBOARD':
                return <MdDashboard />;
            case 'INVENTORY':
                return <MdInventory />;
            case 'PURCHASES':
                return <FaTruck />;
            case 'JOBS':
                return <FaHardHat />;
            case 'SETTINGS':
                return <MdSettings />;
            default:
                return null;
        }
    };

    return (
        <aside className="topbar-container">
            <div className="bottom-bar-logo-container">
                <img src={logo} alt="Logo" className="bottom-bar-logo" />
            </div>
            <div className="button-list">
                {buttons.map((button) => {
                    const path = `/${button.toLowerCase()}`;
                    const icon = getButtonIcon(button);

                    return (
                        <NavLink
                            to={path}
                            key={button}
                            className={({ isActive }) => isActive ? "list-button active" : "list-button"}
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
                    <MdExitToApp className="logout-icon" />
                </button>
            </div>

            <LogoutConfirmation isOpen={logoutConfirmationOpen} onConfirm={handleLogoutConfirm} onCancel={() => setLogoutConfirmationOpen(false)} />
        </aside>
    );
};

export default Topbar;
