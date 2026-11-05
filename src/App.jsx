import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    setError("");
    setUserData(null);

    if (trimmed === "") {
      setError("Please enter a GitHub username.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${trimmed}`);
      if (!res.ok) {
        setError("User not found");
        return;
      }
      const data = await res.json();
      setUserData(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>GitHub User Finder</h1>
        <p className="subtitle">Search a GitHub username to see profile details.</p>

        <form onSubmit={handleSearch} className="search-row">
          <input
            type="text"
            name="username"
            placeholder="e.g. torvalds, gaearon, octocat"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Loading...</p>}

        {!userData && !error && !loading && (
          <p className="empty-state">No user yet. Try searching for "octocat".</p>
        )}

        {userData && (
          <div className="user-result">
            <img src={userData.avatar_url} alt={userData.login} className="avatar" />
            <div className="user-info">
              <div className="name-row">
                <h2>{userData.name || userData.login}</h2>
                <span className="login">@{userData.login}</span>
              </div>
              <div className="pills">
                <span><b>{userData.public_repos}</b> Repos</span>
                <span><b>{userData.followers}</b> Followers</span>
                <span><b>{userData.following}</b> Following</span>
              </div>
              <div className="meta-row">
                {userData.location && <span>📍 {userData.location}</span>}
                {userData.company && <span>🏢 {userData.company}</span>}
                {userData.blog && (
                  <a href={userData.blog.startsWith("http") ? userData.blog : `https://${userData.blog}`} target="_blank" rel="noreferrer">
                    🔗 {userData.blog}
                  </a>
                )}
                <a href={userData.html_url} target="_blank" rel="noreferrer">
                  🎉 View on GitHub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;