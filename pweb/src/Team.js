import React from 'react';
import './Team.css';

function Team() {
    return (
        <div className="team-container">
            <h2 className="team-title">Team Members</h2>

            <div className="member">
                <img src={`${process.env.PUBLIC_URL}/carneypfp.jpg`} alt="Jacob Carney Profile Picture" className="profile-pic"/>
                <h3>Jacob Carney</h3>
                <p><strong>Hometown:</strong> Mount Airy, Maryland</p>
                <p><strong>Contact:</strong> <a href="mailto:jmcarney@crimson.ua.edu">jmcarney@crimson.ua.edu</a>, <a href="tel:+14432891370">443 289 1370</a></p>
                <p>Hi, I'm Jacob Carney, a first-generation computer scientist studying at the University of Alabama. Being the first in my family to enter this field, I'm eager to carve my own path in the world of Agricultural Computer Science.</p>
                
                <p>Outside of my academic pursuits, hunting offers me a sense of tranquility. I'm also fan of ice hockey, enjoying teamwork of the game. And when I'm not outdoors or on the ice, you'll likely find me gaming.</p>
                
                <p>I am trying to find my way through life, not forgetting my roots. My goal is to find ways to expand the technology farmers use everyday to increase profit for minimal expenses, making the farm life more forgiving.</p>
            </div>

            <div className="member">
                <img src={`${process.env.PUBLIC_URL}/masonpfp.jpg`} alt="Mason Wittkofski Profile Picture" className="profile-pic" />
                <h3>Mason Wittkofski</h3>
                <p><strong>Hometown:</strong> Minooka, Illinois</p>
                <p><strong>Contact:</strong> <a href="mailto:mjwittkofski@crimson.ua.edu">mjwittkofski@crimson.ua.edu</a>, <a href="tel:+18159784333">815 978 4333</a></p>
                <p>Hey, I'm Mason Wittkofski, a student at the University of Alabama pursuing a bachelor's degree in Computer Science. I'm excited to continue on my path to the professional world of software engineering.</p>

                <p>On my own time, I enjoy watching a multitude of sports, playing video games, and doing some light cooking. Professionally I hope to climb the ranks of software engineering as quickly as possible and learn as much as I can.</p>
            </div>

            <div className="member">
                <img src={`${process.env.PUBLIC_URL}/Michalpfp.jpg`} alt="Michal Zajac Profile Picture" className="profile-pic" />
                <h3>Michal Zajac</h3>
                <p><strong>Hometown:</strong> Palos Heights, Illinois</p>
                <p><strong>Contact:</strong> <a href="mailto:mpzajac@crimson.ua.edu">mpzajac@crimson.ua.edu</a>, <a href="tel:+17084153771">708 415 3771</a></p>
                <p> My name is Michal Zajac and I am a Computer Science + MBA student at the University of Alabama. </p>

                <p> I enjoy socializing with new people and friends along with playing soccer. I like to learn new things and create new experiences. I plan on using my technical and communications skillset to become a business leader in the CS field.</p>
            </div>

            <div className="member">
                <img src={`${process.env.PUBLIC_URL}/wkpfp.jpg`} alt="Waleed Kambal Profile Picture" className="profile-pic"/>
                <h3>Waleed Kambal</h3>
                <p><strong>Hometown:</strong> Madison, AL</p>
                <p><strong>Contact:</strong> <a href="mailto:wmkambal@crimson.ua.edu">wmkambal@crimson.ua.edu</a>, <a href="tel:+12564687782">256 468 7782</a></p>
                <p> My name is Waleed Kambal, known as Wally, and I like to explore new places and try new foods whenever I can.</p>

                <p> More often than I would like to admit, I prefer spending my free time trying to workout, playing games, or trying to learn and research the newest tech on the market.</p>

    
                
            </div>

            <div className="member">
                <img src={`${process.env.PUBLIC_URL}/brandon.jpeg`} alt="Brandon Bejarano Profile Picture" className="profile-pic"/>   
                <h3>Brandon Bejarano</h3>
                <p><strong>Hometown:</strong> Alabaster, AL</p>
                <p><strong>Contact:</strong> <a href="mailto:babejaranorincon@crimson.ua.edu">babejaranorincon@crimson.ua.edu</a>, <a href="tel:+12052677887">205 267 7887</a></p>
                <p>Hello, I'm Brandon Bejarano and I am the first in my family to pursue a college degree. Currently, I am studying Computer Science at the University of Alabama, where I am learning the wonders of coding and digital innovation.</p>
            
                <p>Beyond the screen, I find comfort and joy in physical activities. Whether it's lifting weights at the gym, hitting the pavement for a run, or exploring nature through hikes, I thrive on the sense of accomplishment that comes pushing my limits.</p>

                <p>However, what really drives me is the opportunity to give back to my family. Their unwavering support and sacrifices have shaped me into who I am today. Whether it's helping around the house, offering guidance, or simply being there when they need me, I enjoy every moment with them and will always be grateful for the amazing opportunity they gave me to pursue my education.</p>
            </div>
        </div>
    );
}

export default Team;
