import React, { useState, useEffect, useRef, useContext } from 'react';
import './topbar.css';
import logo from "../pictures/logo.png";
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdInventory } from 'react-icons/md';
import { FaHardHat, FaTruck, FaHistory, FaBars } from 'react-icons/fa';
import LogoutConfirmation from './LogoutConfirmation';
import LoadingScreen from './Loading'; 
import { jwtDecode } from "jwt-decode";
import { Bounce, toast } from 'react-toastify';
import EditProfile from './EditProfile';
import AddUser from './addUser';
import ManageUsers from './ManageUsers';
import { AppContext } from '../App';

const buttons = ['DASHBOARD', 'INVENTORY', 'PURCHASES', 'JOBS', 'LOGS'];

const Topbar = ({ setAuth }) => {
    const [userName, setUserName] = useState("");
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const [showNavDropdown, setShowNavDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const {API_BASE_URL} = useContext(AppContext);
    const [showManageUsers, setShowManageUsers] = useState(false); 
    const [showRegisterUser, setShowRegisterUser] = useState(false); 
    const [role, setRole] = useState('');

    const toggleDropdown = () => {
        setShowDropdown(prevShowDropdown => !prevShowDropdown);
    };
    

    const handleProfileUpdate = ({ newUsername, newPassword, newEmail }) => {
        
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

            if (response.ok) {
                const data = await response.json(); 
                if (data.token) { 
                    localStorage.removeItem("token"); 
                    localStorage.setItem("token", data.token); 
                }
                setIsLoading(true);
                setShowEditProfile(false);
                toast.success('Profile was updated.');
                getName();
            }
            
            else {
                setShowEditProfile(false);
                toast.error('Profile failed to update. Username, password, or email already exist.');
            }

        } catch (err) {
            console.error(err.message);
            setShowEditProfile(false);
        }
    }

    const checkTokenExpiration = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; 
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
            
            const responseBody = await response.json(); 

            if (!response.ok && responseBody.error === "jwt expired") {
                setTimeout(() => setIsLoading(false), 500); 
                setAuth(false);
            } else {
                setTimeout(() => setIsLoading(false), 500); 
                setAuth(true);
                setUserName(responseBody.username); 
            }
        } catch (err) {
            console.error(err.message);
            setIsLoading(false); 
        }
    }

    useEffect(() => {
        setIsLoading(true); 

        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRole(decodedToken.role); 
            } catch (error) {
                console.error('Error decoding token:', error);
            }

            checkTokenExpiration(token);
        }

        const interval = setInterval(() => {
        if (token) {
            checkTokenExpiration(token);
        }
        }, 900000); 

        getName();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
    
        
        document.addEventListener('mousedown', handleClickOutside);

        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearInterval(interval);
        };
    }, []);

    const onConfirmLogout = () => {
        setIsLoading(true); 
        setShowDropdown(false);
        setTimeout(() => {
            localStorage.removeItem("token");
            setAuth(false);
            setLogoutConfirmationOpen(false);
            setIsLoading(false); 
        }, 1000); 
    };

    const filteredButtons = role !== "admin" ? buttons.filter(button => button !== "LOGS") : buttons;
    return (
        <>
            <div className={`loading-overlay ${isLoading ? '' : 'hide'}`}>
                <LoadingScreen />
            </div>
            <aside className="topbar-container">
                <div className="bottom-bar-logo-container">
                    <img src={logo} alt="Logo" className="bottom-bar-logo" />
                </div>
                <div className="hamburger-menu" onClick={() => setShowNavDropdown(!showNavDropdown)}>
                    <FaBars />
                </div>
                <div className={`${showNavDropdown ? "nav-dropdown show" : "button-list"}`}>
                    {filteredButtons.map((button) => {
                        const path = `/${button.toLowerCase()}`;
                        const icon = getButtonIcon(button);
                        return (
                            <NavLink to={path} key={button} className={({ isActive }) => isActive ? "list-button active" : "list-button"} onClick={() => setShowNavDropdown(false)}>
                                {icon}
                                <span><strong>{button}</strong></span>
                            </NavLink>
                        );
                    })}
                </div>
                <div className="user-info" onClick={toggleDropdown} ref={dropdownRef}>
                    <button className="username"><strong>{userName.toUpperCase()}</strong></button>
                    <div className={`user-dropdown ${showDropdown ? 'show-dropdown' : ''}`}>
                    {role === 'admin' && (
                        <button onClick={() => setShowRegisterUser(true)} className="add-a-user">Add a User</button>
                    )}
                        <button onClick={() => setShowEditProfile(true)}className="edit-profile">Edit Profile</button>
                        {role === 'admin' && (
                            <button onClick={() => setShowManageUsers(true)} className="manage-users">Manage Users</button>
                        )}
                        <button onClick={() => setLogoutConfirmationOpen(true)} className="logout-user">Logout</button>
                    </div>
                </div>
                <LogoutConfirmation 
                    isOpen={logoutConfirmationOpen} 
                    onConfirm={() => {
                        onConfirmLogout(); 
                    }} 
                    onCancel={() => setLogoutConfirmationOpen(false)} 
                />
                <EditProfile isOpen={showEditProfile} onSave={handleProfileUpdate} onClose={() => setShowEditProfile(false)} />
                <ManageUsers isOpen={showManageUsers} onClose={() => setShowManageUsers(false)} /> 
                <AddUser isOpen={showRegisterUser} onClose={() => setShowRegisterUser(false)} />
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
        case 'LOGS': return <FaHistory />;
        default: return null;
    }
};



