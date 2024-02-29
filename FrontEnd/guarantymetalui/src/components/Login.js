import React, { Fragment, useState } from 'react'; // Importing React and useState hook for state management
import { Link } from 'react-router-dom'; // Importing Link for navigation without page refresh
import { Bounce, toast } from 'react-toastify'; // Importing toastify for displaying notifications
import './LoginPage.css'; // Importing CSS for styling the login page
import logo from '../pictures/logo.png'; // Importing the logo image

// Login component with setAuth prop for managing authentication state
const Login = ({ setAuth }) => {
    
    // State for managing input fields (username and password)
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    });

    // Destructuring inputs for easy access
    const { username, password } = inputs;

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
            const body = { username, password };

            // Making a POST request to the login endpoint
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            // Parsing the JSON response
            const parseRes = await response.json();

            // Checking if login was successful (based on token presence)
            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token); // Storing the token in local storage
                setAuth(true); // Setting authentication state to true
                toast.success("Login Successful!", options); // Displaying success notification
            } else {
                setAuth(false); // Setting authentication state to false if login fails
                toast.error(parseRes, options); // Displaying error notification
            }
        } catch (err) {
            console.error(err.message); // Logging any errors to the console
        }
    }

    // Rendering the login form
    return (
        <Fragment>
            <div className="login-container">
                <div className="logo-container">
                    <img src={logo} alt="Company Logo" className="company-logo" />
                </div>
                <form className="login-form" onSubmit={onSubmitForm}>
                    <input 
                        type="username"
                        name="username"
                        placeholder="Username"
                        className="login-input"
                        value={username}
                        onChange={e => onChange(e)} // Updating state on input change
                    />
                    <input 
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="login-input"
                        value={password}
                        onChange={e => onChange(e)} // Updating state on input change
                    />
                    <button type="submit" className="login-button">Login</button>
                    <a href="#" className="forgot-password">Forgot Password?</a>
                </form>
                <Link to="/register">Register</Link>
            </div>
        </Fragment>
    );
};

export default Login; // Exporting the Login component for use elsewhere
