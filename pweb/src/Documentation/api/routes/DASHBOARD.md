# Dashboard Route Documentation

## Overview

This document outlines the backend route used for fetching user profile information. The route is protected by authorization middleware to ensure that only authenticated users can access their profile data.

## Route

### **GET `/` - Fetch User Profile**

- **Description**: Retrieves the username for the authenticated user from the database.
- **Authorization**: This route is protected with authorization middleware, which verifies the JWT token in the request headers to ensure it is valid and not expired. The middleware adds the user's ID (decoded from the JWT token) to the request object.
- **Response**: Returns the username of the authenticated user.

## Implementation Details

- **Database Interaction**: The route queries a PostgreSQL database to fetch the username associated with the user ID stored in the request object, which is populated by the authorization middleware.
- **Middleware**:
  - `authorization`: Validates the JWT provided in the request headers, decodes it to retrieve the user's ID, and attaches it to the request object as `req.user`.

## Error Handling

- **Database Errors**: Catches any errors during the database operation and returns a server error response.
- **Authorization Errors**: If the authorization middleware fails (e.g., invalid token, expired token), it sends an appropriate response to prevent access to the route.

## Usage

This route is used in applications where user-specific data needs to be fetched after authentication. It is typically called after a user logs in to retrieve profile information that might be displayed on a user dashboard or profile page.

## Security Features

- **JWT Verification**: Ensures that only requests with a valid JWT can access the route, protecting sensitive user information.
- **Error Handling**: Provides robust error handling to prevent sensitive error information from being exposed to the client and to handle unexpected issues gracefully.

This route forms a crucial part of user management in applications, providing a secure and efficient way to access authenticated user profile data.
