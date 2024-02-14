import React from 'react';

// Define the props for each list item
interface ListItemProps {
  title: string;
  description?: string; // Optional description
  icon?: JSX.Element; // Optional icon, assuming you use something like FontAwesome
}

const ListItem: React.FC<ListItemProps> = ({ title, description, icon }) => {
  return (
    <div className="list-item">
      {icon && <div className="list-icon">{icon}</div>}
      <div className="list-content">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default ListItem;
