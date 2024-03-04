import React from 'react';
import Sidebar from './components/sidebar'; // Adjust the path as necessary
import OverviewCard from './components/OverviewCard'; // Import the OverviewCard component
import './Dashboard.css'; // Assuming you have specific styles for Dashboard

const Dashboard = ({setAuth}) => {
    return (
        <div className="dashboard">
            <Sidebar setAuth={setAuth}/>
            <div className="overview">
                {/* You can repeat the OverviewCard component or map through an array of data to generate multiple cards */}
                <OverviewCard/>
                {/* Add more cards as needed */}
            </div>
        </div>
    );
};

export default Dashboard;
