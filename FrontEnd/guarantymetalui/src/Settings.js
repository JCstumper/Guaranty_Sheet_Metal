import React from 'react';
import Sidebar from './components/sidebar'; // Adjust the path as necessary
import './Orders.css'; // Assuming you have specific styles for Dashboard

const Settings = ({setAuth}) => {
    return (
        <div className="settings">
        <Sidebar setAuth={setAuth}/>
        </div>
    );
};

export default Settings;