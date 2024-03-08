import React from 'react';
import './Loading.css';
import logo from '../pictures/logo.png';

const LoadingScreen = () => {
    return (
        <div className="loading-screen active">
            <div className="box">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <div className="spinner"></div>
            </div>
        </div>
    );
}

export default LoadingScreen;
