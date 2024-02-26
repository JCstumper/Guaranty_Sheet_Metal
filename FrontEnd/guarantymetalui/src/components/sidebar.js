import React, { useState, useEffect } from 'react';
import './sidebar.css';
import logo from "../pictures/logo.png";
import collapsedLogo from "../pictures/collapse-logo.png"; // Assuming you have a collapsed version of the logo
import settingsIcon from "../pictures/settings.png";
import ButtonList from './ButtonList';

const buttons = ['HOME', 'INVENTORY', 'ORDERS', 'CUSTOMERS'];

const Sidebar = ({ setAuth }) => {
    const [activeTab, setActiveTab] = useState(buttons[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [userName, setName] = useState("");
    const [initialBgColor, setInitialBgColor] = useState('#ffffff'); // Default color

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
        localStorage.removeItem("token");
        setAuth(false);
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

    return (
        <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`} onMouseEnter={() => setIsCollapsed(false)} onMouseLeave={() => setIsCollapsed(true)}>
            <a href="/">
                <img src={isCollapsed ? collapsedLogo : logo} alt="Logo" className="sidebar-image" />
            </a>
            <ButtonList buttons={buttons} activeTab={activeTab} setActiveTab={setActiveTab} isCollapsed={isCollapsed} />
            <div className="sidebar-footer">
                {!isCollapsed && (
                    <div className="settings-icon-wrapper" onClick={toggleDropdown}>
                        <img src={settingsIcon} alt="Settings" className="settings-icon" />
                    </div>
                )}
                {dropdownOpen && (
                    <div className="settings-dropdown">
                        <a href="/settings" className="dropdown-item">Settings</a>
                        <a href="/logout" className="dropdown-item" onClick={logout}>Logout</a>
                    </div>
                )}
                {isCollapsed ? (
                    <div className="user-name-initial" style={{ backgroundColor: initialBgColor }}>
                        {userName.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <button className="user-name-button">{userName} </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
