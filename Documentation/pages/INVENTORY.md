# Inventory Component Documentation

## Overview

The `Inventory` component manages the inventory interface of the application. This component integrates various functionalities related to inventory management including product listing, product addition, product editing, quantity adjustment, and product deletion.

## Props

- **`setAuth`**: Function that updates the authentication status of the user. This is crucial for controlling access based on user authentication.

## State Management

The component uses several pieces of state to handle the user interface and business logic:

- **`products`**: An array storing the list of products. Each product is an object containing details such as part number, quantity, and other product-specific data.
- **`expandedRowIndex`**: Controls which product details are currently expanded in the view for more detailed information.
- **`filter`**: Stores the current search filter term used to filter the product list.
- **`showModal`, `showEditQuantityModal`, `showDeleteModal`, `showEditProductModal`**: Boolean values that control the visibility of various modal dialogs such as adding a new product, editing a product quantity, and deleting a product.
- **`editItem`**: Object representing the item currently being edited. It's primarily used for updating the product's quantity in stock.
- **`sortColumn`, `sortDirection`**: Manage the sorting of the product table based on column and direction (ascending or descending).
- **`deletePartNumber`, `editProductItem`**: Temporary storage for managing the deletion and editing of products.

## Features

### Product Display and Management

The component presents a table displaying products with options to sort and filter based on attributes like part number, stock quantity, etc. Each row in the table can be expanded to show more detailed information and actions that can be performed on the product.

### Modals and Interaction

Several modals facilitate user interaction for adding new products, editing existing products, and deleting them. The modals are equipped with forms that validate user input before submitting data to the server.

### Sorting and Filtering

Users can sort the product list based on various attributes and use the search bar to filter the list by matching their query against product descriptions, part numbers, and other characteristics.

### Context Integration

The component uses the `AppContext` for accessing global settings and state like the API base URL, which is essential for fetching and updating the inventory data.

## Integration with Backend Services

The `Inventory` component interacts with backend services to fetch, update, and delete product data, handling responses and errors appropriately to ensure the UI is up-to-date and responsive to user actions.

## User Interaction

Users can interact with the inventory system through various UI elements:
- **Sorting buttons**: Allow sorting of product lists by different criteria.
- **Search input**: Filters products dynamically based on user input.
- **Action buttons**: Found within the expanded product details, allowing for operations specific to each product like editing or deleting.

## Security and Authentication

The component ensures that actions like adding, editing, and deleting products are protected and only accessible to authenticated users, leveraging the provided `setAuth` prop to manage authentication states.

## Accessibility Features

The `Inventory` component is designed with accessibility in mind, featuring keyboard navigability and ARIA attributes where applicable to enhance usability for all users.

---

This documentation aims to provide a comprehensive overview of the `Inventory` component's functionality, ensuring that developers and users alike understand its role within the application and how to interact with it.
