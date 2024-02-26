import React from 'react';
import Sidebar from './components/sidebar'; // Adjust the path as necessary
import './Dashboard.css'; // Assuming you have specific styles for Dashboard

const Dashboard = ({setAuth}) => {
    return (
        <div className="dashboard">
        <Sidebar />
        </div>
    );
};

export default Dashboard;
