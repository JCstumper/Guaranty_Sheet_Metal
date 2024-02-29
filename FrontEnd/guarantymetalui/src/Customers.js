import React from 'react';
import Sidebar from './components/sidebar'; // Adjust the path as necessary
import './Customers.css'; // Assuming you have specific styles for Dashboard

const Customers = () => {
    return (
        <div className="inventory">
        <Sidebar />
            <div className="customers-container">
                Customers
            </div>
        </div>
    );
};

export default Customers;