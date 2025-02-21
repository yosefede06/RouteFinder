// DistanceSlider.js
import React from 'react';

const DistanceSlider = ({ maxDistanceKm, onMaxDistanceChange, disabled }) => {
  return (
    <div className="mt-4">
      <h6>Maximum Distance for the Route (in km)</h6>
      <input
        type="range"
        min="1"
        max="500"
        value={maxDistanceKm}
        onChange={onMaxDistanceChange}
        className="form-range"
        disabled={disabled}
      />
      <span>{maxDistanceKm} km</span>
    </div>
  );
};

export default DistanceSlider;
