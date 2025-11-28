import React, { useEffect, useRef } from "react";
import { FaPlay, FaInfoCircle, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const HeroBase = ({
  movie,
  trailerKey,
  muted,
  onToggleMute,
  onPlay,
  onMoreInfo,
  showInfo = false,
  overviewExpanded = false,
  playerRef,
}) => {
  if (!movie) return null;

  return (
    <div className="hero-container">
      {/* Trailer or Fallback */}
      {trailerKey ? (
        <iframe
          ref={playerRef}
          className="hero-video"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1&enablejsapi=1`}
          allow="autoplay; encrypted-media"
        ></iframe>
      ) : (
        <div
          className="hero-fallback"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        ></div>
      )}

      {/* Dark overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">{movie.title || movie.name}</h1>

        {showInfo && (
          <div
            className={`overview-box ${overviewExpanded ? "open" : "closed"}`}
          >
            <p className="hero-desc">{movie.overview}</p>
          </div>
        )}

        <div className="hero-buttons">
          {/* Play Button */}
          <button className="hero-btn play" onClick={onPlay}>
            <FaPlay className="mr-2" /> Play
          </button>

          {/* More Info (Optional) */}
          {showInfo && (
            <button
              className="hero-btn info hide-mobile"
              onClick={onMoreInfo}
            >
              <FaInfoCircle className="mr-2" /> More Info
            </button>
          )}

          {/* Sound Toggle */}
          <button className="hero-btn sound" onClick={onToggleMute}>
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBase;
