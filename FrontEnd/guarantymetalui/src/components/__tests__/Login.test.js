// Import necessary libraries and mock fetch
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import { MemoryRouter } from 'react-router-dom'; // If your component uses <Link />
import { toast } from 'react-toastify'; // If you're testing toast notifications
import Login from '../Login'; // Adjust the import path as necessary

beforeAll(() => {
fetchMock.enableMocks();
});

beforeEach(() => {
fetchMock.resetMocks();
});

// Updated test case to use MemoryRouter for rendering the Login component
test('renders login form', () => {
    render(
        <MemoryRouter>
            <Login setAuth={() => {}} setIsLoading={() => {}} />
        </MemoryRouter>
    );
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
});


test('handles successful login', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ token: "fakeToken" }));

    render(
    <MemoryRouter>
        <Login setAuth={() => {}} setIsLoading={() => {}} />
    </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/login`, expect.anything()));
});

test('handles unsuccessful login', async () => {
    fetchMock.mockResponseOnce(JSON.stringify("Login Failed"), { status: 401 });

    render(
        <MemoryRouter>
        <Login setAuth={() => {}} setIsLoading={() => {}} />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
});
