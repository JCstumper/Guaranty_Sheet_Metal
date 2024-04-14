# PieCard Component Documentation

## Overview

The `PieCard` component is used to display a pie chart that represents different segments of data visually. In this specific instance, it illustrates the breakdown of revenue across various services.

## Usage

This component is typically used in dashboard views where a quick visual representation of data distribution is necessary. It helps in making data-driven decisions by providing a clear and immediate understanding of proportions.

## Features

- **Responsive Design**: Wrapped within a `ResponsiveContainer` to ensure the chart adjusts to the screen size and parent container dimensions.
- **Customizable Colors**: Uses a predefined array of colors to differentiate between data segments visually.
- **Interactive Tooltip**: Provides detailed information about each segment when hovered over, formatted as currency.
- **Legend Inclusion**: Includes a legend to help identify what each color in the pie chart represents.

## Structure

- **Header**: Displays a title above the chart for context.
- **Pie Chart Visualization**: Configured to show data segments with percentage labels.
- **Tooltip**: Custom formatted to display values in a currency format, enhancing readability and understanding.
- **Legend**: Situated to guide the viewer in correlating colors to data segments.

## Styling

The component uses styles from `PieCard.css`, ensuring that the chart is visually consistent with the rest of the application's design. This includes layout adjustments and color applications.

## Interactivity

- **Tooltip Interaction**: Provides a more detailed view of the data on hover, which includes the segment's name and its value formatted as currency.
- **Legend for Reference**: Helps users link the color segments on the chart to their corresponding data categories.

## Best Practices

- **Data Formatting**: Ensures data is clearly readable and understandable. Currency values are formatted appropriately using `Intl.NumberFormat`.
- **Accessibility**: Considers accessibility in design to ensure that color contrasts are adequate and information is accessible through tooltips and legends.
- **Color Palette**: Chooses a color palette that is distinct enough to differentiate between segments effectively.

## Dependencies

Utilizes:
- `recharts` for rendering the charts, which simplifies the process of integrating responsive and customizable charts into React applications.

This component is essential for visual data representation in applications requiring a quick assessment of data distribution, especially in financial and analytical dashboards.
