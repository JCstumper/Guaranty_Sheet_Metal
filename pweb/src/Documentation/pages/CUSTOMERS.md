# Customers Component Documentation

## Overview

The `Customers` component is a key part of the application designed to manage customer jobs, including displaying job details, adding new jobs, editing existing jobs, and managing job-specific parts and estimates. It provides a user interface that integrates various functionalities through modals and dynamic content loading based on the job selected.

## Functionalities

- **Job Management**: View, add, edit, and delete jobs. Jobs are listed with essential details such as customer name, address, contact info, and the date created.
- **Part Management**: Manage necessary and used parts for each job. Includes adding new parts, editing existing parts, and transferring parts between necessary and used categories.
- **Estimate Management**: Add, view, and delete estimates for jobs. Includes uploading estimate documents and handling them through a modal interface.
- **Search and Filter**: Jobs can be filtered based on a search criteria that matches against customer names, addresses, and other job details.

## Features

### Job List Display

- Jobs are displayed in a table format with options for each job to view more details, edit, or delete the job.
- Selecting a job expands a detailed view where parts and estimates associated with that job are managed.

### Modals Used

- **Add Job Modal**: For adding a new job entry.
- **Edit Job Modal**: For modifying details of an existing job.
- **Add Estimate Modal**: For adding a new estimate to a job, including file uploads.
- **Add Part Modal**: For adding necessary or used parts to a job.

### Contextual Actions

- Depending on the selected job, parts can be added as either necessary for the job or used from inventory.
- Estimates can be viewed directly if available, or a message is displayed if not. Users can upload new estimates or delete existing ones.

## Context Integration

Utilizes `AppContext` to access the global `API_BASE_URL`, ensuring all API calls are centralized and managed through one configurable point.

## State Management

- **Local States**: Manage jobs, filtered jobs, selected job details, parts necessary and used for the job, modals visibility, and file selections for uploads.
- **Authentication and Permissions**: Uses passed `setAuth` function to handle authentication state based on user interactions and API responses.

## API Interactions

- **Fetch Jobs**: Jobs are fetched from an API endpoint, optionally filtered by search terms.
- **Fetch Parts**: Necessary and used parts for selected jobs are fetched separately.
- **Job Operations**: Adding, editing, and deleting jobs are handled through respective API endpoints.
- **Part Operations**: Adding to and editing parts in necessary and used categories are managed via API.
- **Estimate Operations**: Uploading, viewing, and deleting estimates involve API interactions to manage estimate files and their state.

## Error Handling

Implements robust error handling for API interactions, providing feedback for failed operations, such as fetch errors or issues during CRUD operations on jobs or parts.

## Accessibility

Ensures that all interactive elements are accessible and usable, providing keyboard navigability and proper focus management across all modals and form inputs.

## Usage

This component is used as part of the main application structure, typically accessible to authenticated users with permissions to manage customer jobs and related functionalities.

## Security Features

- Ensures that sensitive actions like adding or deleting jobs are protected and only accessible based on user authentication and appropriate permissions.
- Token validations are performed to secure API requests and manage session validity.

---

This documentation aims to provide a clear understanding of the `Customers` component's functionality, usage, and integration within the larger application framework, highlighting its role in managing customer jobs and related data efficiently.
