import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom"; // Importing useNavigate for programmatic navigation and Link for declarative navigation
import { Bounce, toast } from 'react-toastify'; // Importing toastify for displaying notifications
import './Register.css'; // Import CSS for styling the register page
import logo from '../pictures/logo.png'; // Import the logo for the register page
import Loading from './Loading';

// Register component with setAuth prop for managing authentication state
const Register = ({ setAuth, API_BASE_URL }) => {
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [isLoading, setIsLoading] = useState(false);

    // State for managing input fields (username, password, email)
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
        email: ""
    });

    // Destructuring inputs for easy access
    const { username, password, email } = inputs;

    // Function to update state based on input changes
    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    // Toastify options for customizing notifications
    const options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    // Function to handle form submission
    const onSubmitForm = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            // Preparing the body for the POST request
            const body = { username, password, email };
            setIsLoading(true);
            
            // Making a POST request to the register endpoint
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            // Parsing the JSON response
            const parseRes = await response.json();

            // Checking if registration was successful (based on token presence)
            if (parseRes.token) {
                setAuth(false); // Setting authentication state to true
                setTimeout(() => {
                    setIsLoading(false); 
                }, 2000);
                setTimeout(() => {
                    toast.success("Registered Successfully!", options); // Displaying success notification
                }, 1000);
                navigate('/login'); // Navigating to login page after successful registration
            } else {
                setTimeout(() => {
                    setIsLoading(false); 
                }, 2000); // Setting authentication state to false if registration fails
                setTimeout(() => {
                    toast.error(parseRes, options); // Displaying error notification
                }, 1000);
            }
        } catch (err) {
            console.error(err.message); // Logging any errors to the console
        }
    };

    // Rendering the registration form
    return (
        <Fragment>
            {<Loading />}
                <div className="register-container">
                    <div className="logo-container">
                        <img src={logo} alt="Company Logo" className="company-logo" />
                    </div>
                    <form className="register-form" onSubmit={onSubmitForm}>
                        {/* Input fields for username, password, and email */}
                        <input type="text" name="username" placeholder="Username" className="register-input" value={username} onChange={onChange} />
                        <input type="password" name="password" placeholder="Password" className="register-input" value={password} onChange={onChange} />
                        <input type="e-mail" name="email" placeholder="Email" className="register-input" value={email} onChange={onChange} />
                        <button type="submit" className="register-button">Register</button>
                    </form>
                    <Link to="/login">Already have an account? Login</Link>
                </div>
        </Fragment>
    );
};

export default Register; // Exporting the Register component for use elsewhere
