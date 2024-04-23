# DeleteProductModal Component Documentation

## Overview

The `DeleteProductModal` component is used to confirm the deletion of a product from inventory. It prompts the user to confirm their action before proceeding to delete a product based on its part number.

## Usage

- **`showModal`**: Boolean that determines if the modal is visible.
- **`setShowModal`**: Function to toggle the visibility of the modal.
- **`deletePartNumber`**: String indicating the part number of the product to be deleted.
- **`fetchProductsWithInventory`**: Function to refresh the inventory list after a product is deleted.
- **`API_BASE_URL`**: String representing the base URL of the API for making backend calls.

## Features

- Confirmation prompt: Ensures that the deletion of products is intentional by requiring user confirmation.
- Integration with API: Handles the deletion of products by sending a DELETE request to the server.
- Responsive update: Updates the inventory list in real-time upon successful deletion.

## Styling

The modal uses styles from the `AddProduct.css` file, which should include styles for the modal backdrop, content, header, body, and actions. The CSS file path should be adjusted according to your project structure.

## Interaction Flow

1. **Modal Visibility**: The modal is rendered based on the `showModal` state.
2. **Confirmation**: The user is prompted to confirm the deletion of a product by clicking the "Delete" button.
3. **Deletion Process**:
   - Upon confirmation, a DELETE request is sent to the API with the part number.
   - If the deletion is successful, a success message is displayed using `toast.success`.
   - If the deletion fails, an error message is displayed using `toast.error`.
4. **Closure**: The modal is closed either upon successful deletion or when the user clicks the "Cancel" button.

## Error Handling

- Proper error handling with visual feedback through toast notifications.
- Captures and logs errors related to network requests or server responses.

## Accessibility

- Ensure that focus management is handled correctly when the modal opens and closes.
- Implement appropriate ARIA roles and attributes to enhance the accessibility of the modal, such as `role="dialog"` and `aria-modal="true"`.

## Example Use Case

This component is typically used in an inventory management system where administrators need to securely remove products. The confirmation step helps prevent accidental deletions that could disrupt inventory records.

## Best Practices

- Provide a clear and concise message in the modal body to inform the user about the action they are about to perform.
- Ensure that the modal actions are labeled appropriately ("Delete" and "Cancel") to avoid any confusion during the confirmation process.

