import React, { useState } from "react";
import { useNavigate, Link, redirect } from "react-router-dom";
import { Bounce, toast } from 'react-toastify';
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

            if(parseRes.token) {
                setAuth(true);
                toast.success("Registered Successfully!", options); 

                return navigate('/login');
            }
            else {
                setAuth(false);
                toast.error(parseRes, options);
            }
            
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
                    type="e-mail"
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
            <Link to="/login">
                Already have an account? Login
            </Link>
        </div>
    );
};

export default Register;
