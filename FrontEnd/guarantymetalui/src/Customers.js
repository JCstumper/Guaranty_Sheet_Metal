import React, { useState, useEffect } from 'react';
import Topbar from './components/topbar';
import './Customers.css';

const Customers = ({ setAuth, API_BASE_URL }) => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEstimateModal, setShowEstimateModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
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
            const response = await fetch(`${API_BASE_URL}/jobs`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setJobs(data.jobs || data);
            setFilteredJobs(data.jobs || data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleSelectJob = async (jobId) => {
        const isSameJob = selectedJobId === jobId;
        setSelectedJobId(isSameJob ? null : jobId);
    
        if (!isSameJob) {
            try {
                const response = await fetch(`https://localhost/api/jobs/check-estimate/${jobId}`);
                if (response.ok) {
                    const { hasEstimate } = await response.json();
                    const updatedJobs = jobs.map(job => {
                        if (job.job_id === jobId) {
                            return { ...job, hasEstimate };
                        }
                        return job;
                    });
                    setJobs(updatedJobs);
                } else {
                    console.error(`Failed to check estimate for job ID: ${jobId}`);
                }
            } catch (error) {
                console.error(`Error checking estimate for job ID: ${jobId}`, error);
            }
        }
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
            const response = await fetch(`${API_BASE_URL}/jobs`, {
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
    const handleViewEstimate = async (jobId) => {
        console.log('Viewing Estimate for job ID:', jobId);
        try {
            const checkResponse = await fetch(`https://localhost/api/jobs/check-estimate/${jobId}`);
            const checkData = await checkResponse.json();
            if (!checkData.hasEstimate) {
                alert("No estimate exists for this job.");
                return;
            }
            const response = await fetch(`https://localhost/api/jobs/estimate/${jobId}`);
            if (response.ok) {
                const estimateData = await response.json();
                const pdfBlob = new Blob([new Uint8Array(estimateData.pdf_data.data)], { type: 'application/pdf' });
                const pdfUrl = window.URL.createObjectURL(pdfBlob);
                
                // Open the PDF in a new browser tab
                window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    
                // If you want to display the PDF in an iframe within the current page, you could set the src of the iframe to pdfUrl
                // document.getElementById('your-iframe-id').src = pdfUrl;
            } else {
                console.error('Failed to fetch estimate');
            }
        } catch (error) {
            console.error('Error fetching estimate:', error);
        }
    };
    const handleAddEstimate = async (jobId) => {
        try {
            const response = await fetch(`https://localhost/api/jobs/check-estimate/${jobId}`);
            if (!response.ok) {
                throw new Error('Failed to check estimate existence');
            }
            const { hasEstimate } = await response.json();
            if (hasEstimate) {
                alert("An estimate already exists for this job.");
            } else {
                console.log('Adding Estimate for job ID:', jobId);
                setShowEstimateModal(true);
            }
        } catch (error) {
            console.error('Error checking estimate:', error);
            alert('Error checking for existing estimate');
        }
    };
    
    const handleRemoveEstimate = async (jobId) => {
        try {
            const response = await fetch(`https://localhost/api/jobs/check-estimate/${jobId}`);
            if (!response.ok) {
                throw new Error('Failed to check estimate existence');
            }
            const { hasEstimate } = await response.json();
            if (!hasEstimate) {
                alert("No estimate exists for this job to remove.");
                return;
            }
    
            if (window.confirm('Are you sure you want to remove this estimate?')) {
                console.log('Removing Estimate for job ID:', jobId);
                const removeResponse = await fetch(`https://localhost/api/jobs/remove-estimate/${jobId}`, {
                    method: 'DELETE'
                });
                if (removeResponse.ok) {
                    alert('Estimate removed successfully');
                    fetchJobs(); // Re-fetch jobs to update the list and reflect the removal of the estimate
                } else {
                    const errorData = await removeResponse.json();
                    console.error('Failed to remove estimate:', errorData.message);
                    alert(`Failed to remove estimate: ${errorData.message}`);
                }
            }
        } catch (error) {
            console.error('Error in removing estimate:', error);
            alert('Error checking for existing estimate or removing it. Please try again.');
        }
    };
    
      
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUploadEstimate = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('estimatePdf', selectedFile);
        formData.append('job_id', selectedJobId);
    
        try {
            const response = await fetch('https://localhost/api/jobs/upload-estimate', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                console.log('Estimate uploaded successfully');
                setShowEstimateModal(false);
    
                // Update the job list to reflect the new estimate
                const updatedJobs = jobs.map(job => {
                    if (job.job_id === selectedJobId) {
                        return { ...job, hasEstimate: true };
                    }
                    return job;
                });
                setJobs(updatedJobs);
                // No need to call fetchJobs here as we already updated the state
    
            } else {
                throw new Error('Failed to upload estimate');
            }
        } catch (error) {
            console.error('Error uploading estimate:', error);
        }
    };
    

    return (
        <div className="customers">
            <Topbar setAuth={setAuth} />
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
                                    <th>Job ID</th>
                                    <th>Customer Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>E-mail</th>
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
                                                            <h4>Estimates</h4>
                                                            <p><strong>Estimate Number:</strong> {job.estimateNumber}</p>
                                                            <p><strong>Date Provided:</strong> {job.estimateDate}</p>
                                                            <p><strong>Cost Breakdown:</strong> {job.costBreakdown}</p>
                                                            <p><strong>Expiry Date:</strong> {job.expiryDate}</p>
                                                            <p><strong>Status:</strong> {job.estimateStatus}</p>
                                                            <div className="details-button-container">
                                                                {job.hasEstimate && (
                                                                    <>
                                                                        <button onClick={() => handleViewEstimate(job.job_id)} className="details-btn">View Estimate</button>
                                                                        <button onClick={() => handleRemoveEstimate(job.job_id)} className="details-btn">Remove Estimate</button>
                                                                    </>
                                                                )}
                                                                {!job.hasEstimate && (
                                                                    <button onClick={() => handleAddEstimate(job.job_id)} className="details-btn">Add Estimate</button>
                                                                )}
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
            {showEstimateModal && (
                <div className="modalAddJob">
                    <div className="modalAddJob-content">
                        <div className="modalAddJob-header">
                            <h2>Add Estimate</h2>
                            <button onClick={() => setShowEstimateModal(false)} className="close-modalAddJob">X</button>
                        </div>
                        <div className="modalAddJob-body">
                            <form onSubmit={handleUploadEstimate}>
                                <label htmlFor="estimatePdf"class="custom-file-upload">Choose PDF:</label>
                                <input type="file" id="estimatePdf" name="estimatePdf" onChange={handleFileChange} required accept="application/pdf" style={{ display: 'none' }} />
                                <div className="modalAddJob-footer">
                                    <button type="submit" className="btn btn-primary">Upload Estimate</button>
                                    <button type="button" onClick={() => setShowEstimateModal(false)} className="btn btn-secondary">Cancel</button>
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
