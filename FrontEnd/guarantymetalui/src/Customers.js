import React, { useState } from 'react';
import Topbar from './components/topbar';
import './Customers.css';

const Customers = ({ setAuth }) => {
    const [jobs, setJobs] = useState([
        { id: 1, customerName: 'Customer A', address: 'Address A', phone: 'Phone A', email: 'Email A', details: 'Order details for Customer A' },
        { id: 2, customerName: 'Customer B', address: 'Address B', phone: 'Phone B', email: 'Email B', details: 'Order details for Customer B' },
    ]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("");

    const handleSelectJob = (jobId) => {
        setSelectedJobId(jobId === selectedJobId ? null : jobId);
    };

    const handleToggleModal = () => {
        setShowModal(!showModal);
    };
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };
    const handleAddJob = (event) => {
        event.preventDefault();
        // Logic to add job will go here
        console.log('Job added');
        handleToggleModal();
    };
    

    return (
        <div className="customers">
            <Topbar setAuth={setAuth}/>
            <div className="customers-main">
                <div className="customer-table">
                    <div className="table-header">
                        <span>Jobs</span>
                        <button onClick={handleToggleModal} className="add-button">Add Job</button>
                    </div>
                    <div className="table-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>JOB ID</th>
                                    <th>CUSTOMER NAME</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, index) => (
                                    <React.Fragment key={index}>
                                        <tr onClick={() => handleSelectJob(job.id)}>
                                            <td>{job.id}</td>
                                            <td>{job.customerName}</td>
                                            <td>{job.address}</td>
                                            <td>{job.phone}</td>
                                            <td>{job.email}</td>
                                        </tr>
                                        {selectedJobId === job.id && (
                                            <tr>
                                                <td colSpan="5">{job.details}</td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="filtering-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search jobs..."
                        value={filter}
                        onChange={handleFilterChange}
                    />
                    <button className="action-button">Filter</button>
                </div>
            </div>
            {showModal && (
                <div className="modalAddJob">
                    <div className="modalAddJob-content">
                        <div className="modalAddJob-header">
                            <h2>Add New Job</h2>
                            <button onClick={handleToggleModal} className="close-modalAddJob">X</button>
                        </div>
                        <div className="modalAddJob-body">
                            <form onSubmit={handleAddJob}>
                                <label htmlFor="jobId">Job ID:</label>
                                <input type="text" id="jobId" name="jobId" required />

                                <label htmlFor="customerName">Customer Name:</label>
                                <input type="text" id="customerName" name="customerName" required />

                                <label htmlFor="jobAddress">Address:</label>
                                <input type="text" id="jobAddress" name="jobAddress" required />

                                <label htmlFor="jobPhone">Phone:</label>
                                <input type="tel" id="jobPhone" name="jobPhone" required />

                                <label htmlFor="jobEmail">Email:</label>
                                <input type="email" id="jobEmail" name="jobEmail" required />

                                <div className="modalAddJob-footer">
                                    <button type="submit" className="btn btn-primary">Add Job</button>
                                    <button type="button" onClick={handleToggleModal} className="btn btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
