import React, { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Carousel } from 'react-bootstrap';

const FilteredPOIMarkers = ({ filteredPOIs, routeActive, routeCoordsArray, getIconForCategory, setSelectedPOI, selectedPOI, setSelectedStopIndex }) => {
  const markerRefs = useRef([]);

  useEffect(() => {
    if (routeActive) {
      let delay = 0; // Base delay for transition timing
      // Loop through `routeCoordsArray` to open popups in exact order
      routeCoordsArray.forEach((coords, orderedIdx) => {

        const poiIndex = filteredPOIs.findIndex(
          (poi) => poi.x === coords[0] && poi.y === coords[1]
        );

        if (poiIndex !== -1) {
          const marker = markerRefs.current[poiIndex];
          if (marker) {
            setTimeout(() => {
              marker.openPopup();
            }, delay);

            delay += 1500; // Increment delay for the next marker in sequence
          }
        }
      });
    }
  }, [routeActive, filteredPOIs, routeCoordsArray]);
  // Automatically open popup for the selected POI
  useEffect(() => {
    if (selectedPOI) {
      const poiIndex = filteredPOIs.findIndex(
        (poi) => poi.x === selectedPOI.x && poi.y === selectedPOI.y
      );

      if (poiIndex !== -1) {
        const marker = markerRefs.current[poiIndex];
        if (marker) {
          marker.openPopup(); // Open the popup for the selected marker
        }
      }
    }
  }, [selectedPOI, filteredPOIs]);
  return filteredPOIs.map((poi, idx) => {
    const routeIndex = routeCoordsArray.findIndex(([x, y]) => x === poi.x && y === poi.y);
    const isInRoute = routeIndex !== -1;
    const isGrayedOut = routeActive && !isInRoute;
    const markerIcon = getIconForCategory(poi.category, isGrayedOut);
    const stopLabel = isInRoute ? `Stop ${routeIndex}` : null; // "Stop i" label if in route

    return (
      <Marker
        key={idx}
        position={[poi.x, poi.y]}
        icon={markerIcon}
        ref={(el) => (markerRefs.current[idx] = el)} // Store marker instance in refs
            eventHandlers={{
          popupopen: () => {
            setSelectedPOI(poi); // Update selectedPOI with clicked marker's data
            setSelectedStopIndex(routeIndex); // Highlight the corresponding stop in StopListPanel
          },
          popupclose: () => {
            setSelectedPOI(null); // Clear selectedPOI when popup is closed
          },
        }}
      >
        <Popup closeOnClick={false}>
  {/*        {poi.easy?.logo && (*/}
  {/*  <div style={{ textAlign: 'center', marginBottom: '5px' }}>*/}
  {/*    <img src={poi.easy.logo} alt={`${poi.name} logo`} style={{ width: '50px', objectFit: 'contain' }} />*/}
  {/*  </div>*/}
  {/*)}*/}
          {stopLabel && <><b>{stopLabel}</b><br /></>}
          <b>{poi.name}</b>
         {/*<br />*/}
          {/*{`Category: ${poi.category}`}<br />*/}
          {/*{`Rating: ${poi.rating || 'No rating'}`}<br />*/}
        </Popup>
      </Marker>
    );
  });
};


export default FilteredPOIMarkers;