import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
// Imports for api/middleware
import AUTHORIZATION from './Documentation/api/middleware/AUTHORIZATION.md';
import VALIDINFO from './Documentation/api/middleware/VALIDINFO.md';

// Imports for api/routes
import CATEGORIESAPI from './Documentation/api/routes/CATEGORIES.md';
import DASHBOARDAPI from './Documentation/api/routes/DASHBOARD.md';
import EDITPROFILEAPI from './Documentation/api/routes/EDITPROFILE.md';
import INVENTORYAPI from './Documentation/api/routes/INVENTORY.md';
import JOBSAPI from './Documentation/api/routes/JOBS.md';
import JWTAUTHAPI from './Documentation/api/routes/JWTAUTH.md';
import LOGSAPI from './Documentation/api/routes/LOGS.md';

// Imports for components
import ADDPARTMODAL from './Documentation/components/ADDPARTMODAL.md';
import ADDPRODUCT from './Documentation/components/ADDPRODUCT.md';
import ADDUSER from './Documentation/components/ADDUSER.md';
import AUTOREGISTER from './Documentation/components/AUTOREGISTER.md';
import BARCARD from './Documentation/components/BARCARD.md';
import CONFIRMUSERS from './Documentation/components/CONFIRMUSERS.md';
import DELETEPRODUCTMODAL from './Documentation/components/DELETEPRODUCTMODAL.md';
import EDITPRODUCTMODAL from './Documentation/components/EDITPRODUCTMODAL.md';
import EDITPROFILE from './Documentation/components/EDITPROFILE.md';
import EDITQUANTITY from './Documentation/components/EDITQUANTITY.md';
import INITIALSETUPMODAL from './Documentation/components/INITIALSETUPMODAL.md';
import LOADING from './Documentation/components/LOADING.md';
import LOGIN from './Documentation/components/LOGIN.md';
import LOGOUTCONFIRM from './Documentation/components/LOGOUTCONFIRMATION.md';
import MANAGEUSERS from './Documentation/components/MANAGEUSERS.md';
import NOTFOUND from './Documentation/components/NOTFOUND.md';
import PIECARD from './Documentation/components/PIECARD.md';
import REGISTER from './Documentation/components/REGISTER.md';
import TOPBAR from './Documentation/components/TOPBAR.md';

// Imports for pages
import APP from './Documentation/pages/APP.md';
import CUSTOMERS from './Documentation/pages/CUSTOMERS.md';
import INDEX from './Documentation/pages/INDEX.md';
import INVENTORY from './Documentation/pages/INVENTORY.md';
import LOGS from './Documentation/pages/LOGS.md';
import ORDERS from './Documentation/pages/ORDERS.md';

import './Documentation.css'

const markdownFiles = {
    // api/middleware
    'AUTHORIZATION': AUTHORIZATION,
    'VALIDINFO': VALIDINFO,
    // api/routes
    'CATEGORIESAPI': CATEGORIESAPI,
    'DASHBOARDAPI': DASHBOARDAPI,
    'EDITPROFILEAPI': EDITPROFILEAPI,
    'INVENTORYAPI': INVENTORYAPI,
    'JOBSAPI': JOBSAPI,
    'JWTAUTHAPI': JWTAUTHAPI,
    'LOGSAPI': LOGSAPI,
    // components
    'ADDPARTMODAL': ADDPARTMODAL,
    'ADDPRODUCT': ADDPRODUCT,
    'ADDUSER': ADDUSER,
    'AUTOREGISTER': AUTOREGISTER,
    'BARCARD': BARCARD,
    'CONFIRMUSERS': CONFIRMUSERS,
    'DELETEPRODUCTMODAL': DELETEPRODUCTMODAL,
    'EDITPRODUCTMODAL': EDITPRODUCTMODAL,
    'EDITPROFILE_COMPONENT': EDITPROFILE, // Renamed to avoid conflict with 'EDITPROFILE' from routes
    'EDITQUANTITY': EDITQUANTITY,
    'INITIALSETUPMODAL': INITIALSETUPMODAL,
    'LOADING': LOADING,
    'LOGIN': LOGIN,
    'LOGOUTCONFIRM': LOGOUTCONFIRM,
    'MANAGEUSERS': MANAGEUSERS,
    'NOTFOUND': NOTFOUND,
    'PIECARD': PIECARD,
    'REGISTER': REGISTER,
    'TOPBAR': TOPBAR,
    // pages
    'APP_PAGE': APP, // Renamed to avoid conflict with 'APP' from components
    'CUSTOMERS': CUSTOMERS,
    'INDEX': INDEX,
    'INVENTORY_PAGE': INVENTORY, // Renamed to avoid conflict with 'INVENTORY' from routes
    'LOGS_PAGE': LOGS, // Renamed to avoid conflict with 'LOGS' from routes
    'ORDERS': ORDERS,
};

function Documentation() {
    const [selectedFile, setSelectedFile] = useState('');
    const [markdownText, setMarkdownText] = useState('');

    const handleFileSelect = (fileName) => {
        setSelectedFile(fileName);
        fetch(markdownFiles[fileName])
            .then(response => response.text())
            .then(text => setMarkdownText(text))
            .catch(err => console.error('Error fetching markdown content:', err));
    };
    

    return (
        <div className="documentation-container">
            <div className="toc">
                <h3>Table of Contents</h3>
                <ul>
                    {Object.keys(markdownFiles).map(fileName => (
                        <li key={fileName}>
                            <button 
                                onClick={() => handleFileSelect(fileName)}
                                className={fileName === selectedFile ? 'active' : ''}
                            >
                                {fileName.replace('.md', '')}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="content">
                <ReactMarkdown className="react-markdown">
                    {markdownText}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default Documentation;
