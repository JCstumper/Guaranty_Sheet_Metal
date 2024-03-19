import React from 'react';
<<<<<<< HEAD
import Sidebar from './components/sidebar';
import OverviewCard from './components/OverviewCard'; // Import OverviewCard component
import './Dashboard.css';
=======
import Topbar from './components/topbar'; // Adjust the path as necessary
import './Dashboard.css'; // Assuming you have specific styles for Dashboard
>>>>>>> main

const Dashboard = ({setAuth}) => {
    return (
        <div className="dashboard">
<<<<<<< HEAD
            <Sidebar setAuth={setAuth}/>
            <div className="card-container">
                {/* Use OverviewCard component for each card */}
                <OverviewCard title="Customers" number={29}/>
                <OverviewCard title="Sales" />
                <OverviewCard title="Top Product" />
                <OverviewCard title="Pending Jobs" />
            </div>
=======
        <Topbar setAuth={setAuth}/>
>>>>>>> main
        </div>
    );
};

export default Dashboard;
