import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Sidebar from './components/sidebar';
import './Inventory.css';

const Inventory = ({ setAuth }) => {
    // Expanded set of dummy data for various materials
    const initialMaterials = [
        { id: 'AL-001', material: 'Aluminum', description: 'Aluminum Gutter Section', count: 120, cost: '6.50', size: '12ft' },
        { id: 'CP-002', material: 'Copper', description: 'Copper Downspout', count: 75, cost: '15.00', size: '8ft' },
        { id: 'PL-003', material: 'Plastic', description: 'Plastic Gutter Guard', count: 200, cost: '2.25', size: '4ft' },
        { id: 'SS-004', material: 'Stainless Steel', description: 'Stainless Steel Gutter Mesh', count: 150, cost: '9.75', size: '5ft' },
        { id: 'AL-005', material: 'Aluminum', description: 'Aluminum Downspout Connector', count: 80, cost: '4.50', size: '2ft' },
        { id: 'CP-006', material: 'Copper', description: 'Copper End Cap', count: 90, cost: '12.00', size: 'N/A' },
        { id: 'PL-007', material: 'Plastic', description: 'Plastic Gutter Bracket', count: 250, cost: '1.80', size: 'N/A' },
        { id: 'SS-008', material: 'Stainless Steel', description: 'Stainless Steel Gutter Screws', count: 500, cost: '0.10', size: 'N/A' },
        { id: 'AL-009', material: 'Aluminum', description: 'Aluminum Gutter Hanger', count: 300, cost: '3.25', size: 'N/A' },
        { id: 'CP-010', material: 'Copper', description: 'Copper Gutter Strap', count: 150, cost: '7.00', size: 'N/A' },
        { id: 'PL-011', material: 'Plastic', description: 'Plastic Downspout Splash Block', count: 85, cost: '5.50', size: 'N/A' },
        { id: 'SS-012', material: 'Stainless Steel', description: 'Stainless Steel Joint Connector', count: 95, cost: '2.20', size: 'N/A' },
        { id: 'AL-013', material: 'Aluminum', description: 'Aluminum Gutter End Cap', count: 120, cost: '3.75', size: 'N/A' },
        { id: 'CP-014', material: 'Copper', description: 'Copper Gutter Corner', count: 65, cost: '18.50', size: 'N/A' },
        { id: 'PL-015', material: 'Plastic', description: 'Plastic Gutter Adapter', count: 180, cost: '2.90', size: 'N/A' },
        // Add more products here
        { id: 'SS-016', material: 'Stainless Steel', description: 'Stainless Steel Gutter Outlet', count: 100, cost: '4.75', size: 'N/A' },
        { id: 'AL-017', material: 'Aluminum', description: 'Aluminum Gutter Elbow', count: 110, cost: '5.25', size: 'N/A' },
        { id: 'CP-018', material: 'Copper', description: 'Copper Gutter Reducer', count: 70, cost: '10.80', size: 'N/A' },
        // Add more products as needed
    ];
    

     // Group materials by type
    const groupedMaterials = initialMaterials.reduce((acc, material) => {
        acc[material.material] = acc[material.material] || [];
        acc[material.material].push(material);
        return acc;
    }, {});

    // Convert grouped materials into an array for draggable
    const [materialGroups, setMaterialGroups] = useState(Object.keys(groupedMaterials).map((key, index) => ({
        id: `group-${key}-${index}`,
        material: key,
        items: groupedMaterials[key],
    })));

    const onDragEnd = (result) => {
        if (!result.destination) {
            return; // Dropped outside the list
        }
        const items = Array.from(materialGroups);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setMaterialGroups(items);
    };

    return (
        <div className="inventory">
            <Sidebar setAuth={setAuth} />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-material-groups">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="inventory-content">
                            {materialGroups.map((group, index) => (
                                <Draggable key={group.id} draggableId={group.id} index={index}>
                                    {(provided) => (
                                        <div 
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="material-table"
                                        >
                                            <div className="table-header">
                                                <span className="table-title">{group.material} Materials</span>
                                                <div className="table-actions">
                                                    <input type="text" placeholder="Search..." className="search-input" />
                                                    <button className="action-button">Filter</button>
                                                </div>
                                            </div>
                                            <table className="table-content">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Description</th>
                                                        <th>Count</th>
                                                        <th>Cost</th>
                                                        <th>Size</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {group.items.map(item => (
                                                        <tr key={item.id}>
                                                            <td>{item.id}</td>
                                                            <td>{item.description}</td>
                                                            <td>{item.count}</td>
                                                            <td>${item.cost}</td>
                                                            <td>{item.size}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Inventory;
