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
#### Initial Setup Test:
- **Visibility and Interaction**:
  - Ensure the "Initial Setup" button is visible and functional.
  - Check that clicking the "Initial Setup" button displays the setup modal.

- **Form Validation**:
  - Validate that form fields for username, password, confirm password, and email are visible and can be interacted with.
  - Test the form input by filling in the username, password, confirm password, and email fields.

- **Form Submission**:
  - Submit the setup form and verify that it processes the input without errors.
  - Confirm that after successful form submission, the user is redirected to the login screen, indicating the setup is complete.

This test verifies the initial setup process for new users, ensuring a seamless onboarding experience without requiring manual intervention.

### Authentication
#### Setup and Test Cases:
- **Page Opening**:
  - Open the login page directly using a specific URL to ensure it loads correctly.

- **Preparation for Testing**:
  - Intercept authentication checks to simulate non-authenticated states.
  - Navigate to the application's login page for each test case.

#### Login Tests:
- **Successful Login with Admin Credentials**:
  - Input the username 'admin' and the correct password.
  - Click the login button and verify that a 'Login Successful!' message is displayed.

- **Failed Login with Incorrect Password**:
  - Input the username 'admin' and an incorrect password.
  - Attempt to log in and verify that an error message 'Username or Password is incorrect' appears.

- **Failed Login with Incorrect Username**:
  - Input an incorrect username and a correct password.
  - Attempt to log in and verify that an error message 'Username or Password is incorrect' is displayed.

These tests validate that the authentication process handles both valid and invalid credentials correctly and that the system appropriately manages login sessions, providing clear feedback for both successful logins and login errors.

#### Logout Tests:
- **Setup for Logout Tests**:
  - Set the viewport size and intercept authentication states to manage user login sessions.
  - Navigate to the application's homepage and log in using admin credentials.
  - Confirm the successful login and close any pop-up notifications.

#### Test Cases:
- **Successful Logout**:
  - Navigate to the logout option by clicking on the username.
  - Initiate the logout process by selecting 'Logout' and then confirming by clicking 'Log Out'.
  - Verify successful logout from the application, ensuring the user is directed to the login or home page.

- **Cancel Logout**:
  - Start the logout process by clicking on the username and selecting 'Logout'.
  - Choose to cancel the logout by clicking 'Cancel' during the logout confirmation.
  - Confirm that the user remains logged in and is redirected back to the application, such as the 'Stock Level Dashboard', indicating the cancellation was successful.

These tests ensure that the application handles session management correctly, providing users with the ability to securely log out and confirm their actions, or to cancel logout if chosen.


### User Management
#### Add User Test:
- **Setup and Authentication**:
  - Verify that the viewport is set correctly and the application intercepts authentication as unauthenticated.
  - Navigate to the application's homepage.
  - Authenticate using admin credentials and ensure the login is successful.

- **Adding a User**:
  - Navigate to the user management section by clicking the username and then the 'Add a User' button.
  - Clear and fill in the username, password, and email fields for the new user.
  - Submit the registration form.
  - Confirm that a success message 'Registration successful' is visible.

This test ensures that only authorized users (e.g., admins) can add new users to the system and that the user addition process is functioning correctly, reflecting immediate changes across the application.

#### Manage Users Tests:
- **Change User Role**:
  - Navigate to the user management section by clicking on the username then 'Manage Users'.
  - Locate the user 'testuser' and change their role from employee to admin using a dropdown menu within their user details.
  - Submit the changes and verify a success notification, 'Changes saved successfully'.
  - Optionally, recheck to ensure the role change persisted by revisiting the user management section.

- **Remove User**:
  - Again navigate to 'Manage Users' and find the user 'testuser'.
  - Initiate the user removal process by clicking 'Remove' and confirm the deletion in a confirmation modal.
  - Confirm that a success notification, 'User successfully removed', appears and verify that the user no longer exists in the user list.

These tests ensure that the system admin can effectively manage user roles and remove users when necessary, reflecting changes immediately and accurately within the application.

### Profile Management
#### Edit Profile Test:
- **Preparation and Authentication**:
  - Set the viewport size for correct display.
  - Intercept and handle authentication states as unauthenticated.
  - Navigate to the application's login page and login using admin credentials.
  - Ensure the login is acknowledged with a 'Login Successful!' message and dismiss any notifications.

