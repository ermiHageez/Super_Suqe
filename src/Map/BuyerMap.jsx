// src/components/Map/BuyerMap.jsx
import React, { useState } from "react";
import "./BuyerMap.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const BuyerMap = ({ onLocationSelect, sellerLocation }) => {
  const [buyerLocation, setBuyerLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [showRoute, setShowRoute] = useState(false);

  const apiKey = "5b3ce3597851110001cf62488e258e5ffff14520b04e313f59c64a7c";

  const handleSetLocations = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const buyerCoords = [latitude, longitude];
          setBuyerLocation(buyerCoords);
          setShowRoute(true);

          if (onLocationSelect) {
            onLocationSelect({ latitude, longitude });
          }

          try {
            const response = await axios.post(
              "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
              {
                coordinates: [
                  [sellerLocation.longitude, sellerLocation.latitude],
                  [longitude, latitude],
                ],
              },
              {
                headers: {
                  Authorization: apiKey,
                  "Content-Type": "application/json",
                },
              }
            );

            const geometry = response.data.features[0].geometry.coordinates;
            const leafletCoords = geometry.map((coord) => [coord[1], coord[0]]);
            setRouteCoords(leafletCoords);
          } catch (err) {
            alert("❌ Failed to fetch route.");
            console.error(err);
          }
        },
        (error) => {
          alert("❌ Failed to get location. Please allow location access.");
          console.error(error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const mapCenter = sellerLocation
    ? [sellerLocation.latitude, sellerLocation.longitude]
    : [9.03, 38.74]; // default fallback

  return (
    <div className="map">
      <button onClick={handleSetLocations} style={{ marginBottom: "10px", marginTop: "150px" }}>
        🧭 Set Buyer Location & Show Route
      </button>

      <MapContainer center={mapCenter} zoom={13} style={{ height: "250px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        <Marker position={mapCenter}>
          <Popup>📦 Seller Location</Popup>
        </Marker>

        {buyerLocation && (
          <Marker position={buyerLocation}>
            <Popup>🧍 Buyer Location</Popup>
          </Marker>
        )}

        {buyerLocation && showRoute && (
          <Polyline positions={routeCoords} color="green" />
        )}
      </MapContainer>
    </div>
  );
};

export default BuyerMap;
