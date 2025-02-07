import React, { useState, useEffect, useCallback } from 'react';
import DogCard from '../Dog/DogCard.jsx';
import './search.css';

function Search({ isDogFavorite, handleLike }) {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [sortBy, setSortBy] = useState('breed:asc'); // default sort to 'breed:asc'
  const [error, setError] = useState('');
  const [dogs, setDogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [zipCodesFilter, setZipCodesFilter] = useState('');
  const [ageMinFilter, setAgeMinFilter] = useState('');
  const [ageMaxFilter, setAgeMaxFilter] = useState('');
  const [sortType, setSortType] = useState('breed');
  const [sortDirection, setSortDirection] = useState('asc');

  // fetch breed
  //The base URL is https://frontend-take-home-service.fetch.com.
  // GET /dogs/breeds
  // Return Value
  // Returns an array of all possible breed names.

  const fetchByBreed = async () => {
    try {
      const response = await fetch(
        'https://frontend-take-home-service.fetch.com/dogs/breeds',
        {
          credentials: 'include',
        },
      );

      const data = await response.json();
      console.log('breed data -->', data);
      setBreeds(data);
    } catch (error) {
      console.error('Error fetching breed:', error);
    }
  };

  const fetchDogs = useCallback(
    async (currentSortBy) => {
      setError('');
      try {
        const searchParams = {
          from: currentPage * pageSize,
          size: pageSize,
        };
        if (selectedBreed) {
          searchParams.breeds = [selectedBreed];
        }
        if (zipCodesFilter) {
          const zipCodeArray = zipCodesFilter
            .split(',')
            .map((zip) => zip.trim())
            .filter((zip) => zip);
          searchParams.zipCodes = zipCodeArray;
        }
        if (ageMinFilter) {
          searchParams.ageMin = parseInt(ageMinFilter, 10);
        }
        if (ageMaxFilter) {
          searchParams.ageMax = parseInt(ageMaxFilter, 10);
        }
        if (currentSortBy) {
          // <--- แก้ไข: ใช้ argument currentSortBy แทน sortBy state
          searchParams.sort = currentSortBy;
        }

        const searchResponse = await fetch(
          'https://frontend-take-home-service.fetch.com/dogs/search?' +
            new URLSearchParams(searchParams),
          {
            credentials: 'include',
          },
        );
        const searchData = await searchResponse.json();
        console.log('search data -->', searchData);

        if (searchData.resultIds && searchData.resultIds.length > 0) {
          const dogDetailsResponse = await fetch(
            'https://frontend-take-home-service.fetch.com/dogs',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(searchData.resultIds),
              credentials: 'include',
            },
          );
          const dogDetailsData = await dogDetailsResponse.json();
          console.log('dog details data -->', dogDetailsData);
          setDogs(dogDetailsData);
        } else {
          setDogs([]);
        }

        setHasNextPage(!!searchData.next);
        setHasPrevPage(!!searchData.prev);
      } catch (error) {
        setError('Error fetching dogs. Please try again later.');
        setDogs([]);
        setHasNextPage(false);
        setHasPrevPage(false);
        console.error('Error fetching dogs:', error);
      }
    },
    [
      selectedBreed,
      currentPage,
      pageSize,
      zipCodesFilter,
      ageMinFilter,
      ageMaxFilter,
    ],
  );

  useEffect(() => {
    fetchByBreed();
    fetchDogs();
  }, [
    currentPage,
    selectedBreed,
    pageSize,
    zipCodesFilter,
    ageMinFilter,
    ageMaxFilter,
    fetchDogs,
  ]);

  const handleSearch = () => {
    const constructedSortBy = `${sortType}:${sortDirection}`;
    setSortBy(constructedSortBy);
    setCurrentPage(0);
    fetchDogs(constructedSortBy);
  };

  // then options on breed sorting
  // favorite button
  // match page

  useEffect(() => {
    setHasNextPage(dogs.length >= pageSize);
  }, [dogs, pageSize]);

  return (
    <div className="search-page-container">
      <h1>Search Dogs</h1>
      {error && <div className="error-alert">{error}</div>}
      <div className="filter-sort-container">
        <div className="filter-section">
            {/* breed filter */}
          <label htmlFor="breed-select">Filter by Breed:</label>
          <select
            id="breed-select"
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
          >
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        {/* zip codes filter */}
        <div className="filter-section">
          <label htmlFor="zip-codes-input">Zip Codes:</label>
          <input
            type="text"
            id="zip-codes-input"
            placeholder="e.g.,10001"
            value={zipCodesFilter}
            onChange={(e) => setZipCodesFilter(e.target.value)}
          />
        </div>

        {/* age filter */}
        <div className="filter-section age-filter">
          <label htmlFor="age-min-input">Min Age:</label>
          <input
            type="number"
            id="age-min-input"
            placeholder="Min Age"
            value={ageMinFilter}
            onChange={(e) => setAgeMinFilter(e.target.value)}
          />

          <label htmlFor="age-max-input">Max Age:</label>
          <input
            type="number"
            id="age-max-input"
            placeholder="Max Age"
            value={ageMaxFilter}
            onChange={(e) => setAgeMaxFilter(e.target.value)}
          />
        </div>

        {/* sort by type */}
        <div className="sort-section">
          <label htmlFor="sort-type-select">Sort By:</label>
          <select
            id="sort-type-select"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="breed">Breed</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
          </select>
        </div>

        {/* sort direction */}
        <div className="sort-section">
          <label htmlFor="sort-direction-select">Sort Direction:</label>
          <select
            id="sort-direction-select"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            {/* Conditional Options based on sortType */}
            {sortType === 'breed' || sortType === 'name' ? (
              <>
                <option value="asc">A to Z</option>
                <option value="desc">Z to A</option>
              </>
            ) : (
              <>
                <option value="asc">Min to Max</option>
                <option value="desc">Max to Min</option>
              </>
            )}
          </select>
        </div>
        <button className="search-button" onClick={handleSearch}>
          Search Dogs
        </button>{' '}
      </div>

      <div className="dog-grid">
        {dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            isFavorite={isDogFavorite(dog.id)}
            onLike={handleLike}
          />
        ))}
      </div>

      {/* pagination */}
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => {
            setHasNextPage(true);
            setCurrentPage(currentPage - 1);
          }}
          disabled={!hasPrevPage}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={!hasNextPage || dogs.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Search;


// this could split out to dog-detail
// interface Dog {
//     id: string
//     img: string
//     name: string
//     age: number
//     zip_code: string
//     breed: string
// }

// search (be able to filter by breed), (GET /dogs/breeds)
// -> then handle result from fetching API , All fields of the Dog object (except for id) must be presented in some form (Results should be paginated)
// -> then Results should be sorted alphabetically by breed by default.
// -> Users should be able to modify this sort to be ascending or descending. (sort by a-z or z-a)

//Users should be able to select their favorite dogs from the search results.
// -> users be able to added to favorite list (Favorite button)
// When finished searching, they should be able to generate a match based on dogs added to the favorites list.
