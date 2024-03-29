import React from 'react';
import './Deliverables.css';

function Deliverables() {
  return (
    <div className="deliverables-container">
      <div className="deliverable">
        <h3>Sprint 1 Deliverable</h3>
        <a href={`${process.env.PUBLIC_URL}/Sprint1PlanningDocument.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Sprint One Planning Document
        </a>
        <a href={`${process.env.PUBLIC_URL}/Sprint1Backlog.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Sprint One Backlog
        </a>
        <a href={`${process.env.PUBLIC_URL}/DailyJournalDocument.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Daily Journal
        </a>
        <a href={`${process.env.PUBLIC_URL}/Metals-Sprint1Slides.pptx`} target="_blank" rel="noopener noreferrer" className="github-button">
          Sprint One PowerPoint
        </a>
        <a href={`${process.env.PUBLIC_URL}/retro.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Sprint One Retrospective
        </a>
        <a href={`${process.env.PUBLIC_URL}/Project1Backlog.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Project Backlog
        </a>
        <a href="https://github.com/JCstumper/Guaranty_Sheet_Metal/tree/sprint1snapshot" className="github-button">
          Guaranty Sheet Metal Development GitHub for Sprint 1
        </a>
      </div>
      <div className="deliverable">
        <h3>Sprint 2 Deliverable</h3>
        <a href={`${process.env.PUBLIC_URL}/Sprint1PlanningDocument.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Sprint Two Planning Document
        </a>
        <a href={`${process.env.PUBLIC_URL}/Sprint1Backlog.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Sprint Two Backlog
        </a>
        <a href={`${process.env.PUBLIC_URL}/DailyJournalDocument.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Updated Daily Journal
        </a>
        <a href={`${process.env.PUBLIC_URL}/Metals-Sprint1Slides.pptx`} target="_blank" rel="noopener noreferrer" className="github-button">
          Sprint Two PowerPoint
        </a>
        <a href={`${process.env.PUBLIC_URL}/retro.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Sprint Two Retrospective
        </a>
        <a href={`${process.env.PUBLIC_URL}/Project1Backlog.pdf`} target="_blank" rel="noopener noreferrer" className="github-button">
          Project Backlog
        </a>
        <a href="https://github.com/JCstumper/Guaranty_Sheet_Metal/tree/sprint1snapshot" className="github-button">
          Guaranty Sheet Metal Development GitHub for Sprint 2
        </a>
      </div>
      <div className="deliverable">
        <h3>Sprint 3 Deliverable</h3>
        <p>Description or links related to Sprint 3 deliverable...</p>
      </div>
    </div>
  );
}

export default Deliverables;
