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

### Purchases Management
- **Add/Delete Purchase**: Tests the ability to add and delete purchases, ensuring that the inventory is updated correctly and that the purchase history is maintained accurately. Additionally aloows addiition of purchase date and quantity, to update the relevent low and out of stock inventory items.

### Job Management
- **Manage Jobs and Job-related Details**: Tests the functionalities involved in managing jobs within the application. This includes adding new jobs, editing existing jobs, deleting jobs, managing necessary and used parts associated with jobs, and handling job estimates. 

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

    #### 9.1 Logging a New User Addition
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

    #### 9.2 Logging a User Profile Updates
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

    #### 9.3 Logging a User Adding a Product
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Inventory page.
        - Click the plus sign at the top right to add a new product.
        - Fill out the information for the new product.
        - Then click "Add Item" to add the new product to the database.
    - **Verify**:
        - Look for a log entry indicating the product was added.
        - Verify the log shows a detailed message like "Add Product" and includes details such as "Product Added."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.4 Logging a User Adding a Job
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Jobs page.
        - Click the plus sign at the top right to add a new job.
        - Fill out the information for the job.
        - Then click "Add Job" to add the new product to the database.
    - **Verify**:
        - Look for a log entry indicating a job was added.
        - Verify the log shows a detailed message like "Add Job" and includes details such as "Job Management."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.5 Logging a User Adding a Product to Necessary Parts under a Job
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Jobs page.
        - Click on any job.
        - Then under "Necessary Parts," click on "Add Part."
        - Then click add on the part you would like to add.
        - The part will now display under "Necessary Parts."
    - **Verify**:
        - Look for a log entry indicating a part was added to a job.
        - Verify the log shows a detailed message like "Add Necessary Part" and includes details such as "Necessary Parts."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.6 Logging a User Editing a Product under Necessary Parts under a Job
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Jobs page.
        - Click on any job.
        - Then under "Necessary Parts," click on "Edit" on any of the parts.
        - Then click on "Save" to save the new quantity.
        - The part will now display with the new quantity under "Necessary Parts."
    - **Verify**:
        - Look for a log entry indicating a part was edited in a job.
        - Verify the log shows a detailed message like "Update Necessary Part" and includes details such as "Necessary Parts."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.7 Logging a User Moving a Product from Necessary Parts to Used Parts under a Job
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Inventory page.
        - Click on an existing product.
        - Click on "Edit Quantity" and enter the new quantity value for the product.
        - Then navigate to the Jobs page.
        - Click on any job.
        - Then under "Necessary Parts," click on "Moved to Used" on any of the parts.
        - Then click on "Confirm" to indicate that you want the part to moved to "Used Parts."
        - The part will now display under "Used Parts."
    - **Verify**:
        - Look for a log entry indicating a part was moved.
        - Verify the log shows a detailed message like "Move to Used" and includes details such as "Part Movement."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.8 Logging a User Moving a Product from Used Parts to Necessary Parts under a Job
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Jobs page.
        - Click on any job.
        - Then under "Used Parts," click on "Return to Necessary" on any of the parts.
        - Then click on "Confirm" to indicate that you want the part to moved to "Necessary Parts."
        - The part will now display under "Necessary Parts."
    - **Verify**:
        - Look for a log entry indicating a part was moved.
        - Verify the log shows a detailed message like "Return to Necessary" and includes details such as "Part Management."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.9 Logging a User Removing a Product from Used Parts under a Job
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Jobs page.
        - Click on any job.
        - Then under "Used Parts," click on "Remove" on any of the parts.
        - Then click on "Remove" to confirm that you want the part to be removed from the job.
        - The part will no longer be display under "Used Parts."
    - **Verify**:
        - Look for a log entry indicating a part was deleted.
        - Verify the log shows a detailed message like "Delete From Used" and includes details such as "Part Management."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.10 Logging a User Editing a Job
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Jobs page.
        - Click on "Edit" on any job.
        - Then change any information about the job.
        - The job will now display with the new edited information.
    - **Verify**:
        - Look for a log entry indicating a job was edited.
        - Verify the log shows a detailed message like "Updated Job" and includes details such as "Job Management."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.11 Logging a User Deleting a Job
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Jobs page.
        - Click on "Remove" on any job.
        - Then click "Delete" to confirm that you want to delete the job.
        - The job will no longer de displayed on the Jobs page.
    - **Verify**:
        - Look for a log entry indicating a job was deleted.
        - Verify the log shows a detailed message like "Delete Job" and includes details such as "Job Management."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.11 Logging a User Updating the Quantity of a Product
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Inventory page.
        - Click on any of products.
        - Then click "Edit" and enter the new information for the product.
        - The products "Part Number" will now be updated with a new part number.
    - **Verify**:
        - Look for a log entry indicating a product was updated.
        - Verify the log shows a detailed message like "Update Product" and includes details such as "Inventory."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.
        
    #### 9.12 Logging a User Editing a Product
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Inventory page.
        - Click on any of products.
        - Then click "Edit Quantity" and enter the new quantity for the product.
        - The product will now display the new in stock quantity.
    - **Verify**:
        - Look for a log entry indicating a product was updated.
        - Verify the log shows a detailed message like "Update Quantity" and includes details such as "Inventory."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.13 Logging a User Adding a new Order
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Purchases page.
        - Click the plus sign at the top right to add a new order.
        - Enter the information about the new Order.
        - Then click "Add Order" to confirm the new order.
        - The new order will now be displayed in the Purchases page.
    - **Verify**:
        - Look for a log entry indicating an order was added.
        - Verify the log shows a detailed message like "Add" and includes details such as "Invoice."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.14 Logging a User Adding an Out of Stock Product under an Order
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Purchases page.
        - Click on any order.
        - Then under "Our of Stock" click on "Add to Order" next to any of the products.
        - The product will now be displayed under "New Order."
    - **Verify**:
        - Look for a log entry indicating an new order was added.
        - Verify the log shows a detailed message like "New Order" and includes details such as "Added Item."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.15 Logging a User Adding Low Inventory Product under an Order
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Purchases page.
        - Click on any order.
        - Then under "Low Inventory" click on "Add to Order" next to any of the products.
        - The product will now be displayed under "New Order."
    - **Verify**:
        - Look for a log entry indicating an new product was added.
        - Verify the log shows a detailed message like "New Order" and includes details such as "Added Item."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.16 Logging a User Removing a Product under an Order
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Purchases page.
        - Click on any order.
        - Then under "New Order", click on "Remove" next to any of the products.
        - The product will now be removed from "New Order."
    - **Verify**:
        - Look for a log entry indicating an order was removed.
        - Verify the log shows a detailed message like "Update" and includes details such as "Out-Of-Stock Inventory."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.17 Logging a User Marking an Order as Generated
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Purchases page.
        - Then next to any order click "Mark as Generated."
        - The order status will now be updated to "Generated."
    - **Verify**:
        - Look for a log entry indicating an new order was updated.
        - Verify the log shows a detailed message like "Update Order Details" and includes details such as "Order Status Updated."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.18 Logging a User Adding a Shipping Cost to an Order
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Purchases page.
        - Then next to any order click "Add Shipping Cost."
        - Enter the value of the orders shipping cost.
        - Then click "Submit."
        - The order will now appear with the new shipping cost.
    - **Verify**:
        - Look for a log entry indicating an order was updated.
        - Verify the log shows a detailed message like "Invoice Total Cost" and includes details such as "Total Cost Updated."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.19 Logging a User Marking an Order as Received
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Purchases page.
        - Then next to any order click "Mark as Received."
        - The order status will now be updated to "Received."
    - **Verify**:
        - Look for a log entry indicating an order was updated.
        - Verify the log shows a detailed message like "Update Order Details" and includes details such as "Order Status Update."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.20 Logging a User Deleting an Order
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Purchases page.
        - Then next to any order click "Delete" and click on "Delete Order" to confirm that you want to delete the order.
        - The order will no longer be displayed under the Purchases page. 
    - **Verify**:
        - Look for a log entry indicating an order was deleted.
        - Verify the log shows a detailed message like "Delete" and includes details such as "Invoice Deletion."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

    #### 9.21 Logging a User Deleting a Product
    - **Steps**:
        - Stay logged in as an admin or log in if not already.
        - Navigate to the Inventory page.
        - Click on any product and then click on "Delete".
        - Click on "Delete" again to confirm that you want to delete the product.
        - The product will no longer be displayed under the Inventory page. 
    - **Verify**:
        - Look for a log entry indicating an product was deleted.
        - Verify the log shows a detailed message like "Delete Product" and includes details such as "Inventory."
        - Ensure the log records are comprehensive and indicate the specific fields that were changed.

### UAT Execution
- **Participants**: Include real users, business stakeholders, and IT support staff.
- **Feedback Collection**: Use surveys, interviews, and observation to gather comprehensive feedback.
- **Documentation**: Record all test results and feedback for review and action.


The results from UAT will guide the final adjustments before deployment, ensuring the application meets all user requirements and performs optimally in real-world scenarios. This comprehensive approach ensures a robust and user-friendly product.


## Conclusion
The tests were designed to be comprehensive yet manageable for developers to maintain. By targeting the most critical areas of the application, we ensure a robust product that meets the functional requirements and delivers a smooth user experience.
