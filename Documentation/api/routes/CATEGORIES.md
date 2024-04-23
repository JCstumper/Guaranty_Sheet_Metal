# Category Management Routes Documentation

## Overview

This document details the backend routes used for managing category mappings within an application. These routes handle fetching, creating, and retrieving specific category codes based on category names.

## Routes

### **GET `/` - Fetch All Categories**

- **Description**: Retrieves all category mappings from the database.
- **Response**: Returns an array of category mapping objects.

### **POST `/` - Add a New Category Mapping**

- **Description**: Adds a new category mapping to the database after ensuring that neither the category name nor the catcode is duplicated.
- **Body Parameters**:
  - `keywords`: An array of keywords associated with the category.
  - `category`: The name of the category.
  - `catcode`: The unique code for the category.
- **Response**: On successful insertion, returns the newly added category mapping.

### **GET `/getCatCode/:category` - Fetch Category Code by Category Name**

- **Description**: Fetches the category code for a given category name.
- **URL Parameters**:
  - `category`: The name of the category to fetch the catcode for.
- **Response**: Returns the category code if found; otherwise, an error message if the category does not exist.

## Implementation Details

- **Database Interaction**: All routes interact with a PostgreSQL database using prepared statements to prevent SQL injection.
- **Error Handling**: Each route includes robust error handling to manage database errors or invalid data, ensuring the server's stability.

## Usage

These routes are intended for use in applications that require category management for items or products, providing essential functionalities for:
- Retrieving all categories to display or for administrative use.
- Adding new categories with unique identifiers for organizing items more efficiently.
- Looking up specific category codes needed for item classification or processing.

## Security Features

- **Prepared Statements**: Protects against SQL injection.
- **Error Handling**: Prevents leaking of detailed server or database errors by providing generic error messages for client responses.

This set of routes forms the backbone of category management within the application, ensuring data integrity and supporting effective data organization.
