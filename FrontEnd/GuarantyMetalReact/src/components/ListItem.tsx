import React from 'react';

// Extend the ListItemProps with children of type ReactNode (optional)
interface ListItemProps {
  title: string;
  description?: string; // Optional description
  icon?: JSX.Element; // Optional icon, assuming you use something like FontAwesome
  children?: React.ReactNode; // Add children as an optional prop
}

const ListItem: React.FC<ListItemProps> = ({ title, children }) => {
  return (
    <div className="list-item">
      <div className="list-content">
        <h3>{title}</h3>
        {/* Conditionally render children if they are provided */}
        {children}
      </div>
    </div>
  );
};

export default ListItem;
