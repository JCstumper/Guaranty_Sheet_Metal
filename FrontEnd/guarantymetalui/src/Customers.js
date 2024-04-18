import React, { useState, useEffect, useContext } from 'react';
import Topbar from './components/topbar';
import './Customers.css';
import './components/AddProduct.css';
import AddPartModal from './AddPartModal'; 
import { toast } from 'react-toastify';
import { AppContext } from './App';
import DeleteJobModal from './components/DeleteJobModal';
import RemoveEstimateModal from './components/RemoveEstimateModal';
import ConfirmMoveToUsedModal from './components/ConfirmMovedToUsedModal';
import UpdatePartModal from './components/UpdatePartModal';
import RemovePartModal from './components/RemovePartModal';
import ReturnPartModal from './components/ReturnPartModal';
import RemoveUsedPartModal from './components/RemoveUsedPartModal';

const Customers = ({ setAuth }) => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [necessaryParts, setNecessaryParts] = useState([]); // State for necessary parts
    const [usedParts, setUsedParts] = useState([]); // State for used parts
    const [showModal, setShowModal] = useState(false);
    const [showEstimateModal, setShowEstimateModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [filter, setFilter] = useState("");
    const {API_BASE_URL} = useContext(AppContext);
    const [showAddPartModal, setShowAddPartModal] = useState(false);
    const [editingPart, setEditingPart] = useState(null); //State for tracking editing of Necessary parts
    const [editingUsedPart, setEditingUsedPart] = useState(null); // State for tracking editing of used parts
    const [editingJob, setEditingJob] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [totalNecessaryCost, setTotalNecessaryCost] = useState(0);
    const [totalUsedCost, setTotalUsedCost] = useState(0);
    const [partActionType, setPartActionType] = useState('necessary'); // 'necessary' or 'used'
    const [expandJobDetails, setExpandJobDetails] = useState(false);

    const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
    const [showRemoveEstimateModal, setShowRemoveEstimateModal] = useState(false);
    const [showMoveToUsedModal, setShowMoveToUsedModal] = useState(false);
    const [selectedPart, setSelectedPart] = useState(null);
    const [showUpdatePartModal, setShowUpdatePartModal] = useState(false);
    const [editablePart, setEditablePart] = useState(null);
    const [showRemovePartModal, setShowRemovePartModal] = useState(false);
    const [selectedPartId, setSelectedPartId] = useState(null);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnPart, setReturnPart] = useState(null);
    const [showRemoveUsedModal, setShowRemoveUsedModal] = useState(false);
    const [selectedUsedPart, setSelectedUsedPart] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, [filter]);
    
    useEffect(() => {
        if (selectedJobId) {
            fetchNecessaryParts(selectedJobId);
        }
    }, [selectedJobId]); // This effect runs when selectedJobId changes

    useEffect(() => {
        setFilteredJobs(jobs.filter(job =>
            job.customer_name.toLowerCase().includes(filter.toLowerCase()) ||
            job.address.toLowerCase().includes(filter.toLowerCase()) ||
            job.phone.includes(filter) ||
            job.email.toLowerCase().includes(filter.toLowerCase()) ||
            (job.estimateFileName && job.estimateFileName.toLowerCase().includes(filter.toLowerCase()))
        ));
    }, [filter, jobs]);
    

    useEffect(() => {
        const calculateTotal = (parts) => parts.reduce((acc, part) => {
            // Ensure price is a float
            const price = parseFloat(part.price);
            const quantity = parseFloat(part.quantity_used || part.quantity_required);
            return acc + (quantity * price);
        }, 0);
    
        const newTotalNecessaryCost = calculateTotal(necessaryParts);
        const newTotalUsedCost = calculateTotal(usedParts);
    
        setTotalNecessaryCost(newTotalNecessaryCost);
        setTotalUsedCost(newTotalUsedCost);
    }, [necessaryParts, usedParts]);
    
    const fetchJobs = async () => {
        const token = localStorage.getItem('token');
        const endpoint = filter.trim() ? `${API_BASE_URL}/jobs/search?query=${encodeURIComponent(filter.trim())}` : `${API_BASE_URL}/jobs`;
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'token': token
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setJobs(data);
            setFilteredJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };
    
    const fetchNecessaryParts = async (jobId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/necessary-parts`, {
                headers: {
                    'token': token
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const partsData = await response.json();
            setNecessaryParts(partsData);
        } catch (error) {
            setNecessaryParts([]);
        }
    };
    
    const fetchUsedParts = async (jobId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/used-parts`, {
                headers: {
                    'token': token
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const partsData = await response.json();
            setUsedParts(partsData);
        } catch (error) {

        }
    };
    
    const handleSelectJob = (jobId) => {
        if (selectedJobId === jobId) {
            setExpandJobDetails(!expandJobDetails); // Toggle visibility if the same job is clicked
        } else {
            setSelectedJobId(jobId);
            setExpandJobDetails(true); // Expand details for a new job
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
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${API_BASE_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
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
    
    const handleEditJob = (event, jobId) => {
        event.stopPropagation();
        setSelectedJobId(jobId);
        setExpandJobDetails(false);  // Optionally close or keep open based on your UX preference
        setShowEditModal(true);
    };
    
    const handleRemoveJob = (event, jobId) => {
        event.stopPropagation();
        setSelectedJobId(jobId);
        setExpandJobDetails(false);  // Ensure details are not expanded when opening the remove confirmation
        setShowDeleteJobModal(true);
    };
    
    const handleSaveJob = async () => {
        const { job_id, ...updatedFields } = editingJob;
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
    
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${job_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token // Include the token in the request header
                },
                body: JSON.stringify(updatedFields)
            });
    
            if (response.ok) {
                toast.success('Job updated successfully.'); // Using toast for success message
                fetchJobs(); // Refresh the jobs list
                setShowEditModal(false); // Close the edit modal
            } else {
                throw new Error('Failed to update job.');
            }
        } catch (error) {
            console.error('Error updating job:', error);
            toast.error('Failed to update job. ' + error.message); // Using toast for error message
        }
    }; 

    const handleViewEstimate = async (jobId) => {
        console.log('Viewing Estimate for job ID:', jobId);
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
    
        try {
            const checkResponse = await fetch(`${API_BASE_URL}/jobs/check-estimate/${jobId}`, {
                headers: {
                    'token': token // Include the token in the request header
                }
            });
            const checkData = await checkResponse.json();
            if (!checkData.hasEstimate) {
                toast.info("No estimate exists for this job.");
                return;
            }
    
            const response = await fetch(`${API_BASE_URL}/jobs/estimate/${jobId}`, {
                headers: {
                    'token': token // Include the token in the request header for fetching the estimate
                }
            });
    
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
                toast.error('Failed to fetch estimate');
            }
        } catch (error) {
            console.error('Error fetching estimate:', error);
            toast.error('Error fetching estimate: ' + error.message);
        }
    };    

    const handleAddEstimate = async (jobId) => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
    
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/check-estimate/${jobId}`, {
                headers: {
                    'token': token // Include the token in the request header
                }
            });
            if (!response.ok) {
                throw new Error('Failed to check estimate existence');
            }
            const { hasEstimate } = await response.json();
            if (hasEstimate) {
                toast.info("An estimate already exists for this job.");
            } else {
                console.log('Adding Estimate for job ID:', jobId);
                setShowEstimateModal(true);
            }
        } catch (error) {
            console.error('Error checking estimate:', error);
            toast.error('Error checking for existing estimate: ' + error.message);
        }
    };
    

    const handleRemoveEstimate = async (jobId) => {
        const token = localStorage.getItem('token');
        try {
            const checkResponse = await fetch(`${API_BASE_URL}/jobs/check-estimate/${jobId}`, {
                headers: {
                    'token': token
                }
            });

            const checkData = await checkResponse.json();
            if (!checkResponse.ok || !checkData.hasEstimate) {
                toast.info("No estimate exists for this job to remove.");
                return;
            }
            
            setSelectedJobId(jobId); // Set job ID to state
            setShowRemoveEstimateModal(true); // Show the modal for confirmation
        } catch (error) {
            console.error('Error in removing estimate:', error);
            toast.error('Error checking for existing estimate or removing it. Please try again.');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setSelectedFileName(file.name);  // Save the file name
        } else {
            setSelectedFile(null);  // Ensure to clear file state if no file is selected
            setSelectedFileName("");
        }
    };

    const handleUploadEstimate = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('estimatePdf', selectedFile);
        formData.append('job_id', selectedJobId);
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/upload-estimate`, {
                method: 'POST',
                headers: {
                    'token': token
                },
                body: formData,
            });
            if (response.ok) {
                toast.success('Estimate uploaded successfully');
                setShowEstimateModal(false);
    
                // Update the job list to reflect the new estimate and store the file name
                const updatedJobs = jobs.map(job => {
                    if (job.job_id === selectedJobId) {
                        return { ...job, hasEstimate: true, estimateFileName: selectedFileName };
                    }
                    return job;
                });
                setJobs(updatedJobs);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload estimate');
            }
        } catch (error) {
            console.error('Error uploading estimate:', error);
            toast.error('Error uploading estimate: ' + error.message);
        }
    };

    const handleAddNecessaryPart = () => {
        setPartActionType('necessary');
        setShowAddPartModal(true);
    };

    const handleAddPartToNecessary = async (addedPart) => {
        setNecessaryParts(prevParts => [...prevParts, addedPart]);
        await fetchNecessaryParts(selectedJobId);
    };
    const handleAddPartToUsed = async (addedPart) => {
        setUsedParts(prevParts => [...prevParts, addedPart]);
        await fetchUsedParts(selectedJobId);
    };

    const handleCloseAddPartModal = () => {
        setShowAddPartModal(false);
    };  

    const movePartToUsed = async () => {
        const requestBody = {
            part_number: selectedPart.part_number,
            quantity_to_move: parseInt(selectedPart.quantity_required, 10)
        };
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/move-to-used`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const { actualQuantityMoved, message } = await response.json();
                toast.success(message);

                const remainingQuantity = parseInt(selectedPart.quantity_required, 10) - actualQuantityMoved;
                setNecessaryParts(necessaryParts.map(p =>
                    p.id === selectedPart.id ? { ...p, quantity_required: remainingQuantity } : p
                ));

                const existingUsedPart = usedParts.find(p => p.part_number === selectedPart.part_number);
                if (existingUsedPart) {
                    setUsedParts(usedParts.map(p =>
                        p.part_number === selectedPart.part_number
                            ? { ...p, quantity_used: p.quantity_used + actualQuantityMoved }
                            : p
                    ));
                } else {
                    setUsedParts([...usedParts, { ...selectedPart, quantity_used: actualQuantityMoved }]);
                }

                fetchNecessaryParts(selectedJobId);
                fetchUsedParts(selectedJobId);
            } else {
                const errorResponse = await response.json();
                toast.error(errorResponse.error);
            }
        } catch (error) {
            toast.error('Failed to move part to used. Please try again. ' + error.message);
            console.error('Error moving part to used:', error);
        }
    };

    const handleMoveToUsed = (partId) => {
        const part = necessaryParts.find(p => p.id === partId);
        if (!part) {
            toast.error('Part not found');
            return;
        }
        if (parseInt(part.quantity_required, 10) <= 0) {
            toast.error('Cannot move to used as the quantity is 0');
            return;
        }

        setSelectedPart(part);
        setShowMoveToUsedModal(true);
    };

    const handleEditNecessaryPart = (part) => {
        setEditingPart({...part, newQuantity: part.quantity_required});
    };    

    const saveEditedPart = async (part) => {
        const newQuantity = parseInt(part.newQuantity, 10);

        if (newQuantity < 0) {
            toast.error('Quantity cannot be negative.');
            return;
        }

        setEditablePart(part); // Set the part for potential editing or removal
        setShowUpdatePartModal(true); // Open the modal for confirmation
    };

    const updatePart = async (part) => {
        const token = localStorage.getItem('token');
        const newQuantity = parseInt(part.newQuantity, 10);

        try {
            const response = await fetch(`${API_BASE_URL}/jobs/necessary-parts/${part.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ ...part, quantity_required: newQuantity })
            });

            if (response.ok) {
                const updatedParts = necessaryParts.map(p =>
                    p.id === part.id ? { ...p, quantity_required: newQuantity } : p
                );
                setNecessaryParts(updatedParts);
                setEditingPart(null);
                toast.success('Part updated successfully.');
                setShowUpdatePartModal(false);
            } else {
                throw new Error('Failed to update necessary part');
            }
        } catch (error) {
            console.error('Error updating necessary part:', error);
            toast.error('Failed to update necessary part. ' + error.message);
        }
    };

    const handleRemoveNecessaryPartClick = (partId) => {
        setSelectedPartId(partId);
        setShowRemovePartModal(true);
    };

    const handleRemoveNecessaryPart = async (partId) => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/necessary-parts/${partId}`, {
                method: 'DELETE',
                headers: {
                    'token': token // Include the token in the request header
                }
            });

            if (response.ok) {
                setNecessaryParts(necessaryParts.filter(part => part.id !== partId));
                toast.success('Necessary part removed successfully.');
            } else {
                throw new Error('Failed to remove necessary part');
            }
        } catch (error) {
            console.error('Error removing necessary part:', error);
            toast.error('Failed to remove necessary part. ' + error.message);
        }
    };

    const handleAddUsedPart = () => {
        setPartActionType('used');
        setShowAddPartModal(true);
    };

    const handleOpenReturnModal = (part) => {
        setReturnPart(part);
        setShowReturnModal(true);
    };    

    const handleReturnToNecessary = async () => {
        if (!returnPart) {
            toast.error("No part selected for return.");
            return;
        }
    
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/return-to-necessary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ part_id: returnPart.id, quantity_used: returnPart.quantity_used })
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                toast.error(errorResponse.error);
                return;
            }
    
            const data = await response.json();
            toast.success(data.message);
    
            // Update local state for UI
            const updatedUsedParts = usedParts.filter(p => p.id !== returnPart.id);
            setUsedParts(updatedUsedParts);
            
            // Optionally, refresh necessary parts from the server to get updated data
            fetchNecessaryParts(selectedJobId);
        } catch (error) {
            console.error('Error returning part to necessary:', error);
            toast.error('Failed to return part to necessary. ' + error.message);
        }
    
        // Close the modal
        setShowReturnModal(false);
        setReturnPart(null);
    };    

    const handleEditUsedPart = (partId) => {
        const part = usedParts.find(p => p.id === partId);
        setEditingUsedPart(part ? { ...part, newQuantity: part.quantity_used } : null);
    };

    const saveEditedUsedPart = async (part) => {
        const originalQuantity = part.quantity_used;
        const newQuantity = parseInt(part.newQuantity, 10);
    
        // Check for negative values
        if (newQuantity < 0) {
            toast.error('Quantity cannot be negative.');
            return;
        }
    
        // Handle removing the part if the quantity is set to 0
        if (newQuantity === 0) {
            await handleRemoveUsedPart(part.id);
            return;
        }
    
        const quantityDiff = newQuantity - originalQuantity;
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
    
        // If increasing the quantity, check if enough inventory exists
        if (quantityDiff > 0) {
            const inventoryRes = await fetch(`${API_BASE_URL}/inventory/${part.part_number}`, {
                headers: { 'token': token }  // Include the token in the request header
            });
            if (!inventoryRes.ok) {
                toast.error('Error fetching inventory data.');
                return;
            }
            const inventoryData = await inventoryRes.json();
            if (inventoryData.quantity_in_stock < quantityDiff) {
                toast.error('Not enough inventory to increase used quantity.');
                return;
            }
        }
    
        // Proceed to update the used part
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/update-used-part`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token  // Include the token in the request header
                },
                body: JSON.stringify({
                    part_id: part.id,
                    new_quantity: newQuantity,
                    quantity_diff: quantityDiff
                })
            });
    
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
    
                // Update the local state to reflect the new quantity in the used parts list
                setUsedParts(usedParts.map(p =>
                    p.id === part.id ? { ...p, quantity_used: newQuantity } : p
                ));
    
                // Exit editing mode
                setEditingUsedPart(null);
    
                // Optionally, refresh necessary parts and inventory to reflect the changes
                fetchNecessaryParts(selectedJobId);
                // Assuming you have a function to fetch inventory
            } else {
                const errorResponse = await response.json();
                toast.error(errorResponse.error);
            }
        } catch (error) {
            console.error('Error updating used part:', error);
            toast.error('Failed to update used part. ' + error.message);
        }
    };

    const handleRemoveUsedPart = async (partId) => {
        const part = usedParts.find(p => p.id === partId);
        if (!part) {
            toast.error('Part not found');
            return;
        }
    
        setSelectedUsedPart(part);
        setShowRemoveUsedModal(true);
    };
    
    // This function will be triggered upon modal confirmation
    const confirmRemoveUsedPart = async (partId) => {
        const part = usedParts.find(p => p.id === partId);
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/remove-from-used`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({
                    part_number: part.part_number,
                    quantity_used: part.quantity_used
                })
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Network response was not ok: ' + errorText);
            }
    
            await response.json();
            toast.success(`Part ${part.part_number} removed from used.`);
            setUsedParts(usedParts.filter(p => p.id !== partId));
        } catch (error) {
            console.error('Error removing part from used:', error);
            toast.error('Failed to remove part from used. ' + error.message);
        }
    };

    return (
        <div className="customers">
            <Topbar setAuth={setAuth} />
            <div className="customers-main">
            <div className="filtering-box-jobs">
                    <input
                        type="text"
                        className="search-input-jobs"
                        placeholder="Search jobs..."
                        value={filter}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="customer-table">
                    <div className="table-header">
                        <span className="table-title"><strong>JOBS</strong></span>
                        <button onClick={handleToggleModal} className="add-button">+</button>
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
                                    <th>Date Created</th>
                                    <th>Action</th>
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
                                            <td>{new Date(job.date_created).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={(e) => handleEditJob(e, job.job_id)} className="edit-btn">Edit</button>
                                                <button onClick={(e) => handleRemoveJob(e, job.job_id)} className="remove-btn">Remove</button>
                                            </td>
                                        </tr>
                                        {expandJobDetails && selectedJobId === job.job_id && (
                                            <tr>
                                                <td colSpan="7">
                                                    <div className="job-details-expanded">
                                                        {/* Estimates Section */}
                                                        <div className="job-details-section">
                                                            <h4>Job Estimate</h4>
                                                            {job.hasEstimate ? (
                                                                <>
                                                                    <p>Estimate File: {job.estimatefilename || "No file uploaded yet"}</p>
                                                                    <div className="details-button-container">
                                                                        <button onClick={() => handleViewEstimate(job.job_id)} className="details-btn">View Estimate</button>
                                                                        <button onClick={() => handleRemoveEstimate(job.job_id)} className="details-btn">Remove Estimate</button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <button onClick={() => handleAddEstimate(job.job_id)} className="details-btn">Add Estimate</button>
                                                            )}
                                                        </div>
                                                        {/* Necessary Parts Section */}
                                                        <div className="job-details-section">
                                                            <h4>Necessary Parts</h4>
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
                                                                {necessaryParts.map(part => (
                                                                    <tr key={part.id}>
                                                                        <td>{part.part_number}</td>
                                                                        <td>{part.description}</td>
                                                                        <td>
                                                                            {editingPart && editingPart.id === part.id ? (
                                                                                <input
                                                                                    type="number"
                                                                                    value={editingPart.newQuantity}
                                                                                    onChange={(e) => setEditingPart({ ...editingPart, newQuantity: e.target.value })}
                                                                                    min="0"
                                                                                />
                                                                            ) : (
                                                                                part.quantity_required
                                                                            )}
                                                                        </td>
                                                                        <td>${part.price?.toFixed(2) ?? 'N/A'}</td>
                                                                        <td>
                                                                            <button onClick={() => handleMoveToUsed(part.id)} className="details-btn">Move to Used</button>
                                                                            {editingPart && editingPart.id === part.id ? (
                                                                                <button onClick={() => saveEditedPart(editingPart)} className="details-btn">Save</button>
                                                                            ) : (
                                                                                <button onClick={() => handleEditNecessaryPart(part)} className="details-btn">Edit</button>
                                                                            )}
                                                                            <button onClick={() => handleRemoveNecessaryPartClick(part.id)} className="details-btn">Remove</button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </table>
                                                            <p>Total Cost of Necessary Parts: ${totalNecessaryCost.toFixed(2)}</p>
                                                        </div>
                                                        {/* Used Parts Section */}
                                                        <div className="job-details-section">
                                                            <h4>Used Parts</h4>
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
                                                                        <td>
                                                                            {editingUsedPart && editingUsedPart.id === part.id ? (
                                                                                <input
                                                                                    type="number"
                                                                                    value={editingUsedPart.newQuantity}
                                                                                    onChange={(e) => setEditingUsedPart({ ...editingUsedPart, newQuantity: e.target.value })}
                                                                                    min="0"
                                                                                />
                                                                            ) : (
                                                                                part.quantity_used
                                                                            )}
                                                                        </td>
                                                                        <td>${part.price?.toFixed(2) ?? 'N/A'}</td>
                                                                        <td>
                                                                            <button onClick={() => handleOpenReturnModal(part)} className="details-btn">Return to Necessary</button>
                                                                            {editingUsedPart && editingUsedPart.id === part.id ? (
                                                                                <button onClick={() => saveEditedUsedPart(editingUsedPart)} className="details-btn">Save</button>
                                                                            ) : (
                                                                                <button onClick={() => handleEditUsedPart(part.id)} className="details-btn">Edit</button>
                                                                            )}
                                                                            <button onClick={() => handleRemoveUsedPart(part.id)} className="details-btn">Remove</button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </table>
                                                            <p>Total Cost of Used Parts: ${totalUsedCost.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No jobs found</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showModal && (
                // Assuming the CSS provided is already included in your project
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <form onSubmit={handleAddJob}>
                            <div className="modal-header">
                                <h2>Add New Job</h2>
                                <button onClick={handleToggleModal} className="modal-close-button">×</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="customerName">Customer Name:</label>
                                    <input type="text" id="customer_name" name="customer_name" placeholder='Customer Name' required className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="jobAddress">Address:</label>
                                    <input type="text" id="address" name="address" placeholder='Address' required className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="jobPhone">Phone:</label>
                                    <input type="tel" id="phone" name="phone" placeholder='Phone' required className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="jobEmail">Email:</label>
                                    <input type="email" id="email" name="email" placeholder='Email' required className="form-control" />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Add Job</button>
                                <button type="button" onClick={handleToggleModal} className="btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Job</h2>
                            <button onClick={() => setShowEditModal(false)} className="modal-close-button">X</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSaveJob}>
                                <div className="form-group">
                                    <label htmlFor="customerName">Customer Name:</label>
                                    <input
                                        type="text"
                                        id="customer_name"
                                        name="customer_name"
                                        placeholder='Customer Name'
                                        required
                                        value={editingJob?.customer_name || ''}
                                        onChange={(e) => setEditingJob({ ...editingJob, customer_name: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                
                                <div className="form-group">
                                    <label htmlFor="jobAddress">Address:</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        placeholder='Address'
                                        required
                                        value={editingJob?.address || ''}
                                        onChange={(e) => setEditingJob({ ...editingJob, address: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                
                                <div className="form-group">
                                    <label htmlFor="jobPhone">Phone:</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder='Phone'
                                        required
                                        value={editingJob?.phone || ''}
                                        onChange={(e) => setEditingJob({ ...editingJob, phone: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                
                                <div className="form-group">
                                    <label htmlFor="jobEmail">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder='Email'
                                        required
                                        value={editingJob?.email || ''}
                                        onChange={(e) => setEditingJob({ ...editingJob, email: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                
                                <div className="modal-actions">
                                    <button type="submit" className="btn-primary">Save Changes</button>
                                    <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showEstimateModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <form onSubmit={handleUploadEstimate}>
                            <div className="modal-header">
                                <h2>Add Estimate</h2>
                                <button onClick={() => setShowEstimateModal(false)} className="modal-close-button">×</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="estimatePdf" className="custom-file-upload">Upload PDF</label>
                                    <input type="file" id="estimatePdf" name="estimatePdf" onChange={handleFileChange} required accept="application/pdf" style={{ display: 'none' }} />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Upload Estimate</button>
                                <button type="button" onClick={() => setShowEstimateModal(false)} className="btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showAddPartModal && (
                <AddPartModal
                    isOpen={showAddPartModal}
                    onClose={handleCloseAddPartModal}
                    onAddPart={partActionType === 'necessary' ? handleAddPartToNecessary : handleAddPartToUsed}
                    API_BASE_URL={API_BASE_URL}
                    selectedJobId={selectedJobId}
                    partActionType={partActionType} // Make sure partActionType is defined in your parent component
                />
            )}
            {showDeleteJobModal && (
                <DeleteJobModal
                    showModal={showDeleteJobModal}
                    setShowModal={setShowDeleteJobModal}
                    jobId={selectedJobId}
                    fetchJobs={fetchJobs}
                    API_BASE_URL={API_BASE_URL}
                />
            )}
            {showRemoveEstimateModal && (
                <RemoveEstimateModal
                    showModal={showRemoveEstimateModal}
                    setShowModal={setShowRemoveEstimateModal}
                    jobId={selectedJobId}
                    fetchJobs={fetchJobs}
                    API_BASE_URL={API_BASE_URL}
                />
            )}
            {showMoveToUsedModal && (
                <ConfirmMoveToUsedModal
                    showModal={showMoveToUsedModal}
                    setShowModal={setShowMoveToUsedModal}
                    movePartToUsed={movePartToUsed}
                    partDetails={selectedPart}
                />
            )}
            {showUpdatePartModal && (
                <UpdatePartModal
                    showModal={showUpdatePartModal}
                    setShowModal={setShowUpdatePartModal}
                    part={editablePart}
                    updatePart={updatePart}
                />
            )}
            {showRemovePartModal && (
                <RemovePartModal
                    showModal={showRemovePartModal}
                    setShowModal={setShowRemovePartModal}
                    partId={selectedPartId}
                    removePart={handleRemoveNecessaryPart}
                />
            )}
            {showReturnModal && (
                <ReturnPartModal
                    showModal={showReturnModal}
                    setShowModal={setShowReturnModal}
                    part={returnPart}
                    returnPartToNecessary={handleReturnToNecessary}
                />
            )}
            {showRemoveUsedModal && (
                <RemoveUsedPartModal
                    showModal={showRemoveUsedModal}
                    setShowModal={setShowRemoveUsedModal}
                    part={selectedUsedPart}
                    onConfirm={confirmRemoveUsedPart}
                />
            )}
        </div>
    );
};

export default Customers;