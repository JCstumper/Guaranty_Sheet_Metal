import React from 'react';
import './OverviewCard.css'; // Import the CSS file for styling

function OverviewCard({ title, content }) {
  return (
    <div className="overview-card">
      <h2><span className='overview-title'>Overview</span>{title}</h2>
    </div>
  );
}

export default OverviewCard;
