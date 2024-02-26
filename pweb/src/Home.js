import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="section">
        <h3>Project Goals</h3>
        <ul class="project-goals">
          <li>Implement user authentication to enable secure sign-ins on the client side.</li>
          <li>Develop interactive forms for recording details of incoming shipments and tracking outgoing projects.</li>
          <li>Establish a fully functional end-to-end application that reliably stores data using Node.js, PostgreSQL on Docker, and React.</li>
          <li>Enable inventory browsing capabilities, allowing users to filter and sort items by various attributes such as name, quantity, and status.</li>
          <li>Host the application and its database on the company’s internal server or utilize AWS for reliable and scalable cloud hosting.</li>
        </ul>
      </div>
      <div className="section">
        <h3>Github Link</h3>
        <a href="https://github.com/JCstumper/Guaranty_Sheet_Metal" className="github-button">Guaranty Sheet Metal Development GitHub</a>
      </div>
    </div>
  );
}

export default Home;
