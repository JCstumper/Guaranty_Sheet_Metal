import React from 'react';
import Sidebar from './components/sidebar';
import OverviewCard from './components/OverviewCard'; // Import OverviewCard component
import './Dashboard.css';

const Dashboard = ({setAuth}) => {
    return (
        <div className="dashboard">
            <Sidebar setAuth={setAuth}/>
            <div className="card-container">
                {/* Use OverviewCard component for each card */}
                <OverviewCard title="Customers" />
                <OverviewCard title="Sales" />
                <OverviewCard title="Top Product" />
                <OverviewCard title="Pending Jobs" />
            </div>
        </div>
    );
};

export default Dashboard;
