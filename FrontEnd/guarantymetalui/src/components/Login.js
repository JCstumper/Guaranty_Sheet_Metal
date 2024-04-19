import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';
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
                    checkInitialSetup(); // Check initial setup completion after successful login
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

    const checkInitialSetup = async () => {
        try {
            const setupResponse = await fetch(`${API_BASE_URL}/auth/check-initial-setup`);
            const setupData = await setupResponse.json();
            if (!setupData.initialSetupComplete) {
                setShowInitialSetup(true);
            }
        } catch (error) {
            console.error('Failed to check initial setup:', error);
        }
    };

    useEffect(() => {
        checkInitialSetup(); // Check right after component mounts
    }, []);
    

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
                </form>
            </div>
            <InitialSetupModal // Render InitialSetupModal conditionally
                showInitialSetup={showInitialSetup}
                setShowInitialSetup={setShowInitialSetup}
                API_BASE_URL={API_BASE_URL}
            />
        </Fragment>
    );
};

export default Login;
