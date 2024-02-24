import React, { Fragment, useState, useEffect} from 'react';
import './HomePage.css';
import logo from "./pictures/logo.png";
import account from "./pictures/testacc.png";
import ButtonList from './components/ButtonList';

const Dashboard = ({setAuth}) => {
    
    const [userName, setName] = useState("")

    async function getName() {
        try {

            const response = await fetch("http://localhost:3000/dashboard", {
                method: "GET",
                headers: {token: localStorage.token}
            });

            const parseRes = await response.json();

            // console.log(parseRes);

            setName(parseRes.username);
            
        } catch (err) {
            console.error(err.message);
        }
    }

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
    }


    useEffect(() => {
        getName();
    }, []);
    
    return (
        <Fragment>
            <h1>Dashboard {userName}</h1>
            <button className="btn btn-primary" onClick={e => logout(e)}>Logout</button>
        </Fragment>
    );
};


const buttons = ['DASH', 'INVENTORY', 'ORDERS', 'CUSTOMERS'];

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState(buttons[0]); // Default to the first button as active

    return (
      <aside className='sidebar-container'>
        <a href="/">
          <img src={logo} alt="Icon" className="sidebar-image" />
        </a>
        <ButtonList buttons={buttons} activeTab={activeTab} setActiveTab={setActiveTab} />
        <button className="Account">
          <img src={account} alt="Person" style={{ width: '100%', height: 'auto' }} />
        </button>
      </aside>
    );
};
  
export default Sidebar;

