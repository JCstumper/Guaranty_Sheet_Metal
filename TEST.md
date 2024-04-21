# Testing Documentation

## Overview
This document outlines the testing strategy implemented for our project using Cypress, an end-to-end testing framework. The tests are designed to automate the validation of various functionalities within our application, ensuring that all features perform as expected before deployment.

## Test Plan
The test suite includes multiple scenarios covering different parts of the application:

- **User Authentication**: Tests for login, logout, and session management.
- **User Management**: Tests for adding, editing, and deleting users.
- **Profile Management**: Tests to edit user profiles and manage user-specific settings.
- **Inventory Management**: Tests for adding, editing, filtering, and deleting inventory items.

## Reasoning Behind the Test Plan
The tests are constructed to simulate user interactions with the application, from initial setup to daily operations. This approach is chosen because:

- **Realistic Scenarios**: By simulating real-world usage, we can uncover functional and integration issues that might not be apparent during manual testing.
- **Repeatability**: Automated tests can be run any number of times, ensuring consistent results without additional effort.
- **Regression Testing**: Any future changes to the application can be validated against the established test cases to ensure no new bugs are introduced.

## Test Descriptions

### Initial Setup
- **Initial Setup Test**: Ensures that the first-time setup process for new users works as intended. This is crucial for onboarding new users without manual intervention.

### Authentication
- **Login and Logout Tests**: Validate that the authentication process handles both valid and invalid credentials correctly and that sessions are appropriately managed.

### User Management
- **Add and Remove User Tests**: Ensure that only authorized users can add or remove users from the system, reflecting changes immediately across the application.

### Profile Management
- **Edit Profile Test**: Checks the functionality to update user details such as usernames and passwords, crucial for maintaining user account security.

### Inventory Management
- **Add/Edit/Delete Inventory Items**: Tests the core functionalities of inventory management, which is a critical component of the application, especially for businesses relying on precise stock tracking.

## User Acceptance Testing (UAT)

User Acceptance Testing is the final stage before deployment where real-world scenarios are used to ensure the application meets business needs and user expectations.

### UAT Test Scenarios

#### 1. Initial User Setup
- **Goal**: Ensure the first-time setup is handled correctly.
- **Steps**:
    - Navigate to the homepage.
    - Click the "Initial Setup" button.
    - Fill in the registration form:
        - Username: `admin`
        - Password: `Admin123!`
        - Confirm Password: `Admin123!`
        - Email: `admin@gmail.com`
    - Click the submit button.
- **Verify**:
    - Confirm that after submission, a success message appears and the user is redirected to the login screen.
    - Check that the "Login" button is now visible, indicating the setup was successful.

#### 2. Login Functionality
- **Goal**: Test the login system's response to correct and incorrect credentials.

    #### 2.1 Login with Valid Credentials
    - **Steps**:
        - Navigate to the login page.
        - Enter Username: `admin`
        - Enter Password: `Admin123!`
        - Click the "Login" button.
    - **Verify**:
        - Ensure the dashboard or main user interface loads with a welcome message "Login Successful!"

    #### 2.2 Login with Incorrect Password
    - **Steps**:
        - Navigate to the login page.
        - Enter Username: `admin`
        - Enter Password: `dog`
        - Click the "Login" button.
    - **Verify**:
        - Confirm an error message "Username or Password is incorrect" appears.

    #### 2.3 Login with Incorrect Username
    - **Steps**:
        - Navigate to the login page.
        - Enter Username: `dog`
        - Enter Password: `Test123!`
        - Click the "Login" button.
    - **Verify**:
        - Check for an error message indicating the login failure.


#### 3. Logout Functionality
- **Goal**: Verify that the logout function terminates user sessions effectively.
- **Steps**:
    - Log in as described above.
    - Navigate to the username or account icon and click it.
    - Select "Logout" and confirm the logout on the popup dialog by clicking the "Log Out" button.
- **Verify**:
    - Ensure that you are redirected to the login page.
    - Optionally, attempt to navigate back to see if the session has truly ended, which should not be possible.

#### 4. User Management
- **Goal**: Test the admin's capability to manage user accounts, including adding, editing, and deleting users.

    #### 4.1 Add a User
    - **Steps**:
        - Log in as an admin.
        - Navigate to the user management section via the main dashboard by selecting "Manage Users" from the dropdown menu after clicking the username.
        - Click the "Add a User" button to open the user registration form.
        - Fill out the form with the following details:
            - Username: `testuser`
            - Password: `TestPassword123!`
            - Email: `test@gmail.com`
            - Select the role "Employee" from the dropdown menu.
        - Click the "Register" button to submit the form.
    - **Verify**:
        - Confirm that a "Registration successful" message appears on the screen.
        - Search for `testuser` in the user list to ensure the account has been added.

    #### 4.2 Change User Role
    - **Steps**:
        - Navigate to the user management section via the main dashboard by selecting "Manage Users" from the dropdown menu after clicking the username.
        - In the user list, find `testuser`.
        - Click on the user to view details.
        - Locate the role section and click the edit icon next to the current role.
        - Select a new role from the dropdown menu, e.g., "Admin".
        - Confirm the role change by clicking the "Save Changes" button.
    - **Verify**:
        - Check that a confirmation message "Role updated successfully" appears.
        - Revisit the user's details to verify the role has been updated to "Administrator".

    #### 4.3 Delete a User
    - **Steps**:
        - Navigate to the user management section via the main dashboard by selecting "Manage Users" from the dropdown menu after clicking the username.
        - Find `testuser` in the user list.
        - Click the "Delete" button next to the user’s name.
        - A confirmation dialog appears; confirm the deletion by clicking the "Confirm" button.
    - **Verify**:
        - Ensure a "User deleted successfully" message appears.
        - Search for `testuser` to confirm that the user is no longer listed in the user management system.


