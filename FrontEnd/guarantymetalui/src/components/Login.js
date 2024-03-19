import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import './Login.css';
import logo from '../pictures/logo.png';
import Loading from './Loading';

const Login = ({ setAuth, setIsLoading }) => {
    const [inputs, setInputs] = useState({ username: "", password: "" });

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

            const response = await fetch("https://localhost/api/auth/login", {
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

    return (
        <Fragment>
<<<<<<< HEAD
        <div className='login-page-container'>
=======
            {<Loading />}
>>>>>>> origin/main
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
        </div>
        </Fragment>
    );
};

export default Login;
