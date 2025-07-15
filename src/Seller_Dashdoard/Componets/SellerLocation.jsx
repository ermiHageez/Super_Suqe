import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerLocation = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [telegramId, setTelegramId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get("username");
    if (u) {
      setTelegramId(u);
    } else {
      alert("Username not found in URL. Example: ?username=Ermi1888&role=SELLER");
    }
  }, []);

  const getLocationFromBrowser = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        alert("Failed to get location.");
        console.error(error);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!telegramId) {
      alert("Username is missing. Cannot save location.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `http://localhost:8080/api/v1/user/location/${telegramId}`,
        location
      );
      alert("✅ Seller location saved!");
    } catch (error) {
      alert("❌ Failed to save location.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="seller-location-form container"
      style={{
        overflowY: "auto",
        maxHeight: "100%",
        paddingBottom: "20px"
      }}
    >
      <h2>Set Your Seller Location</h2>
      <p><strong>User:</strong> {telegramId || "Not found"}</p>
      <button type="button" onClick={getLocationFromBrowser}>
        📍 Use My Current Location
      </button>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Latitude</label>
          <input
            type="text"
            value={location.latitude}
            onChange={(e) =>
              setLocation({ ...location, latitude: e.target.value })
            }
            required
          />
        </div>
        <div className="input-group">
          <label>Longitude</label>
          <input
            type="text"
            value={location.longitude}
            onChange={(e) =>
              setLocation({ ...location, longitude: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Location"}
        </button>
      </form>
    </div>
  );
};

export default SellerLocation;
