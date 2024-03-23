import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './BarCard.css';

// Sample data
const data = [
  { name: 'Item 1', inStock: 4000, outOfStock: 2400 },
  { name: 'Item 2', inStock: 3000, outOfStock: 1398 },
  { name: 'Item 3', inStock: 2000, outOfStock: 9800 },
  { name: 'Item 4', inStock: 2780, outOfStock: 3908 },
  { name: 'Item 5', inStock: 1890, outOfStock: 4800 },
  { name: 'Item 6', inStock: 2390, outOfStock: 3800 },
  { name: 'Item 7', inStock: 3490, outOfStock: 4300 },
  { name: 'Item 8', inStock: 2000, outOfStock: 3000 },
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
