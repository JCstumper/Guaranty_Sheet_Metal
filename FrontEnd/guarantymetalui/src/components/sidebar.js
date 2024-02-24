import React, { useState } from 'react';
import './sidebar.css';
import logo from "../pictures/logo.png";
import settingsIcon from "../pictures/settings.png"; // Assuming you have a settings icon image
import ButtonList from './ButtonList';

const buttons = ['DASH', 'INVENTORY', 'ORDERS', 'CUSTOMERS'];

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState(buttons[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const userName = "User Name"; // Placeholder for dynamic user name

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <aside className='sidebar-container'>
            <a href="/">
                <img src={logo} alt="Icon" className="sidebar-image" />
            </a>
            <ButtonList buttons={buttons} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="sidebar-footer">
                <div className="settings-icon-wrapper" onClick={toggleDropdown}>
                    <img src={settingsIcon} alt="Settings" className="settings-icon" />
                </div>
                {dropdownOpen && (
                    <div className="settings-dropdown">
                        <a href="/settings" className="dropdown-item">Settings</a>
                        <a href="/logout" className="dropdown-item">Logout</a>
                    </div>
                )}
                <button className="user-name-button">{userName}</button>
            </div>
        </aside>
    );
};

export default Sidebar;
