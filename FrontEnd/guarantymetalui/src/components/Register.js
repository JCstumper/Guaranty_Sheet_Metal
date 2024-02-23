import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom";

const Register = ({setAuth}) => {
    
    const [inputs, setInputs] = useState ({
        username: "",
        password: "",
        email: ""
    });

    const {username, password, email} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value});
    };

    const onSubmitForm = async (e) => {
        e.preventDefault()

        try {

            const body = {username, password, email};
            
            const response = await fetch("http://localhost:4000/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"}
                ,
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            // console.log(parseRes);

            // localStorage.setItem("token", parseRes.token);

            setAuth(true);

            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);


        } catch (err) {
            console.error(err.message);
        }
    }
    
    return (
        <Fragment>
            <h1 className="text-center my-5">Register</h1>
            <form onSubmit={onSubmitForm}>
                <input 
                    type="username" 
                    name="username" 
                    placeholder="Username" 
                    className="form-control my-3" 
                    value={username} 
                    onChange={e => onChange(e)} 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className="form-control my-3" 
                    value={password} 
                    onChange={e => onChange(e)}
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    className="form-control my-3" 
                    value={email} 
                    onChange={e => onChange(e)}
                />
                <button className="btn btn-success btn-block" >Submit</button>
            </form>
            <Link to="/login">Login</Link>
        </Fragment>
    );
};

export default Register;