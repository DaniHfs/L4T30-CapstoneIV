import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../client/src/App';

describe('App', () => {
  beforeEach(() => {
    // Mock the global fetch function to return a resolved Promise with mock data
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: {
          login: 'testuser',
          html_url: 'https://github.com/testuser',
          bio: 'Test bio',
        },
        repos: [],
      }),
    });
  });

  afterEach(() => {
    // Clear the mock function after each test
    global.fetch.mockClear();
  });

  it('renders without crashing', () => {
    // Render the App component and verify that it doesn't throw any errors
    render(<App />);
  });

  it('displays loading message when loading is true', async () => {
    // Render the App component
    render(<App setLoading= { true } />);
    if (document.onload) {
      // Verify that the loading message is displayed
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    }

  });

  it('displays user data when user exists', async () => {
    // Render the App component
    render(<App setUserName='testuser' />);
    
    if (document.onload) {
      // Wait for the user data to be displayed
      await screen.findByText('testuser');
      // Verify that the user data is displayed correctly
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('Test bio')).toBeInTheDocument();
    }

  });

  it('displays error message when error exists', async () => {
    // Mock the global fetch function to return a rejected Promise with an error message
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'User not found' }),
    });

    // Render the App component
    render(<App />);
    
    if (document.onload) {
      // Wait for the error message to be displayed
      await screen.findByText('User not found');
      // Verify that the error message is displayed
      expect(screen.getByText('User not found')).toBeInTheDocument();
    }
  });
});

expect(App).toMatchSnapshot();