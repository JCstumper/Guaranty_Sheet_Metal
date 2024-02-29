import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import '../LoginPage.css';
import logo from '../pictures/logo.png';

const Login = ({setAuth}) => {
    
    const [inputs, setInputs] = useState ({
        username: "",
        password: ""
    });

    const {username, password} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value});
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
        e.preventDefault()

        try {

            const body = {username, password};

            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"}
                ,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            if(parseRes.token) {
                localStorage.setItem("token", parseRes.token);

                setAuth(true);      
                toast.success("Login Successful!", options);
            }
            else {
                setAuth(false);
                toast.error(parseRes, options);
            }


        } catch (err) {
            console.error(err.message);
        }
    }

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
                        // className="form-control my-3"
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