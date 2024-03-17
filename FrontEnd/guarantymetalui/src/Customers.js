import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import './Customers.css';

const Customers = ({ setAuth }) => {
    const [customers, setCustomers] = useState([
        { id: 'C001', name: 'John Doe', email: 'johndoe@example.com', orders: 5, balance: '100.00' },
        { id: 'C002', name: 'Jane Doe', email: 'janedoe@example.com', orders: 3, balance: '200.00' },
        { id: 'C003', name: 'Mike Smith', email: 'mikesmith@example.com', orders: 2, balance: '150.00' },
        { id: 'C004', name: 'Sara Wilson', email: 'sarawilson@example.com', orders: 4, balance: '250.00' },
        { id: 'C005', name: 'Gary White', email: 'garywhite@example.com', orders: 1, balance: '300.00' },
        { id: 'C006', name: 'Anna Black', email: 'annablack@example.com', orders: 6, balance: '350.00' },
        { id: 'C007', name: 'Tom Green', email: 'tomgreen@example.com', orders: 3, balance: '400.00' }
    ]);

    const addCustomer = () => {
        const newCustomer = {
            id: `C00${customers.length + 1}`, // Example ID, should be unique
            name: 'New Customer', // Placeholder name
            email: `newcustomer${customers.length + 1}@example.com`, // Placeholder email
            orders: 0, // Placeholder order count
            balance: '0.00' // Placeholder balance
        };

        setCustomers([...customers, newCustomer]);
    };

    return (
        <div className="customers">
            <Sidebar setAuth={setAuth} />
            <div className="customers-content">
                <div className="table-header">
                    <span className="table-title">Customers</span>
                    <div className="table-actions">
                        <input type="text" placeholder="Search..." className="search-input" />
                        <button className="action-button">Filter</button>
                        <button className="action-button" onClick={addCustomer}>Add Customer</button>
                    </div>
                </div>
                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Orders</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.orders}</td>
                                <td>${customer.balance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;

