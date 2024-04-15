# AddPartModal Component Documentation

## Overview

`AddPartModal` is a React component designed to enhance the user experience by providing a modal interface for searching and adding parts to jobs within the application. It supports two distinct functionalities—adding necessary parts or used parts to a job, depending on the operation context specified by the `partActionType` prop.

## Props

- **`isOpen`**: Controls the visibility of the modal. When true, the modal is displayed.
- **`onClose`**: Function triggered to close the modal. Typically called from a close button inside the modal.
- **`onAddPart`**: Callback invoked when a part is successfully added. It updates the parent component's state with the new part details.
- **`API_BASE_URL`**: Base URL for constructing API requests to fetch or add parts.
- **`selectedJobId`**: Identifier for the job to which parts are being added. This is critical for constructing the API request payload.
- **`partActionType`**: Determines the type of part addition operation ('necessary' or 'used'), influencing the API endpoint and behavior during the addition process.

## State Management

- **`searchTerm`**: Holds the value entered in the search input, used for querying the API to fetch parts.
- **`searchResults`**: Contains an array of parts that match the search criteria. These parts are rendered in the modal for the user to select and add to the job.
- **`error`**: Stores error messages to display in the modal. Errors might arise from API fetch failures or issues during the part addition process.

## Functional Overview

### Debounced Search

The component integrates a debounced search mechanism that optimizes performance and reduces unnecessary API calls. As users type their search queries, API requests are delayed until typing has paused, minimizing load and improving responsiveness.

### Dynamic API Interaction

Depending on the `partActionType`, the component dynamically adjusts its API requests to cater to different part addition needs—whether adding parts that are necessary for a job or those that have already been used. This flexibility is achieved by modifying the API endpoint and adjusting the request payload according to the operation context.

### Error Handling

User-friendly error handling is built into the component to provide immediate feedback about operational issues, such as unsuccessful API requests or failures in adding a part. This feedback is crucial for maintaining a smooth user experience and for troubleshooting.

## User Interaction

- **Modal Interaction**: The modal is interacted with through various elements like the search input, part selection, and action buttons.
- **Part Search and Selection**: Users can search for parts using a dedicated input field. Search results are presented in a table format, allowing users to select and add desired parts directly to the job.
- **Closing the Modal**: Users can close the modal either after completing a part addition or by using a close (X) button, which triggers the `onClose` function.

## Accessibility Considerations

The modal supports various accessibility features, including keyboard navigation and focus management, ensuring that all interactive elements are accessible using keyboard commands and that focus is appropriately managed across these elements for users relying on assistive technologies.

---

This documentation provides a detailed look at the `AddPartModal` component, outlining its purpose, functionalities, and how it integrates into larger application workflows, offering a robust solution for managing parts within jobs.
