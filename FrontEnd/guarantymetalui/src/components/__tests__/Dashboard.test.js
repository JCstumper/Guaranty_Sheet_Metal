import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../Dashboard';
import Topbar from '../topbar';
import BarCard from '../BarCard';
import PieCard from '../PieCard';

// Optionally, mock sub-components if they are not central to what you're testing
jest.mock('../topbar', () => () => <div>TopbarMock</div>);
jest.mock('../BarCard', () => () => <div>BarCardMock</div>);
jest.mock('../PieCard', () => () => <div>PieCardMock</div>);

describe('Dashboard component tests', () => {
    it('renders the Dashboard with all elements', () => {
        render(<Dashboard setAuth={() => {}} />);

        // Verify Topbar is rendered
        expect(screen.getByText('TopbarMock')).toBeInTheDocument();

        // Check for the presence of static cards
        const cardsTitles = ['Customers', 'Sales', 'Products', 'Pending Jobs'];
        cardsTitles.forEach(title => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });

        // Verify specific card information is rendered
        expect(screen.getByText('172')).toBeInTheDocument(); // Customers
        expect(screen.getByText('376')).toBeInTheDocument(); // Sales
        expect(screen.getByText('579')).toBeInTheDocument(); // Products
        expect(screen.getByText('18')).toBeInTheDocument(); // Pending Jobs

        // Verify Graph components are rendered
        expect(screen.getByText('BarCardMock')).toBeInTheDocument();
        expect(screen.getByText('PieCardMock')).toBeInTheDocument();
    });
});
