const express = require('express');
const axios = require('axios').default;
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(helmet());

// GitHub API endpoint
const BASE_URL = 'https://api.github.com';

// Set headers to prevent caching of API response
const setNoCacheHeaders = (res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
};

// Search users
app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Fetch user data from GitHub API
    const userResponse = await axios.get(`${BASE_URL}/users/${username}`);
    const reposResponse = await axios.get(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=2`);

    const user = userResponse.data; // Extract user data from the response
    
    // Extract relevant repo data from the response
    const repos = reposResponse.data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      created_at: repo.created_at,
      last_commit: repo.updated_at,
      description: repo.description,
    })); 

    // Fetch commit data for each repository
    const commitPromises = repos.map(async (repo) => {
      const commitResponse = await axios.get(`${BASE_URL}/repos/${username}/${repo.name}/commits?per_page=5`);
      
      // Extract relevant commit data from the response
      const commits = commitResponse.data.map((commit) => ({
        id: commit.sha,
        description: commit.commit.message,
      })); 
      repo.commits = commits; // Assign the commits to the corresponding repository
      return repo; // Return the updated repository
    });

    await Promise.all(commitPromises); // Wait for all commit requests to complete

    setNoCacheHeaders(res); // Set headers to prevent caching
    res.json({ user, repos }); // Return the user and repository data as a JSON response
  } catch (error) {
    res.status(404).json({ error: 'User not found' }); // Return a 404 error if the user is not found
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
