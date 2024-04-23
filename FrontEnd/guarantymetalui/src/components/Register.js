import React, { Fragment, useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom"; 
import { Bounce, toast } from 'react-toastify'; 
import './Register.css'; 
import logo from '../pictures/logo.png'; 
import Loading from './Loading';
import { AppContext } from '../App';


const Register = ({ setAuth }) => {
    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false);
    const {API_BASE_URL} = useContext(AppContext);

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
            setIsLoading(true);

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            if (parseRes.token) {
                setAuth(false); 
                setTimeout(() => {
                    setIsLoading(false); 
                }, 2000);
                setTimeout(() => {
                    toast.success("Registered Successfully!", options); 
                }, 1000);
                navigate('/login'); 
            } else {
                setTimeout(() => {
                    setIsLoading(false); 
                }, 2000); 
                setTimeout(() => {
                    toast.error(parseRes, options); 
                }, 1000);
            }
        } catch (err) {
            console.error(err.message); 
        }
    };

    
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

export default Register; 
