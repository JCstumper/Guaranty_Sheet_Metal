import { createRoot } from 'react-dom/client';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
    <div>
        <App />
        <ToastContainer />    
    </div>
);
