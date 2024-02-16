import React from 'react';
import ListItem from './ListItem';
import headerImage from './gsm-header.jpg';
import DropdownMenu from './DropdownMenu'; // Ensure DropdownMenu is imported
import './styles.css';

const List: React.FC = () => {
  const items = [
    { title: 'About'},
    { title: 'Product'},
    { title: 'Gallery'},
    // Integrate DropdownMenu directly for 'Services'
    { title: 'Services', isDropdown: true },
    { title: 'Contact Us'},
    { title: 'Login'},
  ];

  return (
    <div className="list">
      <img src={headerImage} className="header-image" alt="Header" />
      {items.map((item, index) => {
        // Conditionally render DropdownMenu for 'Services'
        if (item.isDropdown) {
          return (
            <ListItem key={index} title={item.title}>
             
              <DropdownMenu />
            </ListItem>
          );
        } else {
          return <ListItem key={index} title={item.title} />;
        }
      })}
    </div>
  );
};

export default List;
