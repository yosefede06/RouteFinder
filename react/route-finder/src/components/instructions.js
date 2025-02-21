// Instructions.js
import React, { useState } from 'react';

const Instructions = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div>
      <button
        className="btn btn-link text-decoration-none p-0 mb-2"
        onClick={() => setShowInstructions(!showInstructions)}
      >
        {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
      </button>

      {showInstructions && (
        <div className="alert alert-info mt-2">
          <h6>Instructions</h6>
          <ul>
            <li>Select the start and end points using the map or by entering an address.</li>
            <li>Choose categories of Points of Interest (POIs) you’d like to see on your route.</li>
            <li>Adjust the distance filter to control how far from the route POIs are displayed.</li>
            <li>Click "Generate Route" to create your route. Use "Refresh App" to reset everything.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Instructions;