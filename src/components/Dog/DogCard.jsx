import React from 'react';
import './dogCard.css';

function DogCard({ dog, onLike, isFavorite }) {
  // props: onLike, isFavorite
  const handleLikeClick = () => {
    onLike(dog.id);
  };

  return (
    <div className="dog-card">
      <img src={dog.img} alt={dog.name} className="dog-image" style={{ width: '300px', height: '300px', objectFit: 'cover' }}/>
      <div className="dog-details">
        <h3>{dog.name}</h3>
        <p>Breed: {dog.breed}</p>
        <p>Age: {dog.age}</p>
        <p>Zip Code: {dog.zip_code}</p>
        <button
          className={`like-btn ${isFavorite ? 'liked' : ''}`} 
          onClick={handleLikeClick}
        >
          {isFavorite ? '❤️ Liked' : '❤️ Like'}{' '}
        </button>
      </div>
    </div>
  );
}

export default DogCard;
