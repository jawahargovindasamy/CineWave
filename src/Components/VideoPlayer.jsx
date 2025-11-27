import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const VideoPlayer = ({ url: propUrl, title: propTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const url = propUrl || location.state?.url;
  const title = propTitle || location.state?.title;

  const [showNav, setShowNav] = useState(true);
  const hideTimeout = useRef(null);

  if (!url) return null;

  // Hide nav after 3 seconds of inactivity
  const resetHideTimeout = () => {
    setShowNav(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowNav(false), 3000);
  };

  useEffect(() => {
    // Start hide timer on mount
    resetHideTimeout();

    // Clear timeout on unmount
    return () => clearTimeout(hideTimeout.current);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        backgroundColor: "black",
        position: "relative",
      }}
      onMouseMove={resetHideTimeout} // Show nav on mouse move
    >
      {/* Back Button & Title */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          display: showNav ? "flex" : "none",
          alignItems: "center",
          gap: "10px",
          color: "white",
          cursor: "pointer",
          fontSize: "18px",
          transition: "opacity 0.3s",
        }}
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft size={24} />
        {title && <span>{title}</span>}
      </div>

      {/* Fullscreen Video */}
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ display: "block" }}
        allow="autoplay; encrypted-media; clipboard-write; accelerometer; gyroscope; web-share"
        allowFullScreen
        title={title || "Media Player"}
      />
    </div>
  );
};

export default VideoPlayer;
