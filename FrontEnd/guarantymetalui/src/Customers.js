import React, { useState, useEffect } from 'react';
import Topbar from './components/topbar';
import './Customers.css';

const Customers = ({ setAuth }) => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("");
    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        setFilteredJobs(jobs.filter(job => 
            job.customer_name.toLowerCase().includes(filter.toLowerCase()) ||
            job.address.toLowerCase().includes(filter.toLowerCase()) ||
            job.phone.includes(filter) ||
            job.email.toLowerCase().includes(filter.toLowerCase())
        ));
    }, [filter, jobs]);
    
    const fetchJobs = async () => {
        try {
            const response = await fetch('https://localhost/api/jobs');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Jobs data:', data);
            setJobs(data.jobs || data);
            setFilteredJobs(data.jobs || data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleSelectJob = (jobId) => {
        setSelectedJobId(prevId => prevId === jobId ? null : jobId);
    };    

    const handleToggleModal = () => {
        setShowModal(!showModal);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleAddJob = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const jobData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://localhost/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Job added:', responseData);
                setJobs([responseData.job, ...jobs]); // Prepend the new job to the list
                fetchJobs(); // Re-fetch jobs to update the list
                handleToggleModal(); // Close the modal
            } else {
                throw new Error('Failed to add job');
            }
        } catch (err) {
            console.error('Failed to add job:', err);
        }
    };
    
    
    const handleViewInvoice = (invoiceId) => {
        console.log('Viewing invoice', invoiceId);
        // Implement the view invoice logic, such as opening a modal or navigating to an invoice page
    };

    const handleAddInvoice = () => {
        console.log('Adding invoice');
        // Implement the add invoice logic, such as opening a form to create a new invoice
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
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job, index) => (

                                    <React.Fragment key={job.id || index}>
                                        <tr onClick={() => handleSelectJob(job.job_id)}>
                                            <td>{job.job_id}</td>
                                            <td>{job.customer_name}</td>
                                            <td>{job.address}</td>
                                            <td>{job.phone}</td>
                                            <td>{job.email}</td>
                                        </tr>
                                        {selectedJobId === job.job_id && (
                                            <tr>
                                                <td colSpan="5">
                                                    <div className="job-details-expanded">
                                                        <div className="job-details-section">
                                                            <h4>Order Details</h4>
                                                            <p><strong>Date:</strong> {job.orderDate}</p>
                                                            <p><strong>Description:</strong> {job.description}</p>
                                                            <p><strong>Quantity & Price:</strong> {job.quantity} at {job.price} each</p>
                                                            <p><strong>Total Cost:</strong> {job.totalCost}</p>
                                                        </div>

                                                        <div className="job-details-section">
                                                            <h4>Invoice Information</h4>
                                                            <p><strong>Invoice Number:</strong> {job.invoiceNumber}</p>
                                                            <p><strong>Date Issued:</strong> {job.dateIssued}</p>
                                                            <p><strong>Due Date:</strong> {job.dueDate}</p>
                                                            <p><strong>Total Amount:</strong> {job.totalAmount}</p>
                                                            <p><strong>Status:</strong> {job.paymentStatus}</p>
                                                            <div className="details-button-container">
                                                                    <button onClick={() => handleViewInvoice(job.invoice.number)} className="details-btn">View Invoice</button>
                                                            </div>
                                                            <div className="details-button-container">
                                                                <button onClick={handleAddInvoice} className="details-btn">Add Invoice</button>
                                                            </div>
                                                        </div>

                                                        <div className="job-details-section">
                                                            <h4>Estimates</h4>
                                                            <p><strong>Estimate Number:</strong> {job.estimateNumber}</p>
                                                            <p><strong>Date Provided:</strong> {job.estimateDate}</p>
                                                            <p><strong>Cost Breakdown:</strong> {job.costBreakdown}</p>
                                                            <p><strong>Expiry Date:</strong> {job.expiryDate}</p>
                                                            <p><strong>Status:</strong> {job.estimateStatus}</p>
                                                            <div className="details-button-container">
                                                                    <button onClick={() => handleViewInvoice(job.invoice.number)} className="details-btn">View Estimate</button>
                                                            </div>
                                                            <div className="details-button-container">
                                                                <button onClick={handleAddInvoice} className="details-btn">Add Estimate</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                <td colSpan="5">No jobs found</td>
                                </tr>
                                )}
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
                                <label htmlFor="customerName">Customer Name:</label>
                                <input type="text" id="customer_name" name="customer_name" placeholder='Customer Name' required />

                                <label htmlFor="jobAddress">Address:</label>
                                <input type="text" id="address" name="address" placeholder='Address' required />

                                <label htmlFor="jobPhone">Phone:</label>
                                <input type="tel" id="phone" name="phone" placeholder='Phone' required />

                                <label htmlFor="jobEmail">Email:</label>
                                <input type="email" id="email" name="email" placeholder='Email' required />

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
