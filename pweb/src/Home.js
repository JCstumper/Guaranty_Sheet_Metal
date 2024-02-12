import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="section">
        <h3>Project Goals</h3>
        <ul>
          <li>Allow a user to sign in to the client side.</li>
          <li>Have forms for users to enter shipments received and outgoing projects.</li>
          <li>Have a simple working end-to-end application that persists data.</li>
          <li>Allow users to browse the current inventory and sort based on different attributes.</li>
        </ul>
      </div>
      <div className="section">
        <h3>Github Link</h3>
        <a href="https://github.com/JCstumper/Guaranty_Sheet_Metal">Guaranty Sheet Metal Developement Github</a>
      </div>
    </div>
  );
}

export default Home;
