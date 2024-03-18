import React from 'react';
import Topbar from './components/topbar'; // Adjust the path as necessary
import './Orders.css'; // Assuming you have specific styles for Dashboard

const Orders = ({setAuth}) => {
    return (
        <div className="orders">
        <Topbar setAuth={setAuth}/>
        </div>
    );
};

export default Orders;