// import React, { useState } from 'react';

// const LocationFilter = ({ onApplyFilters }) => {
//   const [cityFilter, setCityFilter] = useState('');
//   const [statesFilter, setStatesFilter] = useState([]);
//   const [geoBoundingBox, setGeoBoundingBox] = useState('');

//   const handleGeoBoundingBoxChange = (e) => {
//     setGeoBoundingBox(e.target.value);
//   };

//   const handleApplyFilters = () => {
//     let geoBox = {};
//     if (geoBoundingBox) {
//       const geoParts = geoBoundingBox.split(',');
//       if (geoParts.length === 4) {
//         geoBox = {
//           top_left: {
//             lat: parseFloat(geoParts[0]),
//             lon: parseFloat(geoParts[1]),
//           },
//           bottom_right: {
//             lat: parseFloat(geoParts[2]),
//             lon: parseFloat(geoParts[3]),
//           },
//         };
//       }
//     }

//     onApplyFilters({
//       cityFilter,
//       statesFilter,
//       geoBoundingBox: geoBox,
//     });
//   };

//   return (
//     <div className="location-filters">
//       <div>
//         <label htmlFor="city">City:</label>
//         <input
//           type="text"
//           id="city"
//           value={cityFilter}
//           onChange={(e) => setCityFilter(e.target.value)}
//         />
//       </div>
//       <div>
//         <label htmlFor="states">States (comma-separated):</label>
//         <input
//           type="text"
//           id="states"
//           value={statesFilter.join(', ')}
//           onChange={(e) =>
//             setStatesFilter(
//               e.target.value.split(',').map((state) => state.trim()),
//             )
//           }
//         />
//       </div>
//       <div>
//         <label htmlFor="geoBoundingBox">Geo Bounding Box:</label>
//         <input
//           type="text"
//           id="geoBoundingBox"
//           placeholder="e.g. 40.7128,-74.0060,34.0522,-118.2437"
//           value={geoBoundingBox}
//           onChange={handleGeoBoundingBoxChange}
//         />
//       </div>
//       <button onClick={handleApplyFilters}>Apply Filters</button>
//     </div>
//   );
// };

// export default LocationFilter;
