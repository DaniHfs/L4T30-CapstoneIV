const { expect } = require('chai');
const axios = require('axios');
const nock = require('nock');

// Test suite for the GET /api/users/:username endpoint
describe('GET /api/users/:username', () => {

  // Test case: should return user data if username exists
  it('should return user data if username exists', async () => {
    // Mock the API request using nock
    nock('http://localhost')
      .get('/api/users/testuser')
      .reply(200, {
        user: {
          login: 'testuser',
          html_url: 'https://github.com/testuser',
          bio: 'Test bio',
        },
        repos: [],
      });

    // Send a GET request to the API
    const response = await axios.get('http://localhost/api/users/testuser');

    // Perform assertions on the response
    expect(response.status).to.equal(200);
    expect(response.data).to.deep.equal({
      user: {
        login: 'testuser',
        html_url: 'https://github.com/testuser',
        bio: 'Test bio',
      },
      repos: [],
    });
  });

  // Test case: should return a 404 error if username does not exist
  it('should return a 404 error if username does not exist', async () => {
    // Mock the API request using nock
    nock('http://localhost')
      .get('/api/users/thisuserdoesnotexist')
      .reply(404, { error: 'User not found' });

    let error = null;
    try {
      // Send a GET request to the API
      await axios.get('http://localhost/api/users/thisuserdoesnotexist');
    } catch (err) {
      error = err;
    }

    // Perform assertions on the error response
    expect(error.response.status).to.equal(404);
    expect(error.response.data).to.deep.equal({ error: 'User not found' });
  });
});
