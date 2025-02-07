import React, { useState, useEffect, useCallback } from 'react';
import DogCard from '../Dog/DogCard.jsx'; 
import './favorite.css'; 

function FavoritesPage({
  favoriteDogIds,
  setFavoriteDogIds,
  isDogFavorite,
  handleLike,
}) {
  // props from App.js
  const [favoriteDogs, setFavoriteDogs] = useState([]);
  const [matchedDog, setMatchedDog] = useState(null);
  const [matchError, setMatchError] = useState('');

  useEffect(() => {

    const fetchFavoriteDogsDetails = async () => {
      if (favoriteDogIds.size > 0) {
        try {
          const favoriteIdsArray = Array.from(favoriteDogIds);
          const dogDetailsResponse = await fetch(
            'https://frontend-take-home-service.fetch.com/dogs',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(favoriteIdsArray),
              credentials: 'include',
            },
          );
          const dogDetailsData = await dogDetailsResponse.json();
          setFavoriteDogs(dogDetailsData);
        } catch (error) {
          console.error('Error fetching favorite dog details:', error);
          setFavoriteDogs([]);
        }
      } else {
        setFavoriteDogs([]); // no favorites, clear dog list
      }
    };

    fetchFavoriteDogsDetails();
  }, [favoriteDogIds]);

  const handleGenerateMatch = useCallback(async () => {
    setMatchError('');
    setMatchedDog(null);

    if (favoriteDogIds.size === 0) {
      setMatchError('Please like at least one dog to generate a match.');
      return;
    }

    try {
      const favoriteIdsArray = Array.from(favoriteDogIds);
      const matchResponse = await fetch(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(favoriteIdsArray),
          credentials: 'include',
        },
      );

      if (!matchResponse.ok) {
        const errorData = await matchResponse.json();
        const errorMessage =
          errorData.message ||
          `Match generation failed. HTTP status: ${matchResponse.status}`;
        throw new Error(errorMessage);
      }

      const matchData = await matchResponse.json();

      if (matchData.match) {
        const matchedDogDetailsResponse = await fetch(
          'https://frontend-take-home-service.fetch.com/dogs',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([matchData.match]),
            credentials: 'include',
          },
        );
        const matchedDogDetailsData = await matchedDogDetailsResponse.json();
        if (matchedDogDetailsData && matchedDogDetailsData.length > 0) {
          setMatchedDog(matchedDogDetailsData[0]);
        } else {
          setMatchError('Failed to fetch details for the matched dog.');
        }
      } else {
        setMatchError('Match generation failed to return a matched dog ID.');
      }
    } catch (error) {
      console.error('Error generating match:', error);
      setMatchError(`Match generation failed: ${error.message}`);
      setMatchedDog(null);
    }
  }, [favoriteDogIds]); 

  return (
    <div className="favorites-page-container">
      <h1>Favorite Dogs</h1>

      {/* show favorite list from the like button */}
      {favoriteDogIds.size === 0 ? (
        <p>No favorite dogs yet. Like some dogs on the search page!</p>
      ) : (
        <div className="favorite-dog-grid">
          {favoriteDogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              isFavorite={isDogFavorite(dog.id)}
              onLike={handleLike} 
            />
          ))}
        </div>
      )}

      {/* match functionality */}
      <div className="match-controls">
        <button
          className="generate-match-button"
          onClick={handleGenerateMatch}
          disabled={favoriteDogIds.size < 1}
        >
          Generate Match
        </button>
      </div>

      {matchError && <div className="match-error-alert">{matchError}</div>}
      {/* render matched result */}
      {matchedDog && (
        <div className="matched-dog-container">
          <h2>It's a Match!</h2>
          <DogCard
            dog={matchedDog}
            isFavorite={isDogFavorite(matchedDog.id)}
            onLike={handleLike}
          />
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
