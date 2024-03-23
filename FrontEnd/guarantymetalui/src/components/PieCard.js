import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './PieCard.css'; // Assuming you have a CSS file for styling

// Sample data for the pie chart
const data = [
  { name: "Residential Roofing", value: 400000 },
  { name: "Commercial Roofing", value: 300000 },
  { name: "Roof Repair", value: 200000 },
  { name: "Gutter Services", value: 100000 },
];

// Colors for each pie section
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieCard = () => (
  <div className="graph">
    <h2>Revenue Breakdown</h2>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default PieCard;
