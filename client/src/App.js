import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle the search for a GitHub user
  const handleSearch = async () => {
    if (username.trim() !== '') {
      setLoading(true);
      setUser(null); // Reset the user data
      setError(null); // Reset the error message
      try {
        const timestamp = Date.now(); // Generate a cache-busting parameter
        const response = await fetch(`/api/users/${username}?timestamp=${timestamp}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set the user data if the response is successful
        } else if (response.status === 403) {
          setError('API rate limit exceeded. Please try again later.'); // Handle rate limit exceeded error
        } else {
          setError('No user found.'); // Set the error message if the user is not found
        }
      } catch (error) {
        setError('Error occurred. Please try again.'); // Set the error message if an error occurs during the API request
      } finally {
        setLoading(false); // Disable the loading state
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">GitHub User Search</h1>
      <div className="search-container">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} disabled={loading} className="search-button">
          Search
        </button>
      </div>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {user ? (
        <div className="user-container">
          <h2 className="user-name">
            <a href={user.user.html_url} target="_blank" rel="noopener noreferrer">
              {user.user.login}
            </a>
          </h2>
          <img src={user.user.avatar_url} alt="User Avatar" className="user-avatar" />
          <p className="user-bio">{user.user.bio}</p>
          {user.repos && user.repos.length > 0 ? (
            <ul className="repository-list">
              {user.repos.map((repo) => (
                <li key={repo.id} className="repository-item">
                  <h3 className="repository-name">{repo.name}</h3>
                  <p className="repository-date">Created at: {repo.created_at}</p>
                  <p className="repository-date">Last commit: {repo.last_commit}</p>
                  <p className="repository-description">Description: {repo.description}</p>
                  <ul className="commit-list">
                    {repo.commits.map((commit) => (
                      <li key={commit.id} className="commit-item">
                        {commit.description}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No repositories found.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default App;