#### 5. Profile Management
- **Goal**: Ensure users can update their profile information correctly.
- **Steps**:
    - Log in and navigate to the profile or account settings.
    - Click "Edit Profile" and update the following fields:
        - Username: `admin`
        - Password: `Admin123!`
        - Email: `admintest@gmail.com`
    - Click the "Save Changes" button.
- **Verify**:
    - Confirm a success notification "Profile updated successfully."
    - Re-open the edit profile view to ensure all changes are accurately reflected.

#### 6. Inventory Management
- **Goal**: Confirm that inventory management functions (add, edit, delete) work as expected.

    #### 6.1 Add Inventory Item
    - **Steps**:
        - Navigate to the inventory section after logging in.
        - Click "Add Inventory" and fill in the product details:
            - **Supplier Part Number**: `SUP-54321`
            - **Radius Size**: `5`
            - **Material Type**: `Metal`
            - **Color**: `Blue`
            - **Description**: `This is a test product description`
            - **Type**: `Widget`
            - **Catalog Code**: `WGT` (if not previously set)
            - **Item Type**: `length`
            - **Quantity of Item**: `20`
            - **Price**: `$3.48`
        - Click "Add Item" to submit.
    - **Verify**:
        - Ensure a confirmation message "Item added successfully" is displayed.
        - Search for the new item in the inventory list to verify its presence.

    #### 6.2 Edit Inventory Item
    - **Steps**:
        - Navigate to the inventory section and select the item added previously.
        - Click "Edit" and change any detail (e.g., change Price to `$50`, Material Type to `Alloy`).
        - Submit the changes.
    - **Verify**:
        - Confirm that changes are reflected in the inventory list (e.g., price and material type are updated).

    #### 6.3 Delete Inventory Item
    - **Steps**:
        - Navigate to the inventory section and select the edited item.
        - Click "Delete" and confirm the deletion in the popup dialog.
    - **Verify**:
        - Ensure a confirmation message "Item deleted successfully" is displayed.
        - Verify that the item is no longer present in the inventory list.


#### 7. Order Processing
- **Goal**: Test the order processing system for accuracy and efficiency.
- **Steps**:
    - Navigate to the orders section and click "Create Order."
    - Add items to the order, specify quantities, and submit the order.
- **Verify**:
    - Confirm that the order appears in the order management system with correct details.
    - Modify the order by changing quantities or adding/removing items, then update the order.
- **Verify**:
    - Check that the modifications are accurately reflected in the system.
    - Finalize the order and mark it as "Shipped."
- **Verify**:
    - Ensure the status update is displayed and accurate according to the changes made.

#### 8. Logging Activities
- **Goal**: Verify that all user-related actions are correctly logged in the system.

    #### 8.1 Logging New User Addition
    - **Steps**:
        - Log in as an admin.
        - Navigate to the user management section.
        - Click "Add a User" and enter the following details in the form:
            - Username: `newUser123`
            - Password: `newPassword123!`
            - Email: `newUser123@gmail.com`
        - Click "Register" to submit the form.
        - Navigate to the "Logs" section of the application.
    - **Verify**:
        - Confirm that a log entry is visible for the addition of the new user.
        - The log should detail the username, email, and assigned role, displaying a message such as "Added User to Application Whitelist username: newUser123 email: newUser123@gmail.com role: employee."
        - Ensure that the log entry specifies the action was successful with visible identifiers like "Add User" and "Added User."

    #### 8.2 Logging User Profile Updates
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the profile editing section by selecting a user profile.
        - Update the user profile with new details:
            - Username: `brandNewUser`
            - Password: `brandNewUser123!`
            - Email: `brandNewUser123@gmail.com`
        - Click "Save Changes" to update the profile.
        - Navigate to the "Logs" section to check for the update record.
    - **Verify**:
        - Look for a log entry indicating the profile update.
        - Verify the log shows a detailed message like "Profile updated successfully" and includes details such as "Update Profile."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

### UAT Execution
- **Participants**: Include real users, business stakeholders, and IT support staff.
- **Feedback Collection**: Use surveys, interviews, and observation to gather comprehensive feedback.
- **Documentation**: Record all test results and feedback for review and action.


The results from UAT will guide the final adjustments before deployment, ensuring the application meets all user requirements and performs optimally in real-world scenarios. This comprehensive approach ensures a robust and user-friendly product.


## Conclusion
The tests were designed to be comprehensive yet manageable for developers to maintain. By targeting the most critical areas of the application, we ensure a robust product that meets the functional requirements and delivers a smooth user experience.
