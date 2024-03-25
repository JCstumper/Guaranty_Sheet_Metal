import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Topbar from '../topbar';
import Login from '../Login';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
    localStorage.clear();
    jest.clearAllMocks(); // Clear mocks to ensure a clean slate for each test
});

jest.mock('../LogoutConfirmation', () => ({ isOpen, onConfirm, onCancel }) => 
    isOpen ? (
        <div>
            <div>Are you sure you want to log out?</div>
            <button onClick={onConfirm}>Log Out</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    ) : null
);



describe('Topbar Component', () => {
    test('renders with username and navigation links', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ username: 'TestUser' }));
    
        render(
            <Router>
                <Topbar setAuth={() => {}} />
            </Router>
        );
    
        // Check for the presence of logos
        const logos = screen.getAllByAltText('Logo');
        expect(logos.length).toBeGreaterThanOrEqual(1); // Adjust this number based on how many logos you expect
    
        // Check for navigation links
        expect(screen.getByText('DASHBOARD')).toBeInTheDocument();
        expect(screen.getByText('INVENTORY')).toBeInTheDocument();
        expect(screen.getByText('PURCHASES')).toBeInTheDocument();
        expect(screen.getByText('JOBS')).toBeInTheDocument();
        expect(screen.getByText('SETTINGS')).toBeInTheDocument();
    
        // Check for the username
        await screen.findByText('TestUser'); // Assumes username is fetched and displayed
    });
    

    test('opens and closes the logout confirmation modal', async () => {
        render(
            <Router>
                <Topbar setAuth={() => {}} />
            </Router>
        );
    
        fireEvent.click(screen.getByRole('button', { name: /logout/i }));
        expect(screen.getByText('Are you sure you want to log out?')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Cancel'));
        
        expect(screen.queryByText('Are you sure you want to log out?')).not.toBeInTheDocument();
    });
    
    

    test('handles logout process and redirects to login', async () => {
        const mockSetAuth = jest.fn();
    
        render(
            <Router>
                <Topbar setAuth={() => {}} />
            </Router>
        );
    
        fireEvent.click(screen.getByLabelText(/logout/i));
    
        const logOutButton = await screen.findByRole('button', { name: /log out/i });
        fireEvent.click(logOutButton);

        await waitFor(() => expect(mockSetAuth).toHaveBeenCalledWith(false));
    
        await waitFor(() => expect(screen.getByText(/login page specific text or element/i)).toBeInTheDocument());
    });
});
