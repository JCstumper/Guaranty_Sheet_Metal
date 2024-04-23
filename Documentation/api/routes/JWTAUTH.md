# Authentication and User Management Routes Documentation

## Overview

This documentation provides a detailed overview of the routes related to user authentication, registration, and initial setup for a web application. These routes handle user registrations, logins, user profile updates, and checks for initial system setup.

## Routes

### **GET `/check-initial-setup`**

- **Functionality**: Checks if the initial system setup has been completed.
- **Response**: Returns a boolean indicating whether the initial setup is complete.

### **POST `/update-initial-setup`**

- **Middleware**: `validInfo` - Ensures the input data is valid.
- **Functionality**: Completes the initial system setup by setting admin credentials.
- **Response**: Returns a success message or error if the setup has already been completed or if there is a server error.

### **POST `/firstregister`**

- **Middleware**: `validInfo` - Ensures the input data is valid.
- **Functionality**: Handles the first registration in the system, typically for creating an initial admin user.
- **Response**: Returns a success message or silently exits if the first registration has been previously completed.

### **POST `/register`**

- **Middleware**: 
  - `validInfo` - Validates the input data.
  - `authorization` - Ensures the requester is authorized to perform the operation.
- **Functionality**: Registers a new user in the system.
- **Response**: Returns a user registration success message or error messages for various validation failures.

### **POST `/login`**

- **Middleware**: `validInfo` - Validates the input data.
- **Functionality**: Authenticates a user based on username and password.
- **Response**: Returns a JWT token if authentication is successful; otherwise, returns error messages related to user authentication failures, including lockout status.

### **GET `/verify`**

- **Middleware**: `authorization` - Checks if the request has a valid JWT token.
- **Functionality**: Verifies if the user's token is still valid.
- **Response**: Returns `true` if the token is valid, otherwise sends a server error response.

## Additional Functionalities

- **User Lockout Management**: Includes utility functions to handle user account lockouts after consecutive failed login attempts, enhancing security against brute-force attacks.
- **Logging Actions**: Functionality to log user actions related to adding users or other significant events, aiding in audit trails and system monitoring.
- **Error Handling**: Robust error handling across routes to provide clear feedback on issues like server errors or validation problems.

## Security Features

- **Bcrypt**: Used for hashing passwords before storing them in the database, ensuring that passwords are not stored in plain text.
- **JWT**: Utilizes JSON Web Tokens for managing user sessions and protecting routes that require authentication.
- **Middleware Customization**: Uses custom middleware for validating input data and authorization, ensuring that requests meet the required criteria before processing.

This API is crucial for managing user authentication and registration workflows, providing secure and efficient user management capabilities within the application.
