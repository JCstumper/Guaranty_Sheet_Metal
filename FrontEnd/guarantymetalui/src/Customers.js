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
    const [editingPart, setEditingPart] = useState(null); //State for tracking editing of Necessary parts
    const [editingUsedPart, setEditingUsedPart] = useState(null); // State for tracking editing of used parts
    const [editingJob, setEditingJob] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [totalNecessaryCost, setTotalNecessaryCost] = useState(0);
    const [totalUsedCost, setTotalUsedCost] = useState(0);
    const [partActionType, setPartActionType] = useState('necessary'); // 'necessary' or 'used'

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
            job.email.toLowerCase().includes(filter.toLowerCase())
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
        const endpoint = filter.trim() ? `${API_BASE_URL}/jobs/search?query=${encodeURIComponent(filter.trim())}` : `${API_BASE_URL}/jobs`;
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setJobs(data); // Make sure to update jobs state as well
            setFilteredJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };    
    
    const fetchNecessaryParts = async (jobId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/necessary-parts`);
            if (response.ok) {
                const partsData = await response.json();
                setNecessaryParts(partsData);
            } else if (response.status === 404) {
                console.log(`No necessary parts found for job ${jobId}`);
                setNecessaryParts([]); // Clear the necessary parts as none are found for this job
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching necessary parts:', error);
            setNecessaryParts([]); // Clear the necessary parts to handle any error
        }
    };
    
    const fetchUsedParts = async (jobId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/used-parts`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const partsData = await response.json();
            setUsedParts(partsData);
        } catch (error) {
            console.error('Error fetching used parts:', error);
        }
    };    
    const handleSelectJob = async (jobId) => {
        const isSameJob = selectedJobId === jobId;
        setSelectedJobId(isSameJob ? null : jobId);
    
        if (!isSameJob) {
            fetchNecessaryParts(jobId); // Fetch necessary parts for the selected job
            fetchUsedParts(jobId); // Fetch used parts for the selected job
            try {
                const response = await fetch(`${API_BASE_URL}/jobs/check-estimate/${jobId}`);
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
    const handleEditJob = (jobId) => {
        const jobToEdit = jobs.find(job => job.job_id === jobId);
        setEditingJob(jobToEdit); // Set the job to be edited
        setShowEditModal(true); // Show the edit modal
    };
    
    const handleSaveJob = async () => {
        const { job_id, ...updatedFields } = editingJob;
    
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${job_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields)
            });
    
            if (response.ok) {
                alert('Job updated successfully.');
                fetchJobs(); // Refresh the jobs list
                setShowEditModal(false); // Close the edit modal
            } else {
                throw new Error('Failed to update job.');
            }
        } catch (error) {
            console.error('Error updating job:', error);
            alert('Failed to update job. ' + error.message);
        }
    };
    
    const handleRemoveJob = async (jobId) => {
        if (window.confirm(`Are you sure you want to remove job ${jobId}?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                    method: 'DELETE',
                });
    
                if (response.ok) {
                    alert(`Job ${jobId} removed successfully.`);
                    fetchJobs(); // Re-fetch the jobs list to update the UI
                } else {
                    throw new Error(`Failed to remove job ${jobId}`);
                }
            } catch (error) {
                console.error('Error removing job:', error);
                alert('Failed to remove job. ' + error.message);
            }
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
        setPartActionType('necessary');
        setShowAddPartModal(true);
    };
    const handleAddPartToNecessary = async (addedPart) => {
        // Assuming addedPart is the part returned from the server with the necessary details
        setNecessaryParts(prevParts => [...prevParts, addedPart]);
        // Optionally refresh from server if needed
        await fetchNecessaryParts(selectedJobId);
    };
    const handleAddPartToUsed = async (addedPart) => {
        // Add the part to the used parts state
        setUsedParts(prevParts => [...prevParts, addedPart]);
        // Decrement the inventory (considering the added part's quantity)
        // Here, you should also make an API call to update the inventory in the backend
        // await updateInventory(addedPart.part_number, -addedPart.quantity_used);
        await fetchUsedParts(selectedJobId); // To refresh the used parts from the server
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
    const handleMoveToUsed = async (partId) => {
        const part = necessaryParts.find(p => p.id === partId);
        if (!part) {
            alert('Part not found');
            return;
        }
        if (parseInt(part.quantity_required, 10) <= 0) {
            alert('Cannot move to used as the quantity is 0');
            return;
        }
    
        const confirmMove = window.confirm(`Are you sure you want to move part ${part.part_number} to used?`);
        if (!confirmMove) return;
    
        const requestBody = {
            part_number: part.part_number,
            quantity_to_move: parseInt(part.quantity_required, 10) // Ensuring the quantity is an integer
        };
    
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/move-to-used`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
    
            if (response.ok) {
                const { actualQuantityMoved, message } = await response.json();
                alert(message); // Show the message from the backend
    
                // Update necessary parts in UI based on the actual quantity moved
                const remainingQuantity = parseInt(part.quantity_required, 10) - actualQuantityMoved;
                setNecessaryParts(necessaryParts.map(p => 
                    p.id === partId ? { ...p, quantity_required: remainingQuantity } : p
                ));
    
                // Update used parts in UI
                const existingUsedPart = usedParts.find(p => p.part_number === part.part_number);
                if (existingUsedPart) {
                    setUsedParts(usedParts.map(p => 
                        p.part_number === part.part_number
                            ? { ...p, quantity_used: p.quantity_used + actualQuantityMoved }
                            : p
                    ));
                } else {
                    setUsedParts([...usedParts, { ...part, quantity_used: actualQuantityMoved }]);
                }
    
                // Optionally, refresh the state from the server to ensure it is in sync
                fetchNecessaryParts(selectedJobId);
                fetchUsedParts(selectedJobId);
            } else if (response.status === 400) {
                const errorResponse = await response.json();
                alert(errorResponse.error); // Show a user-friendly error message
            } else {
                throw new Error(`Unhandled response status: ${response.status}`);
            }
        } catch (error) {
            alert('Failed to move part to used. Please try again.');
            console.error('Error moving part to used:', error);
        }
    };
    
    
    
    
    
    const handleEditNecessaryPart = (part) => {
        setEditingPart({...part, newQuantity: part.quantity_required});
    };    
    const saveEditedPart = async (part) => {
        const newQuantity = parseInt(part.newQuantity, 10);
    
        if (newQuantity < 0) {
            alert('Quantity cannot be negative.');
            return;
        }
    
        if (newQuantity === 0) {
            // If the quantity is 0, remove the part
            if (window.confirm("Quantity is 0. This will remove the part. Continue?")) {
                try {
                    const response = await fetch(`${API_BASE_URL}/jobs/necessary-parts/${part.id}`, {
                        method: 'DELETE'
                    });
    
                    if (response.ok) {
                        setNecessaryParts(necessaryParts.filter(p => p.id !== part.id));
                    } else {
                        throw new Error('Failed to remove necessary part');
                    }
                } catch (error) {
                    console.error('Error removing necessary part:', error);
                    alert('Failed to remove necessary part. ' + error.message);
                }
            }
        } else {
            // If the quantity is greater than 0, update the part
            try {
                const response = await fetch(`${API_BASE_URL}/jobs/necessary-parts/${part.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...part, quantity_required: newQuantity })
                });
    
                if (response.ok) {
                    const updatedParts = necessaryParts.map(p => 
                        p.id === part.id ? { ...p, quantity_required: newQuantity } : p
                    );
                    setNecessaryParts(updatedParts);
                    setEditingPart(null); // Reset editing part state
                } else {
                    throw new Error('Failed to update necessary part');
                }
            } catch (error) {
                console.error('Error updating necessary part:', error);
                alert('Failed to update necessary part. ' + error.message);
            }
        }
    };
    
    
      
    const handleRemoveNecessaryPart = async (partId) => {
        if (window.confirm("Are you sure you want to remove this part?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/jobs/necessary-parts/${partId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    setNecessaryParts(necessaryParts.filter(part => part.id !== partId));
                } else {
                    throw new Error('Failed to remove necessary part');
                }
            } catch (error) {
                console.error('Error removing necessary part:', error);
            }
        }
    };
    
    const handleAddUsedPart = () => {
        setPartActionType('used');
        setShowAddPartModal(true);
    };    
    
    const handleReturnToNecessary = async (partId) => {
        const part = usedParts.find(p => p.id === partId);
        if (!part) {
            alert('Part not found');
            return;
        }
    
        if (window.confirm(`Are you sure you want to return part ${part.part_number} to necessary?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/return-to-necessary`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ part_id: partId, quantity_used: part.quantity_used })
                });
    
                if (!response.ok) {
                    const errorResponse = await response.json();
                    alert(errorResponse.error);
                    return;
                }
    
                const data = await response.json();
                alert(data.message);
    
                // Update local state for UI
                const updatedUsedParts = usedParts.filter(p => p.id !== partId);
                setUsedParts(updatedUsedParts);
                
                // Optionally, refresh necessary parts from the server to get updated data
                fetchNecessaryParts(selectedJobId);
            } catch (error) {
                console.error('Error returning part to necessary:', error);
                alert('Failed to return part to necessary. ' + error.message);
            }
        }
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
            alert('Quantity cannot be negative.');
            return;
        }
    
        // Handle removing the part if the quantity is set to 0
        if (newQuantity === 0) {
            await handleRemoveUsedPart(part.id);
            return;
        }
    
        const quantityDiff = newQuantity - originalQuantity;
    
        // If increasing the quantity, check if enough inventory exists
        if (quantityDiff > 0) {
            const inventoryRes = await fetch(`${API_BASE_URL}/inventory/${part.part_number}`);
            if (!inventoryRes.ok) {
                alert('Error fetching inventory data.');
                return;
            }
            const inventoryData = await inventoryRes.json();
            if (inventoryData.quantity_in_stock < quantityDiff) {
                alert('Not enough inventory to increase used quantity.');
                return;
            }
        }
    
        // Proceed to update the used part
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/update-used-part`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    part_id: part.id,
                    new_quantity: newQuantity,
                    quantity_diff: quantityDiff
                })
            });
    
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
    
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
                alert(errorResponse.error);
            }
        } catch (error) {
            console.error('Error updating used part:', error);
            alert('Failed to update used part. ' + error.message);
        }
    };
    
    const handleRemoveUsedPart = async (partId) => {
        const part = usedParts.find(p => p.id === partId);
        if (!part) return;
    
        const confirmRemove = window.confirm(`Are you sure you want to remove part ${part.part_number} from used?`);
        if (!confirmRemove) return;
    
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/remove-from-used`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    part_number: part.part_number,
                    quantity_used: part.quantity_used
                })
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Network response was not ok: ' + errorText);
            }
    
            await response.json(); // Assuming the backend sends some confirmation message
            alert(`Part ${part.part_number} removed from used.`);
    
            // Update the UI by removing the part from the used parts list
            setUsedParts(usedParts.filter(p => p.id !== partId));
            
        } catch (error) {
            console.error('Error removing part from used:', error);
            alert('Failed to remove part from used. ' + error.message);
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
                                            <button onClick={() => handleEditJob(job.job_id)} className="edit-btn">Edit</button>
                                            <button onClick={() => handleRemoveJob(job.job_id)} className="remove-btn">Remove</button>
                                            </td>
                                        </tr>
                                        {selectedJobId === job.job_id && (
                                            <tr>
                                                <td colSpan="7">
                                                    <div className="job-details-expanded">
                                                        {/* Estimates Section */}
                                                        <div className="job-details-section">
                                                            <h4>Job Estimate</h4>
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
                                                                            <button onClick={() => handleRemoveNecessaryPart(part.id)} className="details-btn">Remove</button>
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
                                                                            <button onClick={() => handleReturnToNecessary(part.id)} className="details-btn">Return to Necessary</button>
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
            {showEditModal && (
                <div className="modalAddJob">
                    <div className="modalAddJob-content">
                        <div className="modalAddJob-header">
                            <h2>Edit Job</h2>
                            <button onClick={() => setShowEditModal(false)} className="close-modalAddJob">X</button>
                        </div>
                        <div className="modalAddJob-body">
                            <form onSubmit={handleSaveJob}>
                                <label htmlFor="customerName">Customer Name:</label>
                                <input
                                    type="text"
                                    id="customer_name"
                                    name="customer_name"
                                    placeholder='Customer Name'
                                    required
                                    value={editingJob?.customer_name || ''}
                                    onChange={(e) => setEditingJob({ ...editingJob, customer_name: e.target.value })}
                                />

                                <label htmlFor="jobAddress">Address:</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder='Address'
                                    required
                                    value={editingJob?.address || ''}
                                    onChange={(e) => setEditingJob({ ...editingJob, address: e.target.value })}
                                />

                                <label htmlFor="jobPhone">Phone:</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder='Phone'
                                    required
                                    value={editingJob?.phone || ''}
                                    onChange={(e) => setEditingJob({ ...editingJob, phone: e.target.value })}
                                />

                                <label htmlFor="jobEmail">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder='Email'
                                    required
                                    value={editingJob?.email || ''}
                                    onChange={(e) => setEditingJob({ ...editingJob, email: e.target.value })}
                                />

                                <div className="modalAddJob-footer">
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                    <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">Cancel</button>
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
                    onAddPart={partActionType === 'necessary' ? handleAddPartToNecessary : handleAddPartToUsed}
                    API_BASE_URL={API_BASE_URL}
                    selectedJobId={selectedJobId}
                    partActionType={partActionType} // Make sure partActionType is defined in your parent component
                />
            )}
        </div>
    );
};

export default Customers;