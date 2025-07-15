import React, { useState, useEffect } from "react";
import "./ComponetCSS/Add_order.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  return null;
}

const AddOrder = ({ product, sellerLat, sellerLng, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [buyerLocation, setBuyerLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [showRoute, setShowRoute] = useState(false);

  const apiKey = "5b3ce3597851110001cf62488e258e5ffff14520b04e313f59c64a7c";

  // ✅ Use fallback values if props are undefined
  const sellerLatitude = sellerLat ?? 9.0245;
  const sellerLongitude = sellerLng ?? 38.7485;
  const sellerLocation = [sellerLatitude, sellerLongitude];

  // const sellerLatitude = sellerLat ?? 9.0245;
  // const sellerLongitude = sellerLng ?? 38.7485;
  // const sellerLocation = [sellerLatitude, sellerLongitude];
  const mapCenter = sellerLocation;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const role = params.get("role");

    if (username) localStorage.setItem("username", username);
    if (role) localStorage.setItem("role", role);
  }, []);

  const handleSetBuyerLocation = () => {
    if (!navigator.geolocation) {
      alert("❌ Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const buyerCoords = [latitude, longitude];
        setBuyerLocation(buyerCoords);
        setShowRoute(true);

        try {
          const response = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            {
              coordinates: [
                [sellerLongitude, sellerLatitude],
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
        } catch (error) {
          console.error("Route fetch error:", error);
          alert("❌ Failed to fetch route.");
        }
      },
      (error) => {
        alert("❌ Failed to get your location.");
        console.error(error);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!buyerLocation) {
      alert("📍 Please set your location first.");
      return;
    }

    if (!phoneNumber || !/^\+?2519\d{8}$/.test(phoneNumber)) {
      alert("📱 Please enter valid Ethiopian phone number (+2519XXXXXXXX).");
      return;
    }

    // const buyerusername = localStorage.getItem("username");
    // const buyer = { username: buyerusername };

    const buyer = localStorage.getItem("username"); // ✅ plain string

    if (!buyer) {
      alert("No seller identified. Please log in again.");
      return;
    }

    const orderData = {
      productName: product?.name || "",
      seller: product?.seller || "",
      buyer: buyer || "",
      price: product?.price || 0,
      rating: product?.rating || 0,
      quantity,
      totalPrice: parseFloat((product.price * quantity).toFixed(2)),
      phoneNumber,
      buyerLatitude: buyerLocation[0],
      buyerLongitude: buyerLocation[1],
      sellerLatitude,
      sellerLongitude,
      status: "Pending",
    };

    try {
      await axios.post("http://localhost:8080/api/orders", orderData);
      alert("✅ Order placed successfully!");
      onClose();
    } catch (error) {
      console.error("Order submit error:", error);
      alert("❌ Failed to place order.");
    }
  };

  return (
    <div className="order-form container">
      <div className="map">
        <button
          onClick={handleSetBuyerLocation}
          style={{ marginBottom: "10px", marginTop: "200px" }}
        >
          🧭 Set Buyer Location & Show Route
        </button>

        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "250px", width: "100%" }}
        >
          <MapResizer />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <Marker position={sellerLocation}>
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

      <form onSubmit={handleSubmit} className="form-section">
        <div className="input-group">
          <label>Product Name</label>
          <input type="text" value={product?.productName || ""} readOnly />
        </div>

        <div className="input-group">
          <label>Seller</label>
          <input type="text" value={product?.seller || ""} readOnly />
        </div>

        <div className="input-group">
          <label>Price</label>
          <input
            type="text"
            value={`ETB ${(product?.price * quantity || 0).toFixed(2)}`}
            readOnly
          />
        </div>

        <div className="input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="input-group">
          <label>Your Phone Number</label>
          <input
            type="tel"
            placeholder="+2519XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="button-section">
          <button type="submit" className="publish-btn">
            Confirm Order
          </button>
          <button type="button" className="draft-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
