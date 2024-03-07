import React from 'react';
import './OverviewCard.css'; // Ensure this is correctly importing your CSS file

function OverviewCard({ title, number }) { // Removed content for simplicity, add it back if needed
  return (
    <div className="overview-card">
      <div className="overview-title">{title}</div>
      <div className="overview-title">{number}</div>
      {/* <div>{content}</div> */} 
    </div>
  );
}

export default OverviewCard;
