import React from 'react';
import Sidebar from './components/sidebar';
import './Inventory.css';

const Inventory = ({setAuth}) => {
    return (
        <div className="inventory">
        <Sidebar setAuth={setAuth}/>
        </div>
    );
};

export default Inventory;