- **Successful Profile Edit**:
  - Access the profile edit function by clicking on the username and selecting 'Edit Profile'.
  - Clear existing data and input new values for username, password, and email.
  - Submit the changes and confirm that the profile update is successful.
  - Verify the changes are saved by checking for user acknowledgment (like visibility of updated username).

- **Cancel Profile Edit**:
  - Repeat the login and navigation steps to reach the profile edit interface.
  - Initiate editing but cancel the process using the 'Cancel' button.
  - Confirm that the action returns you to a safe state, such as the 'Stock Level Dashboard', ensuring no changes were made.

This series of tests ensures the functionality to update user details such as usernames and passwords is operational, crucial for maintaining user account security and managing personal data effectively.

### Inventory Management
#### General Setup:
- **Authentication and Navigation**:
  - Set the viewport size and intercept authentication to simulate an admin logging in.
  - Navigate to the application's homepage and perform login with admin credentials.
  - Ensure the login process is successful and dismiss any notifications.

#### Manage Inventory Tests:
- **Navigate to Inventory**:
  - Access the inventory section by clicking on 'INVENTORY'.

- **Add Product**:
  - Navigate to the 'Add Item' interface within the inventory section.
  - Fill in the details for the new product including auto-generating a part number, specifying supplier part number, size, material type, color, description, category, item type, quantity, and price.
  - Submit the form and verify that the product is added successfully with a confirmation message.

- **Edit Product**:
  - Navigate to a specific product's details by clicking on its identifier.
  - Click the 'Edit' button and update the product details such as supplier part number, size, material, color, description, category, item type, quantity, and price.
  - Submit the changes and confirm the product is updated successfully with a confirmation message.

- **Filter Products by Text**:
  - Use the search function in the inventory section to filter products by specific identifiers.
  - Verify that the search correctly filters and displays only the relevant product entries.

- **Filter Products by Checkbox**:
  - Use checkbox filters to select specific product attributes like size.
  - Confirm that the inventory list updates to display only the products that match the selected attributes.

- **Edit Product Quantity**:
  - Navigate to a specific product and select 'Edit Quantity'.
  - Update the quantity in the modal and submit the changes.
  - Verify that the quantity update is successful with a confirmation message.

- **Cancel Product Deletion**:
  - Initiate the deletion of a product but cancel the action.
  - Confirm that the product remains in the inventory and is not deleted.

- **Delete Product**:
  - Confirm the deletion of a product by navigating to the product details and confirming the deletion action.
  - Verify that the product is removed from the inventory with a successful deletion confirmation message.

These tests validate the core functionalities of the inventory management system, essential for businesses that rely on precise tracking and management of stock levels. They ensure that the system can handle additions, updates, and deletions of inventory items effectively, including the ability to filter and search inventory accurately.

### Purchases Management
#### General Setup:
- **Preparation for Tests**:
  - Set the viewport size and intercept authentication to simulate an admin login.
  - Navigate to the application's homepage and log in using admin credentials.
  - Ensure the login process is successful.

#### Purchases and Inventory Management Tests:
- **Add Products to Inventory**:
  - Navigate to the inventory section and add multiple products with detailed specifications like part number, size, material, color, description, type, and price.
  - Confirm that each product is added successfully with a confirmation message.

- **Edit Product Quantities**:
  - Navigate to specific products and edit their stock quantities.
  - Update the quantities and confirm the updates are successful with a confirmation message.

- **Manage Purchases**:
  - Navigate to the purchases section and initiate adding a new order by filling out details like supplier name and invoice date.
  - Confirm the creation of the order and expand it to view details.

- **Add Items to Order from Low and Out of Stock**:
  - For items low or out of stock, add them to the order and confirm that the additions are processed correctly.
  - Optionally, verify that the count of items in the low and out-of-stock sections decreases.

- **Remove Items from the Order**:
  - Remove items from the order and confirm that the count of items decreases, indicating successful removal.

- **Add All Items from Out of Stock to the Order**:
  - Add all out-of-stock items to an order and verify that they appear in the new order section.

- **Update Order Status**:
  - Mark the order as 'Generated' and then as 'Received', verifying that each status update is acknowledged with a success message.

- **Add Shipping Costs**:
  - Add shipping costs to an order using a modal and confirm the update with a success message indicating the total cost update.

