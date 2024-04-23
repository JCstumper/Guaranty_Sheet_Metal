# Orders Component Documentation

## Overview

The `Orders` component is responsible for managing purchase orders within the application. It provides functionalities to view, filter, add, and manage orders, including handling low inventory and out-of-stock items, which are critical for maintaining supply chain efficiency.

## Functionalities

### Order Management

- **View Orders**: Display a list of all orders with details such as supplier name, total cost, invoice date, and status.
- **Add Orders**: Facilitates the addition of new orders through a modal form, capturing details like supplier name, cost, date, and status.
- **Filter Orders**: Allows filtering of orders based on supplier name, cost, date, or status to streamline viewing specific entries.

### Inventory Monitoring

- **Low Inventory and Out of Stock Items**: Tracks items with low inventory and those that are out of stock. These items can be directly added to new orders to ensure inventory levels are replenished.

### Modal Interactions

- **Filter Modal**: A modal interface for setting filters on the orders list.
- **Add Order Modal**: Provides a form within a modal to input new order details.

## Context Integration

Utilizes `AppContext` for accessing the global `API_BASE_URL`, ensuring that all API interactions are centralized and managed through one configurable endpoint.

## State Management

- **Local States**:
  - `orders` and `filteredOrders`: Manage the list of orders and the filtered view based on user inputs.
  - `showModal`: Controls the visibility of the modal for adding new orders.
  - `lowInventoryItems` and `outOfStockItems`: Track items that need replenishment.

## API Interactions

- **Fetch Orders**: Retrieves all current orders from the backend.
- **Add Order**: Sends new order data to the backend for creation.
- **Fetch Inventory Items**: Checks for low inventory and out-of-stock items, which are essential for creating restock orders.

## Error Handling

Implements error handling for API requests, providing user feedback through toast notifications for operations like fetching data or adding orders.

## Accessibility

Ensures that the component is accessible, with interactive elements such as buttons and form inputs being usable and navigable.

## Usage

This component is used within the purchasing or inventory management sections of the application, primarily accessed by users responsible for order management and inventory oversight.

## Security Features

- Ensures sensitive operations like adding or modifying orders are protected and only accessible based on user authentication and appropriate permissions.
- Secures API calls to prevent unauthorized access and data breaches.

## Modals and Dynamic Content

- **Add Order Modal**: Facilitates the addition of new orders.
- **Filter Modal**: Allows dynamic filtering of the order list based on various criteria.

## Styling and Layout

- Leverages CSS from `Orders.css` for styling, ensuring that the component's visual presentation is consistent with the rest of the application.

---

This documentation provides a detailed overview of the `Orders` component's functionality and its role within the larger application framework. It highlights the component's ability to manage purchase orders and inventory effectively, along with user interaction capabilities through the modal i
