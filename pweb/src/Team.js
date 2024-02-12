import React from 'react';
import './Team.css';

function Team() {
    return (
        <div className="team-container">
            <h2>Team Members</h2>

            <div className="member">
                <h3>Jacob Carney</h3>
                <p>Bio of Jacob Carney...</p>
                {/* Add more details or a photo if needed */}
            </div>

            <div className="member">
                <h3>Mason Wittkofski</h3>
                <p>Bio of Mason Wittkofski...</p>
                {/* Add more details or a photo if needed */}
            </div>

            <div className="member">
                <h3>Michal Zajac</h3>
                <p>Bio of Michal Zajac...</p>
                {/* Add more details or a photo if needed */}
            </div>

            <div className="member">
                <h3>Waleed Kambal</h3>
                <p>Bio of Waleed Kambal...</p>
                {/* Add more details or a photo if needed */}
            </div>

            <div className="member">
                <h3>Brandon Bejarano</h3>
                <p>Bio of Brandon Bejarano...</p>
                {/* Add more details or a photo if needed */}
            </div>
        </div>
    );
}

export default Team;
