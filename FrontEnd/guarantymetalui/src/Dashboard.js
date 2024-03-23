import React from 'react';
import Topbar from './components/topbar'; // Adjust the path as necessary
import './Dashboard.css'; // Assuming you have specific styles for Dashboard

const Dashboard = ({setAuth}) => {
    return (
        <div className="dashboard">
            <Topbar setAuth={setAuth}/>
            <div className="card-container"> {/* Ensure this div is correctly opened */}
                <div className="cxcard">
                    <div className="card-content">
                        <h3 className="card-title">Customers</h3>
                        <p className="card-info">172</p>
                    </div>
                </div>
                <div className="scard">
                    <div className="card-content">
                        <h3 className="card-title">Sales</h3>
                        <p className="card-info">376</p>
                    </div>
                </div>
                <div className="pcard">
                    <div className="card-content">
                        <h3 className="card-title">Products</h3>
                        <p className="card-info">579</p>
                    </div>
                </div>
                <div className="Tcard">
                    <div className="card-content">
                        <h3 className="card-title">Pending Jobs</h3>
                        <p className="card-info">18</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
