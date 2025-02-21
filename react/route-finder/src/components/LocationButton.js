// LocationButton.js
import React from 'react';

const LocationButton = ({ setStartPoint, disabled }) => {
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartPoint({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <button
      onClick={handleUseMyLocation}
      className=" use-location-btn"
      disabled={disabled}
    >
      📍 Use My Location
    </button>
  );
};

export default LocationButton;