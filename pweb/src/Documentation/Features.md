# Guaranty Sheet Metal (GSM) Feature Guide

Welcome to the comprehensive feature guide for the Guaranty Sheet Metal Application. This document outlines the core functionalities and unique features that make GSM a powerful internal tool for tracking inventory, jobs, and customers.

## Table of Contents
1. [Real-Time Dashboard](#real-time-dashboard)
2. [Inventory Management](#inventory-management)
3. [Purchase Log Management](#purchase-log-management)
4. [Job Management](#job-management)
5. [Security and Audits](#security-and-audits)
6. [Topbar Navigation and User Management](#Topbar-Navigation-and-User-Management)

## Real-Time Dashboard
- **Persistent Tracking**: Instant updates ensure the dashboard reflects the latest entries—products, jobs, and customers.
- **User-Friendly Interface**: An intuitive layout provides a comprehensive view of business operations at a glance.
- **Dynamic Data Visualization**: Displays key metrics including the number of customers, purchases, and products, dynamically updated from the backend.
- **Component Design**:
  - **State Management**: Manages data state using `useState` and retrieves data from a backend API using `useEffect`.
  - **API Integration**: Fetches summary counts for customers, purchases, and products via an API endpoint, handling potential errors gracefully.
  - **UI Components**:
    - **Topbar**: Provides user authentication management and navigation for pages.
    - **BarCard**: A table that shows the user a quick look into the "Out of Stock" and "Low Inventory"

## Inventory Management
- **Alerts for Low and Out of Stock**: Automated notifications and visual indicators help manage stock levels.
- **Stock Management**: Real-time in-stock and out-of-stock statuses, with color-coded indicators for quick identification.
- **Inventory Modifications**: Flexible editing and secure deletion of inventory items, with changes reflected immediately across the system.
- **Manual Input and File Upload**: Supports both individual entry and bulk uploads via CSV or Excel files.
- **Detailed Feature Analysis**:
  - **State Management**: Manages an array of products and various UI state flags like modal visibility and selected items for editing or deletion.
  - **User Interactions**: Handles interactions such as sorting, filtering, and modal operations, enhancing user experience and operational efficiency.
  - **API Integration**: Integrates with backend services for fetching, updating, and deleting inventory data, ensuring data consistency and real-time updates.
  - **Dynamic Filtering**: Implements filtering based on multiple criteria that dynamically adjust as inventory data changes.
  - **Modals and Editing Forms**: Utilizes modals for adding, editing, and deleting inventory items, providing a seamless user interface without page reloads.
  - **Notifications**: Uses toast notifications to provide feedback on user actions, such as successful updates or errors during data manipulation.

## Purchase Log Management
- **Creation and Tracking**: Users can enter new purchases, with each log updated in real-time and detailed for better management.
- **Editing and Removing Entries**: Inline editing and secure deletion with confirmation prompts, and all actions logged for compliance.

## Job Management
- **Creating and Managing Jobs**: Detailed data entry for new jobs and easy editing of existing jobs.
- **Filtering and Searching**: Customizable filters and a dedicated search bar improve the management of numerous job entries.
- **Dynamic Part Management**: Manages necessary and used parts for each job, with options to add, move, edit, and delete parts.
- **Estimate Management**:
  - **Viewing and Adding Estimates**: Provides functionality to upload, view, and delete job estimates directly within the job details.
  - **File Handling**: Supports file operations such as uploading and deleting estimate files, enhancing document management capabilities.
- **Comprehensive Job Editing and Deletion**:
  - **Modal Driven Interface**: Uses modals for adding new jobs, editing job details, and confirming deletions, ensuring a smooth user interface.
  - **Real-Time Updates**: Reflects changes immediately across the system without the need for page reloads.
- **Cost Calculation**:
  - **Automatic Cost Updates**: Calculates total costs for necessary and used parts dynamically as part data changes.
- **Advanced Part Handling**:
  - **Add Parts**: Allows addition of parts to a job, distinguishing between necessary and used parts.
  - **Edit and Delete Parts**: Facilitates editing part details like quantity and price, with modal confirmations for deletions to prevent accidental data loss.
  - **Move Parts Between Categories**: Provides functionality to move parts from necessary to used, updating inventory statuses accordingly.
  - **Return Parts to Inventory**: Enables returning used parts to the necessary list, helping manage inventory effectively.
- **Interactive Job Details**:
  - **Expandable Job Information**: Displays detailed information for each job, including associated parts and estimates, with an option to expand for more details.
  - **Integrated Part Actions**: Integrates actions like moving, editing, and deleting directly within the job details view for streamlined operations.
- **Error Handling and Notifications**:
  - **Robust Error Management**: Implements error handling during API interactions, providing feedback through toast notifications for a better user experience.


## Security and Audits
- **Logs**: Detailed activity logs with user identification and timestamps help track actions and ensure accountability.
- **Access Controls**: Admin-only access to sensitive data, with comprehensive logging supporting compliance and audit readiness.
- **Interactive Log Viewing**:
  - **Dynamic Data Fetching**: Retrieves inventory logs from the backend API and displays them, with error handling to notify users of issues during data fetching.
  - **Log Filtering**: Users can filter logs by action type or username, making it easier to find specific entries.
  - **Modal-Driven Filter Application**: Utilizes a modal to input filter criteria, enhancing user experience by providing a focused environment for log filtration.
  - **Table Presentation**: Logs are presented in a table format, with detailed breakdowns such as action type, username, log type, change details, and timestamp.
  - **Change Detail Parsing**: Automatically parses and formats the change details from logs to provide clear and actionable insights.
- **Filter Management**:
  - **Filter Options**: Offers filtering by user and action type through an interactive modal, with options to apply or reset filters as needed.
  - **Immediate Feedback**: Applies filters immediately upon user confirmation, updating the displayed logs to reflect filtered results.

This extended functionality enriches the audit capabilities of the GSM system, providing administrators with powerful tools to monitor and review user actions and system changes efficiently.


## Topbar Navigation and User Management

- **Dynamic User Interface**: The topbar includes interactive icons and links for navigation between different sections of the application such as Dashboard, Inventory, Purchases, Jobs, and Logs. The visibility of certain options is dependent on user roles, enhancing security and user experience.
- **Responsive Design**: Incorporates a hamburger menu for smaller screens, ensuring the navigation is adaptable and accessible on various devices.
- **Profile Management**:
  - **User Information Display**: Shows the logged-in user's name and provides a dropdown menu for additional user actions.
  - **Edit Profile**: Allows users to update their username, password, and email directly from the topbar.
  - **Logout Functionality**: Includes a confirmation dialog for logging out, improving security and user experience.
- **Role-Based Access**:
  - **Conditional Rendering**: Displays navigation options and user actions based on the user's role. Admin users have additional capabilities such as managing users and adding new users.
- **Real-Time Feedback**:
  - **Loading Indicators**: Displays a loading screen during operations that require waiting, such as logging out or loading user data.
  - **Notifications**: Utilizes toast notifications to provide immediate feedback on the success or failure of user actions, like profile updates or logging out.
- **User Interaction**:
  - **Interactive Dropdowns**: Dropdown menus are used for detailed user actions like editing profiles and managing users, enhancing the interaction without leaving the current page.
  - **Modals for User Actions**: Uses modals for actions such as adding a new user, editing profiles, and managing users, which centralize and streamline interactions within the application.
- **Token Management**:
  - **Session Validation**: Checks for token expiration periodically to manage session validity and automatically logs out the user if the token is expired, enhancing security.
  - **Profile and Role Updates**: Fetches and updates user profile and role information upon successful login and during session refresh, ensuring the UI reflects current permissions and user details.

This enhanced Topbar functionality provides a central hub for navigation and user management within the GSM system, offering both administrators and general users a seamless and integrated experience across various modules of the application.

