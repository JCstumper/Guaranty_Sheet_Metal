import React from 'react';
import Topbar from './components/topbar'; // Adjust the path as necessary
import './Customers.css'; // Assuming you have specific styles for Dashboard

const Customers = ({setAuth}) => {
    return (
        <div className="customers">
        <Topbar setAuth={setAuth}/>
            <div className="customers-container">
                Customers
            </div>
        </div>
    );
};

export default Customers;