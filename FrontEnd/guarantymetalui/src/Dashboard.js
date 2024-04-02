import React from 'react';
import Topbar from './components/topbar'; // Adjust the path as necessary
import BarCard from './components/BarCard'; // Make sure the path to GraphCard is correct
import PieCard from './components/PieCard'; // Make sure the path to GraphCard is correct
import './Dashboard.css'; // Assuming you have specific styles for Dashboard

const Dashboard = ({ setAuth, API_BASE_URL }) => {
    return (
        <div className="dashboard">
            <Topbar setAuth={setAuth} API_BASE_URL={API_BASE_URL}/>
            <div className="card-container">
                {/* Your existing cards */}
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
            <div className="graph-container">
                {/* Place GraphCard components inside this container */}
                <BarCard />
                <PieCard />
                {/* You can add more GraphCard components or different types of graph components here */}
            </div>
        </div>
    );
};

export default Dashboard;
