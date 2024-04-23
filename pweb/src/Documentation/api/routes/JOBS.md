# Jobs Route Documentation

## Overview

This document describes the API routes associated with job management in a construction or similar field service management application. These routes facilitate creating, updating, fetching, and deleting job records and related estimates.

## Routes

### **GET `/` - Fetch All Jobs**

- **Functionality**: Retrieves all job records from the database.
- **Response**: Returns a list of all jobs, including formatted dates.

### **POST `/` - Create New Job**

- **Payload**: Requires details such as `customer_name`, `address`, `phone`, and `email`.
- **Functionality**: Adds a new job record to the database.
- **Response**: Returns the newly created job record with a success message.

### **GET `/:job_id` - Fetch Specific Job Details**

- **Parameters**: `job_id` - The unique identifier for the job.
- **Functionality**: Retrieves details of a specific job.
- **Response**: Returns job details if found; otherwise, returns an error message if the job does not exist.

### **PUT `/:job_id` - Update Job Details**

- **Parameters**: `job_id` - The unique identifier for the job.
- **Payload**: Requires updated `customer_name`, `address`, `phone`, and `email`.
- **Functionality**: Updates the specified job record in the database.
- **Response**: Returns the updated job record; if not found, returns an error.

### **DELETE `/:job_id` - Delete Job**

- **Parameters**: `job_id` - The unique identifier for the job.
- **Functionality**: Deletes the specified job record from the database.
- **Response**: Confirms deletion or returns an error if the job does not exist.

### **GET `/search` - Search Jobs**

- **Query Parameters**: `query` - A search term.
- **Functionality**: Performs a search across several fields (e.g., customer name, address) for matching job records.
- **Response**: Returns a list of jobs that match the search criteria.

### **POST `/upload-estimate` - Upload Job Estimate**

- **Middleware**: Uses `multer` for handling file uploads.
- **Payload**: Includes the file and `job_id`.
- **Functionality**: Uploads and stores a job estimate document (PDF).
- **Response**: Returns a success message with estimate details or an error for invalid files.

### **GET `/estimate/:job_id` - Fetch Estimate for a Job**

- **Parameters**: `job_id` - The unique identifier for the job.
- **Functionality**: Retrieves the estimate for a specific job.
- **Response**: Returns the estimate details or an error if no estimate is found.

### **POST `/necessary-parts` and other related routes**

- **Functionality**: Manages the necessary parts for jobs, including additions, updates, and removals.
- **Response**: Handles various scenarios such as adding new parts to a job, updating quantities, and removing parts. Ensures all responses include detailed messages regarding the action taken.

## Security and Performance

- **Middleware**: Uses `authorization` to ensure that only authenticated users can access the routes.
- **Error Handling**: Provides robust error handling to return appropriate status codes and messages based on the operation result.

## Database Interactions

- **Data Management**: Utilizes SQL queries to interact with the database for CRUD operations on jobs, estimates, and parts related to jobs.
- **Logging**: Optionally integrates with inventory action logging to record changes related to job parts.

## Additional Details

- **File Handling**: Uses `multer` for file management, including storage configurations and clean-up routines for non-valid uploads.
- **Transactional Integrity**: Implements transactional queries to ensure database consistency, especially in routes that involve multiple related operations.

This collection of routes is crucial for managing job-related workflows in applications geared towards service industries that require dynamic scheduling and resource management.