These test cases ensure that the application can effectively manage purchases, from adding and editing inventory items to managing purchase orders and updating their statuses and details.

### Job Management
#### General Setup:
- **Authentication and Navigation**:
  - Set viewport size to ensure the application displays correctly.
  - Intercept authentication requests and simulate an admin login.
  - Navigate to the application's homepage and perform login using admin credentials.
  - Ensure the login process is successful and dismiss any notifications.

#### Job Management Tests:
- **Navigate to Jobs Section**:
  - Access the jobs section by clicking on 'JOBS'.

- **Add Job**:
  - Navigate to job addition interface and fill in details such as customer name, address, phone, and email.
  - Submit the form and confirm that the job is added successfully.

- **Edit Job**:
  - Find a job entry, initiate editing, update details like customer name, address, phone, and email.
  - Submit changes and confirm that the job details are updated successfully.

- **Delete Job**:
  - Initiate deletion of a job and confirm the action to ensure the job is removed from the system.
  - Cancel a deletion action to confirm no changes are made if the user decides against deletion.

- **Filter Jobs**:
  - Use the search function to filter jobs by specific input like customer name.
  - Verify that the search correctly filters and displays only the relevant job entries.

- **Add and Manage Parts**:
  - Add parts to a job, including necessary and used parts, by navigating to the job details and using the part addition interfaces.
  - Edit part quantities in both necessary and used sections, confirm updates.
  - Move parts between necessary and used sections and vice versa, confirm each action with success messages.
  - Remove parts from necessary and used sections, ensuring each part is correctly removed with confirmation.

- **Job Estimates**:
  - Add an estimate to a job and cancel the addition to ensure no changes are made if not confirmed.

These tests validate the functionalities involved in managing jobs within the application, from basic job management tasks like adding and deleting jobs, to more complex functions such as managing parts associated with jobs and handling job estimates.

### Logs Verification
#### General Setup:
- **Preparation for Tests**:
  - Set the viewport size and intercept authentication to simulate an admin login.
  - Navigate to the application's homepage and log in using admin credentials.
  - Ensure the login process is successful and clear any notifications.

#### Test Cases:
- **Add New User and Verify Logs**:
  - Add a new user with username, password, and email.
  - Verify the success of the registration and navigate to the logs page.
  - Confirm that the action of adding the new user is logged correctly.

- **Update User Information and Verify Logs**:
  - Edit an existing user profile with new details.
  - Save changes and navigate to the logs page.
  - Check that the update action is logged, showing the new and old details.

- **Add Product and Verify Logs**:
  - Add a new inventory item with detailed specifications.
  - After successful addition, navigate to the logs page.
  - Ensure that the addition of the new product is properly recorded in the logs.

- **Add Job and Verify Logs**:
  - Create a new job with customer details.
  - Navigate to the logs page after adding the job.
  - Verify that the job addition is logged, including all relevant details.

- **Add Necessary Part to Job and Verify Logs**:
  - Add a necessary part to a job.
  - Navigate to the logs page and confirm that the addition is logged.

- **Move Part from Necessary to Used and Verify Logs**:
  - Transfer a part from the necessary to used section within a job.
  - Check the logs page to ensure the move is logged with specifics on the part and quantity moved.

- **Return Part from Used to Necessary and Verify Logs**:
  - Return a part from used back to necessary.
  - Navigate to the logs and check for correct logging of this action.

- **Delete Job and Verify Logs**:
  - Remove a job from the system.
  - Go to the logs page and confirm that the deletion, along with all job details, is recorded.

- **Edit and Delete Product Actions and Verify in Logs**:
  - Perform edits and deletions on inventory items.
  - After each action, navigate to the logs page and confirm that each action is appropriately logged with detailed changes and specifications.

These test cases ensure that all significant actions within the application—ranging from user management to inventory adjustments—are properly logged, facilitating audit trails and system monitoring.

### Navigation Tests
#### General Setup:
- **Preparation for Tests**:
  - Set the viewport size and intercept authentication to simulate an admin login.
  - Navigate to the application's homepage and log in using admin credentials.
  - Ensure the login process is successful.

#### Navigation Test Cases:
- **Navigate to Inventory**:
  - Use the topbar to navigate to the inventory section.
  - Confirm the visibility of the inventory table title to verify successful navigation.

