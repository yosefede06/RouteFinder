// MapComponent.js
import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import startIcon from '../assets/icons/marker-icon-2x-green.png';
import endIcon from '../assets/icons/marker-icon-2x-red.png';

const MapClickHandler = ({ setStartPoint, setEndPoint, startPoint, endPoint }) => {
  useMapEvent('click', (e) => {
    if (!startPoint) {
      setStartPoint(e.latlng);
    } else if (!endPoint) {
      setEndPoint(e.latlng);
    }
  });
  return null;
};

const MapComponent = ({ startPoint, setStartPoint, endPoint, setEndPoint, handleDragEnd, routeMarkers, displayFilteredPOIs }) => {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={[31.0461, 34.8516]}
      zoom={8}
      style={{ height: '600px', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="&copy; <a href='https://carto.com/'>CartoDB</a>"
      />
      <MapClickHandler
        setStartPoint={setStartPoint}
        setEndPoint={setEndPoint}
        startPoint={startPoint}
        endPoint={endPoint}
      />
      {startPoint && (
        <Marker
          position={startPoint}
          draggable
          eventHandlers={{ dragend: (e) => handleDragEnd(e, 'start') }}
          icon={L.icon({ iconUrl: startIcon, iconSize: [25, 41] })}
        >
          <Popup>Start Point</Popup>
        </Marker>
      )}
      {endPoint && (
        <Marker
          position={endPoint}
          draggable
          eventHandlers={{ dragend: (e) => handleDragEnd(e, 'end') }}
          icon={L.icon({ iconUrl: endIcon, iconSize: [25, 41] })}
        >
          <Popup>End Point</Popup>
        </Marker>
      )}
      {routeMarkers}
      {displayFilteredPOIs()}
    </MapContainer>
  );
};

export default MapComponent;