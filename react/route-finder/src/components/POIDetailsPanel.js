import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { isOpenNow, renderRatingStars } from '../helpers/utils';

const POIDetailsPanel = ({ poi, closePanel}) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

  if (!poi) return null; // Return nothing if no POI is selected
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const { category, easy, locationKey, name: poiName, x, y } = poi;
  const { address, city, logo, name, numofreviews, phone, rating, gallery, operatingHours } = easy || {};
  const openStatus = isOpenNow(operatingHours);
  const badgeClass = openStatus ? 'badge bg-success' : 'badge bg-danger';

  return (
    <div className="card mb-4 poi-panel">

      <div className="card-body">
<div className="card-header d-flex align-items-center">
  {poi.easy?.logo && (
    <img
      src={poi.easy.logo}
      alt={`${poi.name} logo`}
      className="me-3 rounded-circle"
      style={{ width: '30px', height: '30px' }}
    />
  )}
  <h6 className="mb-0 text-capitalize">{poi.easy?.name || poi.name}</h6>
          {/* Close Button */}
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={closePanel}
          style={{ position: 'absolute', right: '15px', top: '15px' }}
        ></button>
</div>
        {/* Toggleable Operating Hours */}
        {operatingHours && (
          <div>
      <div className="d-flex align-items-center mt-2">

  <span className={`${badgeClass} small`}>{openStatus ? 'Open Now' : 'Closed'}</span>

  <button
    className="btn btn-link p-0 ms-1"
    onClick={toggleCollapse}
    aria-expanded={!isCollapsed}
    aria-controls="operatingHoursCollapse"
    style={{ textDecoration: 'none', color: '#007bff' }}
  >
    <span className={'small'}>
    {isCollapsed ? 'Show Hours' : 'Hide Hours'}
      </span>

  </button>
</div>
            <div className={`collapse ${!isCollapsed ? 'show' : ''}`} id="operatingHoursCollapse">
              <ul className="list-unstyled mt-2 small">
                {operatingHours.map((entry, index) => (
                  <li key={index}>
                    <strong>{entry.day}</strong>{entry.hours ? ': ' + entry.hours : ''}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="d-flex align-items-center mt-1 small">

          <strong className="me-1">Rating:</strong>
          {rating ? renderRatingStars(rating) : <span className="text-muted">No rating</span>}
          <span className="ms-1 text-muted">({numofreviews ? `${numofreviews}` : '0'})</span>

        </div>
          <p className="small mt-1"><strong>Address:</strong> {poi.easy?.address || 'No address available'}</p>

      {/* Gallery Carousel */}
      {gallery && gallery.length > 0 ? (
        <Carousel interval={2000} indicators={false}>
          {gallery.map((imageUrl, imgIdx) => (
            <Carousel.Item key={imgIdx}>
              <img
                src={imageUrl}
                alt={`Slide ${imgIdx}`}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p>No images available.</p>
      )}
    </div>
    </div>
  );
};

export default POIDetailsPanel;