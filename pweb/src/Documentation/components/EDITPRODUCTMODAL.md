# EditProductModal Component Documentation

## Overview

`EditProductModal` is a React component designed to facilitate the editing of product details within a modal interface. It allows users to modify attributes like part number, color, description, price, and more. Upon submission, the component communicates with a backend server to update the product data.

## Usage

- **`showModal`**: Boolean to control the visibility of the modal.
- **`setShowModal`**: Function to toggle the visibility state of the modal.
- **`editProductItem`**: Object containing the product's current data that is to be edited.
- **`setEditProductItem`**: Function to update the state of `editProductItem`.
- **`fetchProductsWithInventory`**: Function to refresh the inventory display upon successful update.
- **`API_BASE_URL`**: String that provides the base URL for API requests.

## Features

- **Dynamic Form Fields**: Adjusts fields based on product characteristics (e.g., unit type).
- **Auto-generate Part Number**: Automatically generates part numbers based on specified product attributes.
- **Category Code Fetching**: Retrieves and sets category codes from the server based on product type.
- **Customizable Markup Price**: Allows manual adjustment of markup prices.
- **Responsive Design**: Utilizes modal design for better user interaction without leaving the current page context.
- **Real-time Validation**: Validates input fields in real-time to ensure data integrity before submission.

## Styling

The component uses styles from the `AddProduct.css` file, ensuring consistent look and feel with other inventory management UI components. Make sure this CSS file contains necessary styles for modal windows, form controls, buttons, and other interface elements used in the modal.

## Interaction Flow

1. **Modal Trigger**: The modal appears when `showModal` is set to true.
2. **Data Editing**: Users edit product details through a series of input fields.
3. **Validation**: Input data is validated in real-time.
4. **Submission**: Data is submitted to the server via an API request.
5. **Feedback**: Users receive immediate feedback on the success or failure of their update operation.
6. **Closure**: Modal closes upon successful update or when the user cancels the action.

## Error Handling

- Proper error messages are displayed using `toast` notifications if there are issues during the fetch or update processes.
- Client-side validation prevents submission of incorrect data formats or empty required fields.

## Accessibility

- Implements focus management to aid users navigating with keyboards.
- Uses ARIA roles and properties to enhance accessibility for screen reader users.

## Best Practices

- **State Management**: Proper state handling to ensure that the UI and data are in sync.
- **API Interaction**: Robust server communication for fetching and updating data.
- **User Feedback**: Clear and concise feedback for user actions, particularly for operations that change data.

## Example Use Case

This component is ideally used in web applications where inventory items need frequent updates, such as in e-commerce platforms, warehouse inventory systems, or any other system that manages a catalog of products.

## Dependencies

- `react-toastify` for displaying alerts and notifications.
- `API_BASE_URL` environment variable must be set correctly for API interactions.

Ensure that all dependencies are properly installed and environment variables are set for the component to function correctly.

