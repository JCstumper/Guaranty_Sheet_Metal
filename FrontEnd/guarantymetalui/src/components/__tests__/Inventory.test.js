import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Inventory from '../../Inventory'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
import { MemoryRouter } from 'react-router-dom';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

test('renders the inventory component', () => {
    render(
        <MemoryRouter>
            <Inventory />
        </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Search for products...')).toBeInTheDocument();
});

describe('Inventory modal', () => {
    it('switches between manual input and file upload', async () => {
        render(
            <MemoryRouter>
                <Inventory />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('+'));
        
        expect(screen.getByPlaceholderText('Part Number')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Switch to Upload'));

        expect(screen.getByText('Upload Excel File')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Switch to Manual Input'));
        expect(screen.getByPlaceholderText('Part Number')).toBeInTheDocument();
    });
});
