import React, { useState, useEffect, useContext } from 'react';
import Topbar from './components/topbar';
import './Customers.css';
import AddPartModal from './AddPartModal'; 

import { AppContext } from './App';

const Customers = ({ setAuth }) => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [necessaryParts, setNecessaryParts] = useState([]); // State for necessary parts
    const [usedParts, setUsedParts] = useState([]); // State for used parts
    const [showModal, setShowModal] = useState(false);
    const [showEstimateModal, setShowEstimateModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filter, setFilter] = useState("");
    const {API_BASE_URL} = useContext(AppContext);
    const [showAddPartModal, setShowAddPartModal] = useState(false);

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
    const handleAddNecessaryPart = () => {
        setShowAddPartModal(true);
    };
    const handleAddPartToNecessary = (part) => {
        // Assuming 'part' includes 'price' after being added through the 'handleAdd' function in 'AddPartModal'
        setNecessaryParts(prevParts => [...prevParts, part]);
        setShowAddPartModal(false);
    };    
    const handleCloseAddPartModal = () => {
        setShowAddPartModal(false);
    };
    // This function will be passed to the AddPartModal and called when a part is selected
    const handleAddPart = (part) => {
    const updatedNecessaryParts = [...necessaryParts, part];
    setNecessaryParts(updatedNecessaryParts);
    handleCloseAddPartModal();  // Close the modal after adding the part
    };    
    const handleMoveToUsed = (partNumber) => {
        // Logic to move a part from Necessary to Used
    };
    
    const handleEditNecessaryPart = (partNumber) => {
        // Logic to edit a part in the Necessary Parts list
    };
    
    const handleRemoveNecessaryPart = (partNumber) => {
        // Logic to remove a part from the Necessary Parts list
    };
    
    const handleAddUsedPart = () => {
        // Logic to add a part to the Used Parts list
    };
    
    const handleReturnToNecessary = (partNumber) => {
        // Logic to move a part from Used to Necessary
    };
    
    const handleEditUsedPart = (partNumber) => {
        // Logic to edit a part in the Used Parts list
    };
    
    const handleRemoveUsedPart = (partNumber) => {
        // Logic to remove a part from the Used Parts list
    };
    // For the total costs of parts
    const totalUsedCost = usedParts.reduce((acc, part) => acc + (part.quantity_used * part.price || 0), 0);
    const totalNecessaryCost = necessaryParts.reduce((acc, part) => acc + (part.quantity_required * part.price || 0), 0);


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
                                                            <h4>Job Ticket</h4>
                                                            {/* Necessary Parts Section */}
                                                            <div className="parts-section">
                                                                <h5>Necessary Parts</h5>
                                                                <button onClick={handleAddNecessaryPart} className="add-part-btn">Add Part</button>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Part Number</th>
                                                                            <th>Description</th>
                                                                            <th>Quantity Required</th>
                                                                            <th>Price</th>
                                                                            <th>Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {necessaryParts.map( part => (
                                                                            <tr key={part.id}>
                                                                                <td>{part.part_number}</td>
                                                                                <td>{part.description}</td>
                                                                                <td>{part.quantity_required}</td>
                                                                                <td>${part.price?.toFixed(2) ?? 'N/A'}</td>
                                                                                <td>
                                                                                    <button onClick={() => handleMoveToUsed(part.part_number)} className="details-btn">Move to Used</button>
                                                                                    <button onClick={() => handleEditNecessaryPart(part.part_number)} className="details-btn">Edit</button>
                                                                                    <button onClick={() => handleRemoveNecessaryPart(part.part_number)} className="details-btn">Remove</button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                <p>Total Cost of Necessary Parts: ${totalNecessaryCost.toFixed(2)}</p>
                                                            </div>
                                                            {/* Used Parts Section */}
                                                            <div className="parts-section">
                                                                <h5>Used Parts</h5>
                                                                <button onClick={handleAddUsedPart} className="add-part-btn">Add Part</button>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Part Number</th>
                                                                            <th>Description</th>
                                                                            <th>Quantity Used</th>
                                                                            <th>Price</th>
                                                                            <th>Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {usedParts.map(part => (
                                                                            <tr key={part.id}>
                                                                                <td>{part.part_number}</td>
                                                                                <td>{part.description}</td>
                                                                                <td>{part.quantity_used}</td>
                                                                                <td>${part.price ? part.price.toFixed(2) : 'N/A'}</td>
                                                                                <td>
                                                                                    <button onClick={() => handleReturnToNecessary(part.part_number)} className="details-btn">Return to Necessary</button>
                                                                                    <button onClick={() => handleEditUsedPart(part.part_number)} className="details-btn">Edit</button>
                                                                                    <button onClick={() => handleRemoveUsedPart(part.part_number)} className="details-btn">Remove</button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                <p>Total Cost of Used Parts: ${totalUsedCost.toFixed(2)}</p>
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
            {showAddPartModal && (
                <AddPartModal
                    isOpen={showAddPartModal}
                    onClose={handleCloseAddPartModal}
                    //onAddPart={handleAddPartToNecessary} // Implement this function according to your needs
                    API_BASE_URL={API_BASE_URL}
                    selectedJobId={selectedJobId}
                />
            )}
        </div>
    );
};

export default Customers;
