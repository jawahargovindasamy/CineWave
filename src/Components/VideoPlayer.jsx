import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { useAuth } from "../Context/AuthContext";

const VideoPlayer = () => {
  const { VIDURL } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [playerState, setPlayerState] = useState(location.state);
  const [showNav, setShowNav] = useState(true);
  const hideTimeout = useRef(null);

  useEffect(() => {
    setPlayerState(location.state);
  }, [location.state]);

  if (!playerState?.url) return null;

  const {
    url,
    title,
    tvId,
    seriesName,
    seasonNumber,
    currentEpisodeNumber,
    allEpisodeNumbers = [],
  } = playerState;

  // --- NEXT EPISODE LOGIC ---
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

    setPlayerState(nextPlayerState);

    navigate(
      `/tv/${tvId}/season/${seasonNumber}/episode/${nextEpisodeNumber}/play`,
      {
        replace: true,
        state: nextPlayerState,
      }
    );
  };

  // --- PREVIOUS EPISODE LOGIC ---
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

    setPlayerState(previousPlayerState);

    navigate(
      `/tv/${tvId}/season/${seasonNumber}/episode/${previousEpisodeNumber}/play`,
      {
        replace: true,
        state: previousPlayerState,
      }
    );
  };

  // --- AUTO HIDE NAV ---
  const resetHideTimeout = () => {
    setShowNav(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowNav(false), 3000);
  };

  useEffect(() => {
    resetHideTimeout();
    return () => clearTimeout(hideTimeout.current);
  }, [playerState]);

  return (
    <div
      className="position-relative bg-black"
      style={{ height: "100vh", width: "100vw" }}
      onMouseMove={resetHideTimeout}
    >
      {/* NAV BAR */}
      <div
        className={`position-absolute w-100 d-flex justify-content-between align-items-center px-4 py-3
        ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{
          top: 0,
          left: 0,
          zIndex: 50,
          transition: "opacity 0.4s ease",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0))",
        }}
      >
        {/* BACK + TITLE */}
        <div
          className="d-flex align-items-center gap-3 text-white"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={26} />
          <span className="fw-semibold fs-5">{title}</span>
        </div>

        {/* NEXT / PREVIOUS BUTTONS */}
        <div className="d-flex gap-3">
          {hasPrevious && (
            <div
              className="d-flex align-items-center gap-2 px-3 py-2 rounded bg-opacity-25 bg-light border border-light text-white"
              style={{ cursor: "pointer", backdropFilter: "blur(4px)" }}
              onClick={handlePrevious}
            >
              <MdSkipPrevious size={26} />
              <span className="small fw-medium">Previous Episode</span>
            </div>
          )}

          {hasNext && (
            <div
              className="d-flex align-items-center gap-2 px-3 py-2 rounded bg-opacity-25 bg-light border border-light text-white"
              style={{ cursor: "pointer", backdropFilter: "blur(4px)" }}
              onClick={handleNext}
            >
              <MdSkipNext size={26} />
              <span className="small fw-medium">Next Episode</span>
            </div>
          )}
        </div>
      </div>

      {/* VIDEO FRAME */}
      <div style={{ paddingTop: "55px", height: "calc(100vh - 55px)" }}>
        <iframe
          key={url}
          src={url}
          width="100%"
          height="100%"
          style={{ display: "block" }}
          allow="autoplay; encrypted-media; clipboard-write; accelerometer; gyroscope; web-share"
          allowFullScreen
          title={title || "Media Player"}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
