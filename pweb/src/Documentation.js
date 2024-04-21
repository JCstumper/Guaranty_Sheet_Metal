import React, { Component, useState } from 'react';
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
import REGISTER from './Documentation/components/REGISTER.md';
import TOPBAR from './Documentation/components/TOPBAR.md';

// Imports for pages
import APP from './Documentation/pages/APP.md';
import CUSTOMERS from './Documentation/pages/CUSTOMERS.md';
import INDEX from './Documentation/pages/INDEX.md';
import INVENTORY from './Documentation/pages/INVENTORY.md';
import LOGS from './Documentation/pages/LOGS.md';
import ORDERS from './Documentation/pages/ORDERS.md';

// Imports for nginx
import PRODUCTIONTEMPLATE from './Documentation/nginx/NGINX.CONF.PRODUCTIONTEMPLATE.md';
import GENERATECERTS from './Documentation/nginx/GENERATE-CERTS.md';
import TEMPLATE from './Documentation/nginx/NGINX.CONF.TEMPLATE.md';
import STARTUP from './Documentation/nginx/STARTUP.md';
import STARTUPPRODUCTION from './Documentation/nginx/STARTUPPRODUCTION.md';

//Required files for our PWEB

import Software from './Documentation/Software.md';
import Features from './Documentation/Features.md';
import Modify from './Documentation/Modify.md';
import FAQS from './Documentation/FAQS.md';



import './Documentation.css'




const markdownFiles = {
    // api/middleware
    api: {
        middleware: {
        'AUTHORIZATION': AUTHORIZATION,
        'VALIDINFO': VALIDINFO,
        },
    
        routes:{
        // api/routes
        'CATEGORIESAPI': CATEGORIESAPI,
        'DASHBOARDAPI': DASHBOARDAPI,
        'EDITPROFILEAPI': EDITPROFILEAPI,
        'INVENTORYAPI': INVENTORYAPI,
        'JOBSAPI': JOBSAPI,
        'JWTAUTHAPI': JWTAUTHAPI,
        'LOGSAPI': LOGSAPI,
        },
    },

    components: {
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
        'REGISTER': REGISTER,
        'TOPBAR': TOPBAR,
    },

    pages:{
    // pages
        'APP_PAGE': APP, // Renamed to avoid conflict with 'APP' from components
        'CUSTOMERS': CUSTOMERS,
        'INDEX': INDEX,
        'INVENTORY_PAGE': INVENTORY, // Renamed to avoid conflict with 'INVENTORY' from routes
        'LOGS_PAGE': LOGS, // Renamed to avoid conflict with 'LOGS' from routes
        'ORDERS': ORDERS,
    },

    nginx:{
        'PRODUCTION_TEMPLATE': PRODUCTIONTEMPLATE, // Renamed for clarity
        'GENERATE_CERTS': GENERATECERTS, // Renamed for consistency with naming convention
        'TEMPLATE_PAGE': TEMPLATE, // Renamed to avoid conflict with 'TEMPLATE' from components
        'STARTUP_SCRIPT': STARTUP, // Renamed to distinguish type of startup
        'STARTUP_PRODUCTION_SCRIPT': STARTUPPRODUCTION // Renamed for clarity and distinction
    },
    

    required:{
    'SOFTWARE': Software,
    'FEATURES': Features,
    'MODIFY': Modify,
    'FAQS': FAQS,
    },
};

function Documentation() {
    const [expandedSections, setExpandedSections] = useState({});
    const [selectedFile, setSelectedFile] = useState('');
    const [markdownText, setMarkdownText] = useState('');

    const handleFileSelect = (filePath) => {
        fetch(filePath)
            .then(response => response.text())
            .then(text => setMarkdownText(text))
            .catch(err => console.error('Error fetching markdown content:', err));
        setSelectedFile(filePath); // Update the selected file path for active styling
    };

    const toggleSection = (sectionPath) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionPath]: !prev[sectionPath]
        }));
    };
    function renderGroup(group, path = [], level = 0) {
        return Object.entries(group).map(([key, value]) => {
            const currentPath = path.concat(key).join('.');
            const isExpanded = expandedSections[currentPath];
            const headerStyle = {
                paddingLeft: `${level * 5}px`, // Increase padding for headers based on depth level
                cursor: 'pointer'
            };
            const itemStyle = {
                paddingLeft: `${level * 1 + 5}px`, // Items are further indented than headers
            };
    
            if (typeof value === 'object') {
                return (
                    <div key={key}>
                        <h4 style={headerStyle} onClick={() => toggleSection(currentPath)}>
                            {key.toUpperCase()} {isExpanded ? '-' : '+'}
                        </h4>
                        {isExpanded && <ul>{renderGroup(value, path.concat(key), level + 1)}</ul>}
                    </div>
                );
            } else {
                // It's a file, render a clickable button
                return (
                    <li key={key} style={itemStyle}>
                        <button
                            onClick={() => handleFileSelect(value)}
                            className={value === selectedFile ? 'active' : ''}
                        >
                            {key.replace('.md', '')}
                        </button>
                    </li>
                );
            }
        });
    }
    
    
    return (
        <div className="documentation-container">
            <div className="toc">
                <h3>Table of Contents</h3>
                {renderGroup(markdownFiles)}
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
