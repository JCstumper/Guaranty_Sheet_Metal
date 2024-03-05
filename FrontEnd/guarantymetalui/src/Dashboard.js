import React from 'react';
import Sidebar from './components/sidebar';
import './Dashboard.css';

const Dashboard = ({setAuth}) => {
    return (
        <div className="dashboard">
            <Sidebar setAuth={setAuth}/>
            <div className="card-container"> {/* Wrapper for cards */}
                <div className="overview-card">Customers</div>
                <div className="overview-card">Sales</div>
                <div className="overview-card">Top Product</div>
                <div className="overview-card">Pending Jobs</div>
            </div>
        </div>
    );
};

export default Dashboard;
