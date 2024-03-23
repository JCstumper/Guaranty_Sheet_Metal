import React from 'react';
import Topbar from './components/topbar'; // Adjust the path as necessary
import './Dashboard.css'; // Assuming you have specific styles for Dashboard

const Dashboard = ({setAuth}) => {
    return (
    <div className="dashboard">
        <Topbar setAuth={setAuth}/>
        
            
        
    </div>
    
    );
};

export default Dashboard;