- **Navigate to Purchases**:
  - Click the purchases button in the topbar.
  - Verify that the orders table title appears, confirming correct navigation.

- **Navigate to Jobs**:
  - Access the jobs section through the topbar.
  - Ensure the jobs table title is visible, indicating successful navigation.

- **Navigate to Logs**:
  - Wait a set period (for possible delayed access or loading) and then navigate to the logs.
  - Check for the visibility of the inventory logs table title to confirm successful access.

- **Navigate to Dashboard**:
  - Click on the dashboard button in the topbar.
  - Confirm that the 'Stock Level Dashboard' content is visible, verifying successful navigation.

- **Comprehensive Navigation Test**:
  - Sequentially navigate between all sections mentioned (Inventory, Purchases, Jobs, Logs, and Dashboard) using the topbar.
  - Confirm the correct display for each section upon navigation, ensuring the topbar functions correctly across different parts of the application.

These tests ensure that the topbar navigation is functioning correctly, allowing users to switch between various sections of the application efficiently and effectively.


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
- **Goal**: To validate the functionality and accuracy of the order processing system, ensuring it manages inventory, order creation, modification, and status updates correctly.
- **Preparation**:
    - Log in with administrative credentials and navigate to the order management section after successful authentication.
- **Steps**:
    - **Create an Order**: Navigate to the "PURCHASES" section and use the "Add Order" button to create a new order with specified supplier details and invoice date.
    - **Add Items to the Order**: From the low inventory and out of stock sections, add items to the order, verifying that items are correctly added to the new order section.
    - **Modify the Order**: Change the quantity of items already in the order and remove items, ensuring the order reflects these changes accurately.
    - **Finalize the Order**: Mark the order as "Generated" and then as "Received", confirming the status updates are visible and correct.
- **Verification**:
    - Confirm that all actions—addition, modification, removal of items—are reflected in the order details.
    - Verify that the order status updates (Generated and Received) are correctly displayed along with any associated messages confirming the actions taken.
    - Check the total order cost updates when shipping costs are added, ensuring the new total is accurately displayed.


#### 8. Job Management
- **Goal**: To ensure the Job Management system effectively handles all functionalities related to job records, including adding, editing, removing jobs, managing job estimates, and managing parts associated with jobs.

	#### 8.1 Add Job
	- **Steps**:
		- Navigate to the "Jobs" section.
		- Click the "+ Add Job" button.
		- Enter valid job details such as customer name, address, phone, and email.
		- Submit the job addition form.
	- **Verify**:
		- Ensure a success message appears indicating the job was added.
		- Confirm the job is listed in the job management system.

	#### 8.2 Edit Job
	- **Steps**:
		- Locate an existing job in the "Jobs" section.
		- Click the "Edit" button for the selected job.
		- Change various details like the customer name and address.
		- Submit the updated job form.
	- **Verify**:
		- Check for a success message indicating the job details were updated.
		- Ensure the updated details are accurately reflected in the job list.

	#### 8.3 Delete Job
	- **Steps**:
		- Navigate to the "Jobs" section.
		- Select a job and click the "remove" button.
		- Confirm the deletion in the confirmation modal.
	- **Verify**:
		- Ensure a success message states the job was removed.
		- Confirm the job no longer appears in the job list.

	#### 8.4 Manage Job Parts
	- **Steps**:
		- For adding: Navigate to a job, click "Add Part", enter part details, and confirm.
		- For moving to used: Select "Move to Used" on a necessary part, confirm the move.
		- For returning to necessary: Select "Return to Necessary" on a used part, confirm the return.
		- For removing: Select "Remove" on any part, and confirm removal.
	- **Verify**:
		- Ensure each action is confirmed with a success message.
		- Verify the part lists update accordingly.

	#### 8.5 Manage Job Estimates
	- **Steps**:
		- For uploading: Navigate to a job, initiate estimate upload, select a PDF file, and confirm upload.
		- For viewing: Select an existing estimate and open it.
		- For removing: Choose to remove an existing estimate and confirm the action.
	- **Verify**:
		- Ensure successful upload with a confirmation message.
		- Verify estimate visibility for viewing.
		- Confirm removal success and ensure the estimate is no longer listed.
#### 9. Logging Activities
- **Goal**: Verify that all user-related actions are correctly logged in the system.

    #### 9.1 Logging New User Addition
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

    #### 9.2 Logging User Profile Updates
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
