import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import './Login.css';
import logo from '../pictures/logo.png';
import Loading from './Loading';
import autoRegister from './autoRegister'; // Adjust the path as necessary
import { AppContext } from '../App';

const Login = ({ setAuth, setIsLoading }) => {
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const autoRegistered = useRef(false);
    const {API_BASE_URL} = useContext(AppContext);
    const { username, password } = inputs;

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
            const body = { username, password };
            setIsLoading(true);
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token);
                setTimeout(() => {
                    setIsLoading(false); 
                    setAuth(true);
                }, 2000);
                setTimeout(() => {
                    toast.success("Login Successful!", options);
                }, 1000);
            } else {
                setTimeout(() => {
                    setIsLoading(false); 
                    setAuth(false);
                }, 2000);
                setTimeout(() => {
                    toast.error(parseRes, options);
                }, 1000);
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        if (!autoRegistered.current) {
            autoRegister(setIsLoading, setAuth, toast, options);
            autoRegistered.current = true; // Mark as registered
        }
    }, [setIsLoading, setAuth, toast, options]); // Now effectively empty because functions don't change

    return (
        <Fragment>
            {<Loading />}
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
                        onChange={e => onChange(e)}
                    />
                    <input 
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="login-input"
                        value={password}
                        onChange={e => onChange(e)}
                    />
                    <button type="submit" className="login-button">Login</button>
                    <a href="#" className="forgot-password">Forgot Password?</a>
                </form>
                <Link to="/register">Register</Link>
            </div>
        </Fragment>
    );
};

export default Login;
