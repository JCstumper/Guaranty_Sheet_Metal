import React from 'react';
import './Deliverables.css';

function Deliverables() {
  return (
    <div className="deliverables-container">
      <div className="deliverable">
        <h3>Sprint 1 Deliverable</h3>
        <div>
          <a href={`${process.env.PUBLIC_URL}/Sprint1PlanningDocument.pdf`} target="_blank" rel="noopener noreferrer">
            Sprint One Planning Document
          </a>
        </div>
        <div>
          <a href={`${process.env.PUBLIC_URL}/Sprint1Backlog.pdf`} target="_blank" rel="noopener noreferrer">
            Sprint One Backlog
          </a>
        </div>
        <div>
          <a href={`${process.env.PUBLIC_URL}/DailyJournalDocument.pdf`} target="_blank" rel="noopener noreferrer">
            Daily Journal
          </a>
        </div>
        <div>
          <a href={`${process.env.PUBLIC_URL}/Sprint1GuarantySheetMetal.pdf`} target="_blank" rel="noopener noreferrer">
            Sprint One PowerPoint PDF
          </a>
        </div>
        <div>
          <a href={`${process.env.PUBLIC_URL}/retro.pdf`} target="_blank" rel="noopener noreferrer">
            Sprint One Retrospective
          </a>
        </div>
        <div>
          <a href={`${process.env.PUBLIC_URL}/Project1Backlog.pdf`} target="_blank" rel="noopener noreferrer">
            Project Backlog
          </a>
        </div>
      </div>
      <div className="deliverable">
        <h3>Sprint 2 Deliverable</h3>
        <p>Description or links related to Sprint 2 deliverable...</p>
      </div>
      <div className="deliverable">
        <h3>Sprint 3 Deliverable</h3>
        <p>Description or links related to Sprint 3 deliverable...</p>
      </div>
    </div>
  );
}

export default Deliverables;
