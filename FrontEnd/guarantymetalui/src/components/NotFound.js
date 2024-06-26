
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css'; 

const NotFound = ({ setAuth }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    setAuth(false);
    const timer = setTimeout(() => navigate("/login"), 5000); 
    return () => clearTimeout(timer);
  }, [navigate, setAuth]);

  return (
    <div className="not-found-container">
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-message">The page you're looking for does not exist or has been moved.</p>
      <p className="not-found-message">You will be redirected to the login page shortly.</p>
      <button onClick={() => navigate("/login")} className="not-found-button">Go to Login</button>
    </div>
  );
};

export default NotFound;
