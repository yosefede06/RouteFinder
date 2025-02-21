import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaFlagCheckered } from 'react-icons/fa'; // Import icons from react-icons

const StopListPanel = ({ routePOIs, setSelectedPOI, selectedStopIndex, distanceTime }) => {
  if (!routePOIs || routePOIs.length === 0) return null;

  return (
    <div className="card mt-3 stop-list-panel">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0 d-none d-sm-block">Route Stops</h6>
        {/* Route Summary in Horizontal Format */}
        {distanceTime && (
          <div className="d-flex align-items-center small text-muted">
            <span className="me-3">
              <strong>Distance:</strong> {distanceTime.distance || 'N/A'} km
            </span>
            <span>
              <strong>Time:</strong> {distanceTime.time || 'N/A'}
            </span>
          </div>
        )}
      </div>

      <div className="card-body d-flex overflow-auto " style={{ gap: '10px', padding: '10px',           overflowX: 'auto', // Enable horizontal scrolling
}}>
        {/* Start Stop */}
        <Card
          className="text-center border-success"
          style={{
            width: '200px',
            flex: '0 0 auto',
            cursor: 'default',
            border: '2px solid green',
            transition: '0.2s ease-in-out',
          }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <FaMapMarkerAlt size={30} color="green" className="mb-2" />
            <Badge bg="success" className="mb-2">
              Start
            </Badge>
            <Card.Title className="small mb-1">
              Start Point
            </Card.Title>
            <Card.Text className="text-muted small">
              No category
            </Card.Text>
          </Card.Body>
        </Card>

        {/* Intermediate Stops */}
        {routePOIs.map((poi, index) => (
          <Card
            key={index}
            className={`text-center ${selectedStopIndex -1 === index ? 'border-primary shadow' : ''}`}
            style={{
              width: '200px',
              flex: '0 0 auto',
              cursor: 'pointer',
              border: '1px solid #ddd',
              transition: '0.2s ease-in-out',
            }}
            onClick={() => {
              setSelectedPOI(poi); // Set the selected POI
            }}
          >
            <Card.Body>
              {/* Badge for intermediate stop labels */}
              <Badge bg="primary" className="mb-2">
                {`Stop ${index + 1}`}
              </Badge>

              {/* Name of the POI */}
              <Card.Title className="small mb-1">
                {poi.easy?.name || poi.name || 'No name available'}
              </Card.Title>

              {/* Category of the POI */}
              <Card.Text className="text-muted small">
                {poi.easy?.category || poi.category || 'No category'}
              </Card.Text>

              {/* Bayesian Rating of the POI */}
              {poi.rating !== undefined && (
                <Card.Text className="text-muted small">
                  Bayesian Rating: {poi.rating.toFixed(1)}
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        ))}

         {/* End Stop */}
        <Card
          className="text-center border-danger"
          style={{
            width: '200px',
            flex: '0 0 auto',
            cursor: 'default',
            border: '2px solid red',
            transition: '0.2s ease-in-out',
          }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <FaFlagCheckered size={30} color="red" className="mb-2" />
            <Badge bg="danger" className="mb-2">
              End
            </Badge>
            <Card.Title className="small mb-1">End Point</Card.Title>
            <Card.Text className="text-muted small">No category</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default StopListPanel;