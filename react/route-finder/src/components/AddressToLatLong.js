// import React, { useState, useEffect } from 'react';
//
// const AddressToLatLong = ({point, setPoint, txt }) => {
//   const [address, setAddress] = useState('');
//
//   const handleAddressChange = (e) => {
//     setAddress(e.target.value);
//   };
//
//   const fetchCoordinates = async () => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
//       );
//       const data = await response.json();
//       if (data.length > 0) {
//         const { lat, lon } = data[0];
//         setPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
//       } else {
//         alert('No coordinates found for the entered address.');
//       }
//     } catch (error) {
//       console.error('Error fetching coordinates:', error);
//       alert('Error fetching coordinates. Please try again later.');
//     }
//   };
//
//    const fetchAddress = async () => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${point.lat}&lon=${point.lng}`
//       );
//       const data = await response.json();
//       if (data && data.display_name) {
//         setAddress(data.display_name);
//       } else {
//         alert('No address found for the entered coordinates.');
//         setAddress(null);
//       }
//     } catch (error) {
//       console.error('Error fetching address:', error);
//       alert('Error fetching address. Please try again later.');
//     }
//   };
//
//    useEffect(() => {
//     // Trigger reverse geocoding whenever latitude or longitude changes
//     if (point) {
//       fetchAddress(point.lat, point.lng);
//     }
//   }, [point]);
//
//   const placeholderText = `Enter ${txt} address`
//
//   return (
//       <div className="mt-2">
//        <div className="input-group mb-3">
//         <input
//           type="text"
//           className="form-control"
//           value={address}
//           onChange={handleAddressChange}
//           placeholder={placeholderText}
//         />
//         <button className="btn btn-outline-secondary" onClick={fetchCoordinates} >
//           Set
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export default AddressToLatLong;
import React, { useState, useEffect } from 'react';

const AddressToLatLong = ({ point, setPoint, txt, disabled=null }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    fetchSuggestions(newAddress);
  };

  const fetchCoordinates = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPoint({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert('No coordinates found for the entered address.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      alert('Error fetching coordinates. Please try again later.');
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 5) {
      setSuggestions([]);
      setNoResults(false);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.length === 0) {
        setNoResults(true); // Set no results if data is empty
        setSuggestions([]);
      } else {
        setNoResults(false);
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.display_name);
    setSuggestions([]);
    fetchCoordinates();
  };

  const fetchAddress = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${point.lat}&lon=${point.lng}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        alert('No address found for the entered coordinates.');
        setAddress(null);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      alert('Error fetching address. Please try again later.');
    }
  };

  useEffect(() => {
    // Trigger reverse geocoding whenever latitude or longitude changes
    if (point) {
      fetchAddress(point.lat, point.lng);
    }
  }, [point]);

  const placeholderText = `Enter ${txt} address`;

  return (
    <div className="mt-2" style={{ position: 'relative' }}>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={address}
          disabled={disabled}
          onChange={handleAddressChange}
          placeholder={placeholderText}
        />
        <button className="btn btn-outline-secondary" onClick={fetchCoordinates} disabled={disabled}>
          Set
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, top: '100%' }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* No results found message */}
      {noResults && (
        <div className="list-group position-absolute w-100" style={{ zIndex: 1000, top: '100%' }}>
          <div className="list-group-item text-muted">No results found</div>
        </div>
      )}
    </div>
  );
};

export default AddressToLatLong;