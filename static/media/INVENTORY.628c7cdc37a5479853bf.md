# Inventory Route Documentation

## Overview

This document describes the API routes for managing inventory within a system. The routes facilitate querying inventory details, updating stock quantities, and logging inventory actions.

## Routes

### **GET `/` - Fetch Inventory**

- **Authorization**: Requires valid JWT authentication.
- **Functionality**: Retrieves all inventory items from the database.
- **Response**: Returns a JSON object containing all inventory items.

### **PATCH `/:part_number/quantity` - Update Inventory Quantity**

- **Authorization**: Requires valid JWT authentication.
- **Parameters**: `part_number` - The unique identifier for an inventory item.
- **Payload**: `quantity_in_stock` - The new stock quantity for the inventory item.
- **Functionality**: Updates the quantity in stock for a specified inventory item. Logs the update action.
- **Response**:
  - **Success**: Returns the updated inventory item.
  - **Failure**: Returns a 404 status code if the inventory item does not exist.

### **GET `/:part_number` - Fetch Specific Inventory Item**

- **Authorization**: Requires valid JWT authentication.
- **Parameters**: `part_number` - The unique identifier for an inventory item.
- **Functionality**: Retrieves details for a specific inventory item.
- **Response**:
  - **Success**: Returns the details of the specified inventory item.
  - **Failure**: Returns a 404 status if the inventory item is not found.

## Additional Functionality

- **Logging Inventory Actions**: Utilizes a helper function `logInventoryAction` to log various inventory actions (e.g., updates to quantity) into a log table in the database. This helps in auditing and tracking changes over time.

## Error Handling

- **500 Internal Server Error**: Returned if there are any database or server errors during the execution of the routes.
- **404 Not Found**: Returned if an inventory item is not found in the database.

## Middleware

- **Authorization Middleware**: Validates JWT tokens to ensure that requests are authenticated. It extracts user details from the token and appends them to the request object.

## Database Interaction

- **Queries**:
  - Fetch all inventory items.
  - Update inventory quantity.
  - Fetch specific inventory item by part number.
- **Logging**: Inserts a new log entry whenever an inventory action occurs.

## Security Features

- **JWT Authentication**: Ensures that only authenticated users can access and modify inventory data.
- **Input Validation**: Validates part numbers and quantities to ensure they meet specific criteria before processing.

This route collection is integral for inventory management in applications where accurate tracking and updating of stock are crucial for operational efficiency.
