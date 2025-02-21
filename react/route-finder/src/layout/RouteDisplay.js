// RouteDisplay.js
import L from 'leaflet';
import { listenForRouteResponse, submitRouteRequest } from '../helpers/FirebaseHelper';

const RouteDisplay = ({
  startPoint,
  endPoint,
  categories,
  maxDistanceKm,
  mapRef,
  setDistanceTime,
  setRouteActive,
  setRouteCoordsArray,
  setLoading,
  setAlertMessage,
                        setRoutePOIs, // New prop to update the list of stops
      filteredPOIs, // Pass the filtered POIs

}) => {
  const displayRoute = (route) => {
    const map = mapRef.current;

    // Map the route coordinates to the corresponding POI objects
   const routePOIs = route
  .map((routeStop) => {
    // Find the matching POI in filteredPOIs
    const matchingPOI = filteredPOIs.find(
      (poi) =>
        poi.x === routeStop.coords[0] &&
        poi.y === routeStop.coords[1]
    );

    // Return only if there's a match
    return matchingPOI || null;
  })
  .filter((poi) => poi !== null); // Remove null values for unmatched POIs

    // Clear previous markers and set route coordinates
    setRouteCoordsArray(route.map(point => [point.coords[0], point.coords[1]]));
    setRouteActive(true);
    // Update the stops in the parent component
    setRoutePOIs(routePOIs); // Update with corresponding POIs
    // Initialize the routing control to draw the route line
    const waypoints = route.map(point => L.latLng(point.coords[0], point.coords[1]));
    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: true,
      createMarker: () => null,
      lineOptions: { styles: [{ color: '#3388ff', opacity: 0.8, weight: 3 }] },
      addWaypoints: false,
      show: false,
    }).addTo(map);

    // Event listener for route summary
    routingControl.on('routesfound', (e) => {
      const summary = e.routes[0].summary;
      const distance = (summary.totalDistance / 1000).toFixed(2);
      const totalTimeInSeconds = summary.totalTime;
      const hours = Math.floor(totalTimeInSeconds / 3600);
      const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);

      setDistanceTime({ distance, time: `${hours} hrs ${minutes} mins` });
    });
  };

  const submitRoute = async () => {
    if (startPoint && endPoint) {
      setLoading(true); // Start loading
      const requestId = await submitRouteRequest(startPoint, endPoint, categories, maxDistanceKm);
      listenForRouteResponse(requestId, (path) => {
        if (!path) {
          setAlertMessage('No route found. Please try different start and end points.'); // Set alert message
        }
        else {
          const route = path.map(point => ({
            coords: [point.lat, point.lon],
            name: point.name,
            category: point.category,
            rating: point.rating
          }));
          displayRoute(route);
        }
        setLoading(false); // End loading
      });
    }
  };

  return { submitRoute };
};

export default RouteDisplay;