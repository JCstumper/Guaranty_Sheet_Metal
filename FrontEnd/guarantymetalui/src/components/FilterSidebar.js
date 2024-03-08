import React from 'react';
import './FilterSidebar.css'; // Import the CSS file for styling

const FilterSidebar = () => {
    return (
        <div className="filter-sidebar">
            <h2>Filter</h2>
            <div className="filter-options">
                {/* Add your filter options here */}
                <label>
                    <input type="checkbox" /> Option 1
                </label>
                <label>
                    <input type="checkbox" /> Option 2
                </label>
                <label>
                    <input type="checkbox" /> Option 3
                </label>
            </div>
        </div>
    );
};

export default FilterSidebar;
