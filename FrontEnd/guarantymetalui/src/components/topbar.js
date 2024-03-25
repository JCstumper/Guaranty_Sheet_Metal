import React, { useState, useEffect } from 'react';
import './topbar.css';
import logo from "../pictures/logo.png";
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople, MdSettings, MdExitToApp, } from 'react-icons/md';
import { FaHardHat, FaTruck } from 'react-icons/fa';
import LogoutConfirmation from './LogoutConfirmation';
import LoadingScreen from './Loading'; // Verify this path is correct
import { jwtDecode } from "jwt-decode";

const buttons = ['DASHBOARD', 'INVENTORY', 'PURCHASES', 'JOBS', 'SETTINGS'];

const Topbar = ({ setAuth }) => {
    const [userName, setUserName] = useState("");
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
    const [isTokenExpired, setIsTokenExpired] = useState(false);

    const checkTokenExpiration = (token) => {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000; // Convert to seconds
          if (decodedToken.exp < currentTime) {
            setIsTokenExpired(true);
            localStorage.removeItem("token");
            setAuth(false); 
          } else {
            setIsTokenExpired(false);
            setAuth(true);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
    };

    useEffect(() => {
        setIsLoading(true); // Optionally trigger loading immediately, adjust based on actual need
        async function getName() {
            try {
                const response = await fetch("https://localhost/api/dashboard", {
                    method: "GET",
                    headers: { token: localStorage.token }
                });
                
                const responseBody = await response.json(); // Moved here to ensure it always executes

                if (!response.ok && responseBody.error === "jwt expired") {
                    setTimeout(() => setIsLoading(false), 500); // Ensure loading is stopped whether the request is successful or not
                    setAuth(false);
                } else {
                    setTimeout(() => setIsLoading(false), 500); // Ensure loading is stopped whether the request is successful or not
                    setAuth(true);
                    setUserName(responseBody.username); // Adjusted based on the moved line
                }
            } catch (err) {
                console.error(err.message);
                setIsLoading(false); // Ensure loading is stopped on error
            }
        }

        const token = localStorage.token;

        const interval = setInterval(() => {
        if (token) {
            checkTokenExpiration(token);
        }
        }, 900000); // Will check every 15 minutes

        getName();
        setInitialBgColor(generateRandomColor());

        // Clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const onConfirmLogout = () => {
        setIsLoading(true); // Immediately show the loading screen on logout confirmation
        setTimeout(() => {
            localStorage.removeItem("token");
            setAuth(false);
            setLogoutConfirmationOpen(false);
            setIsLoading(false); // Hide the loading screen after 1 second
        }, 1000); // Delay to keep the loading screen visible for 1 second
    };

    return (
        <>
            <div className={`loading-overlay ${isLoading ? '' : 'hide'}`}>
                <LoadingScreen />
            </div>
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
                <div className="user-info">
                    <div className="username">{userName}</div>
                    <button className="logout-button" aria-label="Logout" onClick={() => setLogoutConfirmationOpen(true)}>
                        <MdExitToApp className="logout-icon" />
                    </button>
                </div>
                <LogoutConfirmation 
                    isOpen={logoutConfirmationOpen} 
                    onConfirm={onConfirmLogout} 
                    onCancel={() => setLogoutConfirmationOpen(false)} 
                />
            </aside>
        </>
    );
};

export default Topbar;

const getButtonIcon = (button) => {
    switch (button) {
        case 'DASHBOARD': return <MdDashboard />;
        case 'INVENTORY': return <MdInventory />;
        case 'PURCHASES': return <FaTruck />;
        case 'JOBS': return <FaHardHat />;
        case 'SETTINGS': return <MdSettings />;
        default: return null;
    }
};
