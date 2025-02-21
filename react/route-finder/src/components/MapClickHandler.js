// MapClickHandler.js
import { useMapEvent } from 'react-leaflet';

const MapClickHandler = ({ startPoint, endPoint, setStartPoint, setEndPoint }) => {
  useMapEvent('click', (e) => {
    if (!startPoint) {
      setStartPoint(e.latlng);
    } else if (!endPoint) {
      setEndPoint(e.latlng);
    }
  });

  return null;
};

export default MapClickHandler;