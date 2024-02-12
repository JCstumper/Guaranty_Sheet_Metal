import React from 'react';
import './Team.css';

function Team() {
    return (
        <div className="team-container">
            <h2>Team Members</h2>

            <div className="member">
                <h3>Jacob Carney</h3>
                <p><strong>Hometown:</strong> Mount Airy, Maryland</p>
                <p><strong>Contact:</strong> <a href="mailto:jmcarney@crimson.ua.edu">jmcarney@crimson.ua.edu</a>, <a href="tel:+14432891370">443 289 1370</a></p>
                <p>Hi, I'm Jacob Carney, a first-generation computer scientist studying at the University of Alabama. Being the first in my family to enter this field, I'm eager to carve my own path in the world of Agricultural Computer Science.</p>
                
                <p>Outside of my academic pursuits, hunting offers me a sense of tranquility. I'm also fan of ice hockey, enjoying teamwork of the game. And when I'm not outdoors or on the ice, you'll likely find me gaming.</p>
                
                <p>I am trying to find my way through life, not forgetting my roots. My goal is to find ways to expand the technology farmers use everyday to increase profit for minimal expenses, making the farm life more forgiving.</p>
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
