import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { useAuth } from "../Context/AuthContext";

const VideoPlayer = () => {
  const { VIDURL } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // The component's internal state for the player, initialized from the router's state
  const [playerState, setPlayerState] = useState(location.state);
  const [showNav, setShowNav] = useState(true);
  const [hoverPreview, setHoverPreview] = useState(null);
  const hideTimeout = useRef(null);

  // Sync internal state if the router location changes (e.g., browser back/forward)
  useEffect(() => {
    setPlayerState(location.state);
  }, [location.state]);

  // If there's no state/url, we can't play anything.
  if (!playerState?.url) return null;

  // Destructure for easier access
  const {
    url,
    title,
    tvId,
    seriesName,
    seasonNumber,
    currentEpisodeNumber,
    allEpisodeNumbers = [],
  } = playerState;

  // --- LOGIC FOR NEXT EPISODE ---
  const currentIndex = allEpisodeNumbers.indexOf(currentEpisodeNumber);
  const hasNext =
    currentIndex !== -1 && currentIndex < allEpisodeNumbers.length - 1;

  const handleNext = () => {
    if (!hasNext) return;

    const nextEpisodeNumber = allEpisodeNumbers[currentIndex + 1];
    const nextUrl = `${VIDURL}/tv/${tvId}/${seasonNumber}/${nextEpisodeNumber}`;
    const nextTitle = `${seriesName} - S${seasonNumber}E${nextEpisodeNumber}`;

    const nextPlayerState = {
      ...playerState,
      url: nextUrl,
      title: nextTitle,
      currentEpisodeNumber: nextEpisodeNumber,
    };

    // Update the component's state to change the iframe src
    setPlayerState(nextPlayerState);

    // Update the browser's URL and history state without a full page reload
    navigate(
      `/tv/${tvId}/season/${seasonNumber}/episode/${nextEpisodeNumber}/play`,
      {
        replace: true, // Replace the history entry
        state: nextPlayerState,
      }
    );
  };

  // --- LOGIC FOR PREVIOUS EPISODE ---
  const hasPrevious = currentIndex !== -1 && currentIndex > 0;

  const handlePrevious = () => {
    if (!hasPrevious) return;

    const previousEpisodeNumber = allEpisodeNumbers[currentIndex - 1];
    const previousUrl = `${VIDURL}/tv/${tvId}/${seasonNumber}/${previousEpisodeNumber}`;
    const previousTitle = `${seriesName} - S${seasonNumber}E${previousEpisodeNumber}`;

    const previousPlayerState = {
      ...playerState,
      url: previousUrl,
      title: previousTitle,
      currentEpisodeNumber: previousEpisodeNumber,
    };

    // Update the component's state to change the iframe src
    setPlayerState(previousPlayerState);

    // Update the browser's URL and history state without a full page reload
    navigate(
      `/tv/${tvId}/season/${seasonNumber}/episode/${previousEpisodeNumber}/play`,
      {
        replace: true,
        state: previousPlayerState,
      }
    );
  };

  // Hide nav after 3 seconds of inactivity
  const resetHideTimeout = () => {
    setShowNav(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowNav(false), 3000);
  };

  useEffect(() => {
    resetHideTimeout();
    return () => clearTimeout(hideTimeout.current);
  }, [playerState]); // Reset timer when episode changes

  const navButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "white",
    cursor: "pointer",
    fontSize: "18px",
    transition: "opacity 0.3s",
    textShadow: "0 0 5px black",
  };

  const nextEpisodeInfo = hasNext
    ? {
        number: allEpisodeNumbers[currentIndex + 1],
        title: `${seriesName} - S${seasonNumber}E${
          allEpisodeNumbers[currentIndex + 1]
        }`,
        img: `https://image.tmdb.org/t/p/w300${
          playerState?.nextEpisodeImg || ""
        }`,
      }
    : null;

  const previousEpisodeInfo = hasPrevious
    ? {
        number: allEpisodeNumbers[currentIndex - 1],
        title: `${seriesName} - S${seasonNumber}E${
          allEpisodeNumbers[currentIndex - 1]
        }`,
        img: `https://image.tmdb.org/t/p/w300${
          playerState?.previousEpisodeImg || ""
        }`,
      }
    : null;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        position: "relative",
      }}
      onMouseMove={resetHideTimeout}
    >
      {hoverPreview && (
        <div
          className="position-absolute"
          style={{
            top: "70px",
            right: hoverPreview.type === "next" ? "20px" : "auto",
            left: hoverPreview.type === "previous" ? "20px" : "auto",
            zIndex: 2000,
          }}
        >
          <div className="card shadow-lg" style={{ width: "220px" }}>
            <img
              src={hoverPreview.img}
              className="card-img-top"
              alt="episode preview"
            />
            <div className="card-body p-2">
              <h6 className="card-title text-center small mb-0">
                {hoverPreview.title}
              </h6>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Overlay */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          zIndex: 10,
          opacity: showNav ? 1 : 0,
          pointerEvents: showNav ? "auto" : "none",
          transition: "opacity 0.3s ease-in-out",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Back Button & Title */}
        <div style={navButtonStyle} onClick={() => navigate(-1)}>
          <FaArrowLeft size={24} />
          {title && <span>{title}</span>}
        </div>

        <div className="d-flex gap-3">
          {/* Previous Episode Button */}
          {hasPrevious && (
            <div
              style={navButtonStyle}
              onClick={handlePrevious}
              onMouseEnter={() =>
                setHoverPreview({
                  type: "previous",
                  img: previousEpisodeInfo?.img,
                  title: previousEpisodeInfo?.title,
                })
              }
              onMouseLeave={() => setHoverPreview(null)}
            >
              <span>Previous Episode</span>
              <MdSkipPrevious size={24} />
            </div>
          )}

          {/* Next Episode Button */}
          {hasNext && (
            <div
              style={navButtonStyle}
              onClick={handleNext}
              onMouseEnter={() =>
                setHoverPreview({
                  type: "next",
                  img: nextEpisodeInfo?.img,
                  title: nextEpisodeInfo?.title,
                })
              }
              onMouseLeave={() => setHoverPreview(null)}
            >
              <MdSkipNext size={24} />
              <span>Next Episode</span>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Video */}
      <iframe
        key={url}
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
