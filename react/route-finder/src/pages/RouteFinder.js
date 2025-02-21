import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet-routing-machine";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import startIcon from "../assets/icons/marker-icon-2x-green.png";
import endIcon from "../assets/icons/marker-icon-2x-red.png";
import "../styles/RouteFinder.css";
import "leaflet/dist/leaflet.css";
import DistanceSlider from "../components/DistanceSlider";
import { fetchAllPOIs } from "../helpers/FirebaseHelper";
import CategorySelector from "../components/CategorySelector";
import SubmitRouteButton from "../components/SubmitRouteButton";
import MapClickHandler from "../components/MapClickHandler";
import FilteredPOIMarkers from "../components/FilteredPOIMarkers";
import useFilteredPOIs from "../hooks/useFilteredPOIs";
import { getIconForCategory } from "../helpers/IconHelper";
import DraggableMarker from "../components/DraggableMarker";
import PointInput from "../components/PointInput";
import RouteDisplay from "../layout/RouteDisplay";
import LocationButton from "../components/LocationButton";
import Instructions from "../components/instructions";
import POIDetailsPanel from "../components/POIDetailsPanel";
import StopListPanel from "../components/StopListPanel";

const RouteFinder = () => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [categories, setCategories] = useState([]);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [loading, setLoading] = useState(false); // New loading state
  const [alertMessage, setAlertMessage] = useState(''); // New alert message state
  const [routePOIs, setRoutePOIs] = useState(null); // New state for selected POI
  const [selectedPOI, setSelectedPOI] = useState(null); // New state for selected POI

  const mapRef = useRef(null);
  const [allPOIs, setAllPOIs] = useState([]); // Store all POIs initially
  const filteredPOIs = useFilteredPOIs(
    allPOIs,
    startPoint,
    endPoint,
    categories,
    maxDistanceKm
  );
  const [distanceTime, setDistanceTime] = useState({
    distance: null,
    time: null,
  });
  const [routeActive, setRouteActive] = useState(false); // Track if route is active
  const [routeCoordsArray, setRouteCoordsArray] = useState([]); // Track route POI coordinates in order
  const [selectedStopIndex, setSelectedStopIndex] = useState(null); // Track selected stop index


  // Function to reset the app state
  const resetApp = () => {
    setStartPoint(null);
    setEndPoint(null);
    setRoutePOIs(null)
    setCategories([]);
    setMaxDistanceKm(10);
    setRouteCoordsArray([]);
    setRouteActive(false);
    setSelectedStopIndex(null)


    setDistanceTime({ distance: null, time: null });
    // Clear map markers and routes if any
    if (mapRef.current) {
      const map = mapRef.current;

      // Remove all markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      // Remove any active routing control if applicable
      map.eachLayer((layer) => {
        if (layer instanceof L.Routing.Control) {
          map.removeControl(layer);
        }
      });
    }
  };

  const { submitRoute } = RouteDisplay({
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
      setRoutePOIs, // Pass setStops here
        filteredPOIs, // Pass the filtered POIs
  });

  const handleMaxDistanceChange = (e) => {
    setMaxDistanceKm(parseInt(e.target.value));
  };

  useEffect(() => {
    const fetchData = async () => {
      const pois = await fetchAllPOIs();
      setAllPOIs(pois);
    };
    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-xl-4">
                 <div className="col-12 mb-3">
                   <div className="bg-light p-4 rounded shadow-sm">

            <Instructions />
            <h6>Set Start and End Points</h6>
            <PointInput
              icon={startIcon}
              point={startPoint}
              setPoint={setStartPoint}
              label="start"
              disabled={loading || routeActive}
            />
            <PointInput
              icon={endIcon}
              point={endPoint}
              setPoint={setEndPoint}
              label="destination"
              disabled={loading || routeActive}
            />
                            <CategorySelector
              categories={categories}
              categoryOptions={[
                "restaurant",
                "cafe",
                "hostel",
                "museum",
                "fuel",
                "hotel",
                "bar",
              ]}
              setCategories={setCategories}
              disabled={loading || routeActive}
            />
                        <DistanceSlider
              maxDistanceKm={maxDistanceKm}
              onMaxDistanceChange={handleMaxDistanceChange}
              disabled={loading || routeActive}
            />


            <div className="d-flex justify-content-center mt-3">
              <SubmitRouteButton
                onSubmit={submitRoute}
                disabled={
                  !startPoint || !endPoint || !categories.length || loading || routeActive
                }
                loading={loading}
              />
              <button onClick={resetApp} className="btn btn-secondary mx-2">
                Refresh App
              </button>

            </div>

            {/* Conditional Bootstrap alert */}
              {alertMessage && (
                <div className="mt-4 alert alert-danger alert-dismissible fade show" role="alert">
                  {alertMessage}
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlertMessage('')}></button>
                </div>
              )}

          </div>
                 </div>


        </div>

                {/* Sidebar for POI Details */}


        <div className="col-xl-8 position-relative ">
          <LocationButton
            setStartPoint={setStartPoint}
            disabled={loading || routeActive}
          />
          <MapContainer
            center={[31.0461, 34.8516]}
            zoom={8}
            style={{ height: "600px", width: "100%" }}
            ref={mapRef}
            attributionControl={false}
             zoomControl= {false}

          >

            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution="&copy; <a href='https://carto.com/'>CartoDB</a>"
            />

            <MapClickHandler
              startPoint={startPoint}
              endPoint={endPoint}
              setStartPoint={setStartPoint}
              setEndPoint={setEndPoint}
            />
            {/* Use DraggableMarker for start and end points */}
            <DraggableMarker
              position={startPoint}
              icon={L.icon({ iconUrl: startIcon, iconSize: [25, 41] })}
              label="Start Point"
              onPositionChange={setStartPoint} // Directly update startPoint state
            />
            <DraggableMarker
              position={endPoint}
              icon={L.icon({ iconUrl: endIcon, iconSize: [25, 41] })}
              label="End Point"
              onPositionChange={setEndPoint} // Directly update endPoint state
            />
            {/* Render route markers */}
            <FilteredPOIMarkers
              filteredPOIs={filteredPOIs}
              routeActive={routeActive}
              routeCoordsArray={routeCoordsArray}
              getIconForCategory={getIconForCategory}
            setSelectedPOI={setSelectedPOI}
              selectedPOI={selectedPOI}
              setSelectedStopIndex={setSelectedStopIndex}

            />


            {/* Add route and POI markers */}
          </MapContainer>


     <div className="col-12">
              <POIDetailsPanel  poi={selectedPOI}  closePanel={() => setSelectedPOI(null)} />
                 </div>
        </div>
          <div className={"col-xl-4"}>

              </div>

       <div className="col-xl-8">

          {/* Stop List Panel */}
   <StopListPanel
        routePOIs={routePOIs}
        setSelectedPOI={setSelectedPOI}
        selectedStopIndex={selectedStopIndex} // Highlight the selected stop
       distanceTime={distanceTime}
      />
       </div>

      </div>



    </div>
  );
};

export default RouteFinder;
