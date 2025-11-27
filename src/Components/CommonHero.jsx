import { useEffect, useState, useRef, useCallback } from "react";
import { FaPlay, FaInfoCircle, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./hero.css";

const CommonHero = ({
  movie: initialMovie = null,
  moviesList = [],
  showOverview = false,
  showSkeleton = true,
  autoChangeInterval = 30000,
  showSeasons = false,
  onPlay = null,
}) => {
  const { apiCall } = useAuth();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const [movie, setMovie] = useState(initialMovie);
  const [trailerKey, setTrailerKey] = useState(null);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadTrailer = useCallback(
    async (selectedMovie) => {
      if (!selectedMovie) return;

      let endpoint = "";
      if (selectedMovie.media_type === "movie" || selectedMovie.title)
        endpoint = `/movie/${selectedMovie.id}/videos`;
      else endpoint = `/tv/${selectedMovie.id}/videos`;

      try {
        const videoData = await apiCall(endpoint);
        const trailer = videoData.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch (err) {
        console.error("Trailer load failed:", err);
        setTrailerKey(null);
      }

      setLoading(false);
    },
    [apiCall]
  );

  const pickRandomMovie = useCallback(() => {
    if (!moviesList || moviesList.length === 0) return;
    const random = moviesList[Math.floor(Math.random() * moviesList.length)];
    setMovie(random);
    loadTrailer(random);
  }, [moviesList, loadTrailer]);

  useEffect(() => {
    if (initialMovie) {
      setMovie(initialMovie);
      loadTrailer(initialMovie);
      return;
    }
    if (moviesList.length > 0) {
      pickRandomMovie();
      const interval = setInterval(pickRandomMovie, autoChangeInterval);
      return () => clearInterval(interval);
    }
  }, [initialMovie, moviesList, pickRandomMovie, autoChangeInterval, loadTrailer]);

  useEffect(() => {
    if (!trailerKey || !playerRef.current) return;
    const t = setTimeout(() => {
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "mute" }),
        "*"
      );
      setMuted(true);
    }, 600);
    return () => clearTimeout(t);
  }, [trailerKey]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    playerRef.current.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: muted ? "unMute" : "mute" }),
      "*"
    );
    setMuted(!muted);
  };

  if (loading && showSkeleton) {
    return (
      <div className="hero-skeleton">
        <div className="skeleton-video" />
        <div className="skeleton-title" />
        {showOverview && <div className="skeleton-overview" />}
        <div className="skeleton-buttons">
          <div className="skeleton-btn" />
          <div className="skeleton-btn small" />
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="hero-container">
      {trailerKey ? (
        <iframe
          ref={playerRef}
          className="hero-video"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1&enablejsapi=1`}
          allow="autoplay; encrypted-media"
        />
      ) : (
        <div
          className="hero-fallback"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        />
      )}

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">
          {movie.title || movie.name || movie.original_name}
        </h1>

        {showOverview && movie.overview && (
          <p className="hero-overview">
            {overviewExpanded
              ? movie.overview
              : movie.overview.slice(0, 160) + (movie.overview.length > 160 ? "..." : "")}
            {movie.overview.length > 160 && (
              <button
                className="read-more-btn"
                onClick={() => setOverviewExpanded(!overviewExpanded)}
              >
                {overviewExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </p>
        )}

        <div className="hero-buttons">
          <button className="play-btn" onClick={() => onPlay?.(movie)}>
            <FaPlay /> Play
          </button>

          <button
            className="info-btn"
            onClick={() =>
              navigate(
                movie.media_type === "tv"
                  ? `/tv/${movie.id}`
                  : `/movie/${movie.id}`
              )
            }
          >
            <FaInfoCircle /> More Info
          </button>

          <button className="mute-btn" onClick={toggleMute}>
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonHero;
