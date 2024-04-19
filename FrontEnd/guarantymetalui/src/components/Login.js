import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import './Login.css';
import logo from '../pictures/logo.png';
import Loading from './Loading';
import { AppContext } from '../App';
import InitialSetupModal from './InitialSetupModal'; // Import InitialSetupModal here

const Login = ({ setAuth, setIsLoading }) => {
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [showInitialSetup, setShowInitialSetup] = useState(false); // State for initial setup modal
    const { API_BASE_URL } = useContext(AppContext);
    const { username, password } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const parseRes = await response.json();
            setIsLoading(false);

            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token);
                setAuth(true);
                toast.success("Login Successful!", options);
            } else {
                setAuth(false);
                toast.error(parseRes, options);
            }
        } catch (err) {
            setIsLoading(false);
            console.error(err.message);
            toast.error("An error occurred during login.");
        }
    };

    const checkInitialSetup = async () => {
        const setupResponse = await fetch(`${API_BASE_URL}/auth/check-initial-setup`);
        const setupData = await setupResponse.json();
        setShowInitialSetup(!setupData.initialSetupComplete);
    };

    useEffect(() => {
        checkInitialSetup();
    }, []);

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

    return (
        <Fragment>
            {<Loading />}
            <InitialSetupModal
                showInitialSetup={showInitialSetup}
                setShowInitialSetup={setShowInitialSetup}
                API_BASE_URL={API_BASE_URL}
            />
            {!showInitialSetup && (
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
                            onChange={onChange}
                        />
                        <input 
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="login-input"
                            value={password}
                            onChange={onChange}
                        />
                        <button type="submit" className="login-button">Login</button>
                    </form>
                </div>
            )}
        </Fragment>
    );
};

export default Login;
