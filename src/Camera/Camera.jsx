// src/components/Camera.js
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const CameraCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [savedImages, setSavedImages] = useState([]);
  const [facingMode, setFacingMode] = useState("environment");

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        const hasBack = videoDevices.some((device) =>
          device.label.toLowerCase().includes("back")
        );
        if (!hasBack) setFacingMode("user");
      })
      .catch(() => setFacingMode("user"));
  }, []);

  const capture = () => {
    if (savedImages.length >= 2) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    onCapture && onCapture(imageSrc); // pass base64 string to parent
  };

  const saveImage = () => {
    if (capturedImage && savedImages.length < 2) {
      setSavedImages((prev) => [...prev, capturedImage]);
      setCapturedImage(null);
    }
  };

  const resetImages = () => {
    setCapturedImage(null);
    setSavedImages([]);
  };

  const videoConstraints = { facingMode };

  return (
    <div style={{ textAlign: "center", paddingBottom: "2rem" }}>
      {!capturedImage && savedImages.length < 2 ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{
              width: "100%",
              maxWidth: "320px",
              borderRadius: "8px",
              margin: "0 auto",
              aspectRatio: "1 / 1",
            }}
          />
          <button
            onClick={capture}
            disabled={savedImages.length >= 2}
            style={{
              marginTop: "-1rem",
              padding: "10px 20px",
              borderRadius: "6px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              cursor: savedImages.length >= 2 ? "not-allowed" : "pointer",
            }}
          >
            📸 Capture Photo
          </button>
        </>
      ) : capturedImage ? (
        <>
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              height: "300px",
              margin: "1rem auto",
              border: "2px dashed #ccc",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0f0f0",
            }}
          >
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              onClick={saveImage}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                background: "#007bff",
                color: "#fff",
                border: "none",
              }}
            >
              💾 Save
            </button>
            <button
              onClick={() => setCapturedImage(null)}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                background: "#6c757d",
                color: "#fff",
                border: "none",
              }}
            >
              🔄 Retake
            </button>
          </div>
        </>
      ) : (
        <p style={{ marginTop: "1rem", color: "green" }}>✅ You have saved 2 photos.</p>
      )}

      {savedImages.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📂 Saved Captures ({savedImages.length}/2)</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            {savedImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`saved-${idx}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              />
            ))}
          </div>
          {savedImages.length === 2 && (
            <button
              onClick={resetImages}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              🗑️ Reset All
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
