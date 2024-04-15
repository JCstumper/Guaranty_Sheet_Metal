# App Component Documentation

## Overview

The `App` component serves as the root component for the React application. It manages routing, authentication, and global state via context, ensuring that components in the application can interact and function cohesively.

## Responsibilities

- **Routing**: Implements the main routes and navigation within the application, leveraging React Router. It controls access to different parts of the application based on user authentication status.
- **Authentication Management**: Manages user authentication state across the application. This includes checking token validity, handling login and logout functionalities, and redirecting users based on their authentication status.
- **Global State Management**: Provides a global context (`AppContext`) that houses the API base URL, which can be accessed by any component within the app.
- **Loading State**: Manages a loading state to handle asynchronous operations or during the initial application load.
- **Token Management**: Checks for token expiration to securely manage user sessions and trigger re-authentication when necessary.

## Components Managed

- **`Dashboard`**: Main interface for authenticated users.
- **`Orders` and `Customers`**: Handle specific functionalities related to orders and customer management.
- **`Inventory`**: Manages inventory-related tasks.
- **`Login` and `Register`**: Handle user authentication and account creation.
- **`LogoutConfirmation`**: Manages user logout procedures.
- **`Loading`**: Displays a loading indicator during data fetch or processing.
- **`NotFound`**: Displays a 404 error page when a route is not found.
- **`Logs`**: Admin-specific component that requires higher-level permissions.

## Routing and Access Control

The application uses protected routes to ensure that users can only access areas appropriate for their authentication state and role. Non-authenticated users are redirected to the login page, while authenticated users have access to routes based on their permissions. The component utilizes dynamic routing to serve different components based on the route accessed.

## Authentication Flow

1. **Token Verification**: On application load, the token stored in localStorage is verified. If the token is expired or invalid, the user is logged out and redirected to the login page.
2. **User Roles and Access**: User roles are decoded from the JWT token to manage access to specific routes and functionalities within the app.

## Context Management

The `AppContext` provides components with access to the API base URL, enabling them to make requests to backend services without hardcoding URLs.

## Error Handling

Errors related to token management, route access, and API requests are managed to ensure a robust user experience. Error messages and statuses are used to inform the user and guide them to appropriate actions.

## Usage

This component acts as a container for all other components and services in the application. It is mounted at the root of the application and ensures that all child components have the necessary data and functions they need to operate correctly.

---

This documentation outlines the high-level functionality and role of the `App` component within the React application. It serves as the architectural backbone, ensuring that routing, state management, and authentication flow seamlessly throughout the user experience.
