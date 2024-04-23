# GraphCard Component Documentation

## Overview

The GraphCard component provides a visual representation of inventory statuses through a bar chart. It displays the stock levels of various items, showing both in-stock and out-of-stock quantities.

## Implementation Details

- The component is implemented using the Recharts library, a set of composable React chart components.
- The chart is configured to be 600 pixels wide and 300 pixels high with custom margins.

## Data Structure

- The component uses sample data that includes names of inventory items along with their in-stock and out-of-stock quantities.

## Features

- The chart includes a Cartesian grid, X and Y axes, tooltips for detailed information on hover, and a legend to distinguish between in-stock and out-of-stock statuses.
- Bars for in-stock quantities are colored green, while bars for out-of-stock quantities are colored red.

## Usage

- The GraphCard component can be integrated into any part of a React application that requires visual representation of inventory data.
- It requires the Recharts library to be included in the project.

## Styling

- Styling is managed through a CSS file, typically named `BarCard.css`, which should be included to ensure the chart is displayed correctly.

## Accessibility

- Considerations for accessibility should be made to ensure that the chart is usable by people with disabilities, which might involve adding ARIA labels and roles.

## Future Enhancements

- Integration with real-time data sources to reflect current inventory statuses.
- Options to customize chart properties like dimensions and colors based on props.
- Enhanced error handling for data fetching and processing.


This Markdown documentation provides all the necessary details about the `GraphCard` component, making it easy for other developers to understand its purpose, configuration, and usage within a React application.

