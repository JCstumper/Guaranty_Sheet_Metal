import React from 'react';
import Topbar from './components/topbar'; // Adjust the path as necessary
import './Dashboard.css'; // Assuming you have specific styles for Dashboard

const Dashboard = ({setAuth}) => {
    return (
        <div className="dashboard">
        <Topbar setAuth={setAuth}/>
        <div className="card">
            <div className="card-content">
                <h3 className="card-title">Card Title</h3>
                <p className="card-info">This is a summary of the card.</p>
            </div>
            
        </div>
    </div>
    
    );
};

export default Dashboard;
