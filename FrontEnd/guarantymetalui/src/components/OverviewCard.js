import React from 'react';
import './OverviewCard.css'; // Ensure this is correctly importing your CSS file

function OverviewCard({ title }) { // Removed content for simplicity, add it back if needed
  return (
    <div className="overview-card">
      <div className="overview-title">{title}</div>
      {/* <div>{content}</div> */} 
    </div>
  );
}

export default OverviewCard;
