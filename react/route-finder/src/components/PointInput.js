// PointInput.js
import React from 'react';
import AddressToLatLong from './AddressToLatLong';

const PointInput = ({ icon, point, setPoint, label, disabled}) => (
  <div className="rounded d-flex align-items-center">
    <img src={icon} alt={`${label} Icon`} className="me-2 mb-2" style={{ width: '15px' }} />
    <div className="flex-grow-1">
      <AddressToLatLong point={point} setPoint={setPoint} txt={label} disabled={disabled} />
    </div>
  </div>
);

export default PointInput;