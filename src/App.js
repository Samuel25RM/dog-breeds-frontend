import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [breeds, setBreeds] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        // In production, this would be an environment variable
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${apiUrl}/api/breeds`);
        setBreeds(response.data.message);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching breeds:', err);
        setError('Failed to fetch dog breeds. Please try again later.');
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dog Breeds List</h1>
      </header>
      <main>
        <div className="breeds-container">
          {Object.keys(breeds).length === 0 ? (
            <p>No breeds found</p>
          ) : (
            <ul className="breeds-list">
              {Object.keys(breeds).map((breed) => (
                <li key={breed} className="breed-item">
                  <h2>{breed.charAt(0).toUpperCase() + breed.slice(1)}</h2>
                  {breeds[breed].length > 0 && (
                    <ul className="sub-breeds">
                      {breeds[breed].map((subBreed) => (
                        <li key={`${breed}-${subBreed}`} className="sub-breed-item">
                          {subBreed.charAt(0).toUpperCase() + subBreed.slice(1)}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <footer>
        <p>Data provided by <a href="https://dog.ceo/dog-api/" target="_blank" rel="noopener noreferrer">Dog CEO</a></p>
      </footer>
    </div>
  );
}

export default App;