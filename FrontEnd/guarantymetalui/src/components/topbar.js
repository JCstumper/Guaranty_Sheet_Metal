import React, { useState, useEffect, useRef } from 'react';
import './topbar.css';
import logo from "../pictures/logo.png";
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdInventory, MdShoppingCart, MdPeople, MdSettings, MdExitToApp, } from 'react-icons/md';
import { FaHardHat, FaTruck } from 'react-icons/fa';
import LogoutConfirmation from './LogoutConfirmation';
import LoadingScreen from './Loading'; // Verify this path is correct
import { jwtDecode } from "jwt-decode";
import { Bounce, toast } from 'react-toastify';
import EditProfile from './EditProfile';

const buttons = ['DASHBOARD', 'INVENTORY', 'PURCHASES', 'JOBS'];

const Topbar = ({ setAuth, API_BASE_URL }) => {
    const [userName, setUserName] = useState("");
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    function refreshPage() {
        window.location.reload();
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };      

    const handleProfileUpdate = ({ newUsername, newPassword, newEmail }) => {
        // Process the form data, e.g., send it to your backend server
        console.log(newUsername, newPassword, newEmail);
        updateProfile(newUsername, newPassword, newEmail);
        setShowEditProfile(false);
    };    

    const options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    async function updateProfile(newUsername, newPassword, newEmail) {
        const body = {newUsername, newPassword, newEmail};
        try {
            const response = await fetch(`${API_BASE_URL}/edit/profile`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token
                },
                body: JSON.stringify(body)
            });
            
            const responseBody = await response.json();

            if (responseBody.message === "User updated successfully") {
                setIsLoading(true);
                setShowEditProfile(false);
                toast.success(responseBody.message, options);
                getName();
            }
            else {
                toast.error(responseBody, options);
                setShowEditProfile(true);
            }

        } catch (err) {
            console.error(err.message);
            setShowEditProfile(true);
        }
    }

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

    async function getName() {
        try {
            const response = await fetch(`${API_BASE_URL}/dashboard`, {
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

    useEffect(() => {
        setIsLoading(true); // Optionally trigger loading immediately, adjust based on actual need

        const token = localStorage.token;

        const interval = setInterval(() => {
        if (token) {
            checkTokenExpiration(token);
        }
        }, 900000); // Will check every 15 minutes

        getName();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
    
        // Attach the listener to the document
        document.addEventListener('mousedown', handleClickOutside);

        // Clear the interval when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearInterval(interval);
        };
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
                            <NavLink to={path} key={button} className={({ isActive }) => isActive ? "list-button active" : "list-button"}>
                                {icon}
                                <span>{button}</span>
                            </NavLink>
                        );
                    })}
                </div>
                <div className="user-info" onClick={toggleDropdown} ref={dropdownRef}>
                    <span className="username">{userName}</span>
                    {showDropdown && (
                        <div className="user-dropdown">
                            <button onClick={() => setShowEditProfile(true)}>Edit Profile</button>
                            <button onClick={() => setLogoutConfirmationOpen(true)}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                <LogoutConfirmation 
                    isOpen={logoutConfirmationOpen} 
                    onConfirm={() => {
                        localStorage.removeItem("token");
                        setAuth(false);
                        setShowDropdown(false); // Close the dropdown upon logging out
                    }} 
                    onCancel={() => setLogoutConfirmationOpen(false)} 
                />
                <EditProfile isOpen={showEditProfile} onSave={handleProfileUpdate} onClose={() => setShowEditProfile(false)} />
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
        default: return null;
    }
};
