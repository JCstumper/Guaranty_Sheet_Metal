import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from './pictures/logo.png';

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Here, you would typically validate the username and password
        // For demonstration, let's navigate to /home directly
        navigate('/home');
    };

    return (
        <div className="login-container">
            <div className="logo-container">
                <img src={logo} alt="Company Logo" className="company-logo" />
            </div>
            <form className="login-form" onSubmit={handleLogin}>
                <input type="text" placeholder="Username" className="login-input" />
                <input type="password" placeholder="Password" className="login-input" />
                <button type="submit" className="login-button">Login</button>
                <a href="#" className="forgot-password">Forgot Password?</a>
            </form>
        </div>
    );
};


export default LoginPage;
