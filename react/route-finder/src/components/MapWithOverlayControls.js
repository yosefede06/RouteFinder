import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import CategorySelector from "./CategorySelector";
import DistanceSlider from "./DistanceSlider";

const categoriesOptions = ["restaurant", "cafe", "hostel", "museum", "fuel", "hotel", "bar"];

const MapWithOverlayControls = () => {
  const [categories, setCategories] = useState([]);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);

  const handleDistanceChange = (e) => setMaxDistanceKm(e.target.value);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Map Container */}
      <MapContainer
        center={[31.0461, 34.8516]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>

      {/* Distance Slider */}
      <DistanceSlider
        maxDistanceKm={maxDistanceKm}
        onMaxDistanceChange={handleDistanceChange}
        disabled={false}
      />

      {/* Category Selector */}
      <CategorySelector
        categories={categories}
        categoryOptions={categoriesOptions}
        setCategories={setCategories}
        disabled={false}
      />
    </div>
  );
};

export default MapWithOverlayControls;