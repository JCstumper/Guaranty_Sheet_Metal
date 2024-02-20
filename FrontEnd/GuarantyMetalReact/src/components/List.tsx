import React from 'react';
import ListItem from './ListItem';
// Import your icon components or define them here if you're using something like FontAwesome

const List: React.FC = () => {
  // Example items, replace with your actual data source
  const items = [
    { title: 'About'},
    { title: 'Product'},
    { title: 'Gallery'},
    { title: 'Services'},
    { title: 'Contact Us'},
    { title: 'Login'},
    // Add more items as needed
  ];

  return (
    <div className="list">
      {items.map((item, index) => (
        <ListItem key={index} title={item.title} />
      ))}
    </div>
  );
};

export default List;
