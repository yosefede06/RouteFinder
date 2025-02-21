import { useState, useEffect } from 'react';
import { haversineDistance } from '../helpers/utils';

const useFilteredPOIs = (allPOIs, startPoint, endPoint, categories, maxDistanceKm) => {
  const [filteredPOIs, setFilteredPOIs] = useState([]);

  useEffect(() => {
    if (!startPoint || !endPoint) return;

    const filtered = allPOIs.filter((poi) => {
      const distanceToStart = haversineDistance(poi.x, poi.y, startPoint.lat, startPoint.lng);
      const distanceToEnd = haversineDistance(poi.x, poi.y, endPoint.lat, endPoint.lng);
      const totalDistance = distanceToStart + distanceToEnd;
      return categories.includes(poi.category) && totalDistance <= maxDistanceKm;
    });

    setFilteredPOIs(filtered);
  }, [startPoint, endPoint, categories, maxDistanceKm]);

  return filteredPOIs;
};

export default useFilteredPOIs;