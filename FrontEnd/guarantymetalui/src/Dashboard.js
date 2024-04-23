import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from './App';
import Topbar from './components/topbar';
import BarCard from './components/BarCard';
import './Dashboard.css';

const Dashboard = ({ setAuth }) => {
    const { API_BASE_URL } = useContext(AppContext);
    const [dashboardData, setDashboardData] = useState({
        customers: 0,
        purchases: 0,
        products: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/dashboard/counts`, {
                    method: "GET",
                    headers: { token: localStorage.token }
                });
                const data = await response.json();
                setDashboardData({
                    customers: data.customers,
                    products: data.products,
                    purchases: data.purchases
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };

        fetchData();
    }, [API_BASE_URL]);

    return (
        <div className="dashboard">
            <Topbar setAuth={setAuth}/>
            <div className="card-container">
                <div className="cxcard">
                    <div className="card-content">
                        <h3 className="card-title">Customers</h3>
                        <p className="card-info">{dashboardData.customers}</p>
                    </div>
                </div>
                <div className="scard">
                    <div className="card-content">
                        <h3 className="card-title">Purchases</h3>
                        <p className="card-info">{dashboardData.purchases}</p>
                    </div>
                </div>
                <div className="pcard">
                    <div className="card-content">
                        <h3 className="card-title">Products</h3>
                        <p className="card-info">{dashboardData.products}</p>
                    </div>
                </div>
            </div>
            <div className="graph-container">
                <BarCard />
            </div>
        </div>
    );
};

export default Dashboard;
