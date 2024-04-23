# JWT Authentication Middleware Documentation

## Overview

This middleware is designed to handle JWT (JSON Web Token) authentication for routes in a Node.js application. It ensures that only requests containing a valid JWT in the header are allowed to proceed, providing a secure way to protect routes that require user authentication.

## Features

- **JWT Validation**: Checks for the presence and validity of a JWT in the request headers.
- **Error Handling**: Provides clear responses when authentication fails, either due to a missing token or token verification failure.
- **User Payload Extraction**: Extracts user information from the token and attaches it to the request object, making user details readily available to downstream middleware and route handlers.

## Implementation Details

- **Header Check**: Looks for a token in the `token` header field of incoming requests.
- **Token Verification**: Uses the `jsonwebtoken` library to verify the token against a secret key stored in environment variables.
- **User Information**: On successful token verification, it extracts user-specific information (like user ID and username) from the token payload and attaches it to the request object for use in subsequent route handlers.

## Usage

This middleware is intended to be used in server routes that require user authentication. It should be placed before any route handler that needs to ensure the user is logged in.

## Code Structure

- **Environment Variables**: Relies on a secret key (`jwtSecret`) stored as an environment variable to maintain security and facilitate easy updates.
- **Error Responses**: Responds with a 403 status code and an appropriate error message when authentication fails, ensuring that unauthorized requests are halted and logged.

## Error Handling

- Uses a try-catch block to handle any exceptions that may occur during token verification, such as an expired token or a token signed with an incorrect key.
- Logs error messages to the console for debugging purposes.

## Dependencies

- **jsonwebtoken**: A library used to issue JWTs and verify them.
- **dotenv**: Used to load environment variables from a `.env` file into `process.env`, making the JWT secret key accessible.

This middleware is essential for maintaining the security and integrity of your application by ensuring that only authenticated users can access certain routes.
