import React, { useState, useCallback } from 'react'; 
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './components/Login/Login.jsx';
import SearchPage from './components/Search/Search.jsx';
import FavoritesPage from './components/Favorite/Favorite.jsx';
import './App.css';

function App() {
  const [favoriteDogIds, setFavoriteDogIds] = useState(new Set()); 
  const navigate = useNavigate();

  const handleLike = useCallback(
    (dogId) => {
      // useCallback for handleLike
      const currentFavorites = new Set(favoriteDogIds);
      if (currentFavorites.has(dogId)) {
        currentFavorites.delete(dogId);
      } else {
        currentFavorites.add(dogId);
      }
      setFavoriteDogIds(currentFavorites);
    },
    [favoriteDogIds],
  ); 

  const isDogFavorite = useCallback(
    (dogId) => {
      // useCallback for isDogFavorite
      return favoriteDogIds.has(dogId);
    },
    [favoriteDogIds],
  ); 

  const handleLogout = async () => {
    // Function to handle logout
    try {
      const logoutResponse = await fetch(
        'https://frontend-take-home-service.fetch.com/auth/logout',
        {
          // call /auth/logout endpoint
          method: 'POST',
          credentials: 'include', // important to send cookies for session invalidation
        },
      );

      if (logoutResponse.ok) {
        console.log('Logout successful');
        navigate('/login'); // redirect to login page after successful logout
      } else {
        // handle logout error 
        console.error('Logout failed:', logoutResponse.status);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/favorites">Favorites</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>{' '}
            {/* Logout button in nav */}
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/search"
          element={
            <SearchPage
              isDogFavorite={isDogFavorite} 
              handleLike={handleLike} 
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              favoriteDogIds={favoriteDogIds} 
              setFavoriteDogIds={setFavoriteDogIds} 
              isDogFavorite={isDogFavorite} 
              handleLike={handleLike} 
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
