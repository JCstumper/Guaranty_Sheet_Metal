import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './BarCard.css';

// Sample data
const data = [
  { name: 'Round End Cap', inStock: 4000, outOfStock: 2400 },
  { name: 'Round Hanger', inStock: 3000, outOfStock: 1398 },
  { name: 'Downspout', inStock: 2000, outOfStock: 9800 },
  { name: 'Elbow 40 Degree', inStock: 2780, outOfStock: 3908 },
  { name: 'Drop Outlet', inStock: 1890, outOfStock: 4800 },
  { name: 'Inline Cleanout', inStock: 2390, outOfStock: 3800 },
  { name: 'Wire Strainer', inStock: 3490, outOfStock: 4300 },
  { name: 'Y Connector', inStock: 2000, outOfStock: 3000 },
];

const GraphCard = () => (
  <div className="graph">
    <h2>Inventory Status</h2>
    <BarChart width={600} height={300} data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="inStock" fill="green" />
      <Bar dataKey="outOfStock" fill="red" />
    </BarChart>
  </div>
);

export default GraphCard;
