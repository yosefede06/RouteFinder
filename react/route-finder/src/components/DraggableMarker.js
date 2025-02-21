// DraggableMarker.js
import React from 'react';
import { Marker, Popup } from 'react-leaflet';

const DraggableMarker = ({ position, icon, label, onPositionChange }) => {
  if (!position) return null;

  const handleDragEnd = (e) => {
    const newLatLng = e.target.getLatLng();
    onPositionChange(newLatLng); // Notify parent component of the new position
  };

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: handleDragEnd,
      }}
      icon={icon}
    >
      {/*<Popup>{label}</Popup>*/}
    </Marker>
  );
};

export default DraggableMarker;