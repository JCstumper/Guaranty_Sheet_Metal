# User Profile Update Route Documentation

## Overview

This document describes the backend route for updating a user's profile, including their username, password, and email. This route incorporates several layers of validation and security to ensure data integrity and security.

## Route

### **POST `/profile` - Update User Profile**

- **Description**: Allows an authenticated user to update their username, password, and email.
- **Authorization**: Protected by the `authorization` middleware, which checks the validity of the JWT token to ensure the user is authenticated.
- **Validation**: The `validInfo` middleware validates the input fields (username, password, email) to ensure they meet specified criteria before proceeding with the update.

## Implementation Details

- **Database Interaction**:
  - The function checks if the new username exists in the database to avoid duplicates.
  - If the username is available, it continues with updating the user's information in the database.
  - The password is securely hashed using bcrypt before being stored.
- **Query Construction**:
  - Dynamic SQL is constructed based on which fields are being updated.
  - Each field to be updated is added to the SQL query string along with placeholders for parameterized queries to prevent SQL injection.

## Error Handling

- **User Existence**: If the new username is already taken, it returns an error.
- **No Updates Provided**: If no fields are provided for update, it sends an error response.
- **Database Errors**: Catches any errors during database interactions and returns a server error response.

## Security Features

- **JWT Verification**: Ensures that only requests with a valid JWT can access the route, protecting sensitive user information.
- **Password Hashing**: Uses bcrypt to hash passwords before storing them in the database, enhancing security.
- **SQL Injection Prevention**: Uses parameterized queries to prevent SQL injection attacks.

## Usage

This route is used in applications that require user profiles to be updated securely. It supports partial updates; only the fields provided in the request body are updated.

This route is integral for maintaining user profile integrity and ensuring that user credentials are securely managed and updated.
