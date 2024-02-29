import React from 'react';
import Sidebar from './components/sidebar'; // Adjust the path as necessary
import './Orders.css'; // Assuming you have specific styles for Dashboard

const Orders = ({setAuth}) => {
    return (
        <div className="inventory">
        <Sidebar setAuth={setAuth}/>
        </div>
    );
};

export default Orders;