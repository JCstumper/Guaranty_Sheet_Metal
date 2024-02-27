import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css'; // Importing the new CSS file for the register page
import logo from '../pictures/logo.png'; // Assuming the same logo is used

const Register = ({ setAuth }) => {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        username: "",
        password: "",
        email: ""
    });

    const { username, password, email } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();

        try {
            const body = { username, password, email };
            
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            setAuth(true);
            
            navigate('/login'); // Use navigate for SPA behavior
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="register-container"> {/* Updated class name */}
            <div className="logo-container">
                <img src={logo} alt="Company Logo" className="company-logo" />
            </div>
            <form className="register-form" onSubmit={onSubmitForm}> {/* Updated class name */}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="register-input" 
                    value={username}
                    onChange={onChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="register-input" 
                    value={password}
                    onChange={onChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="register-input"
                    value={email}
                    onChange={onChange}
                />
                <button type="submit" className="register-button"> {/* Updated class name */}
                    Register
                </button>
            </form>
            <a href="/login" className="back-to-login"> {/* Updated class name */}
                Already have an account? Login
            </a>
        </div>
    );
};

export default Register;
