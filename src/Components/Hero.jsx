import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../Context/AuthContext";
import { FaPlay, FaInfoCircle, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import "./hero.css";
import { useNavigate } from "react-router-dom";

const Hero = ({ trendingMovies = [] }) => {
  const { apiCall } = useAuth();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [muted, setMuted] = useState(true);

  const navigate = useNavigate();

  const playerRef = useRef(null);

  // -----------------------------------
  // Pick Random Movie + Trailer
  // -----------------------------------
  const pickRandomMovie = useCallback(
    async (list) => {
      if (!list || list.length === 0) return;

      const random = list[Math.floor(Math.random() * list.length)];
      setMovie(random);

      // Determine endpoint based on media_type
      let endpoint = "";
      if (random.media_type === "movie") {
        endpoint = `/movie/${random.id}/videos`;
      } else if (random.media_type === "tv") {
        endpoint = `/tv/${random.id}/videos`;
      } else {
        // Skip other types (like "person")
        setTrailerKey(null);
        return;
      }

      const videoData = await apiCall(endpoint);

      // Pick YouTube trailer
      const trailer = videoData.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        setTrailerKey(null); // fallback if no trailer
      }
    },
    [apiCall]
  );

  // -----------------------------------
  // Set initial movie once trendingMovies is loaded
  // -----------------------------------
  
  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const setMovieAsync = async () => {
      await pickRandomMovie(trendingMovies);
    };

    setMovieAsync();
  }, [trendingMovies, pickRandomMovie]);

  // -----------------------------------
  // Auto switch movie every 30 sec
  // -----------------------------------
  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      pickRandomMovie(trendingMovies);
    }, 30000);

    return () => clearInterval(interval);
  }, [trendingMovies, pickRandomMovie]);

  // -----------------------------------
  // FORCE MUTE on video load
  // -----------------------------------
  useEffect(() => {
    if (!trailerKey || !playerRef.current) return;

    const timer = setTimeout(() => {
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "mute" }),
        "*"
      );
      setMuted(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [trailerKey]);

  // -----------------------------------
  // Toggle Mute
  // -----------------------------------
  const toggleMute = () => {
    if (!playerRef.current) return;

    playerRef.current.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: muted ? "unMute" : "mute",
      }),
      "*"
    );

    setMuted(!muted);
  };

  if (!movie) return null;

  return (
    <div className="hero-container">
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

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1 className="hero-title">{movie.title || movie.name}</h1>

        <div className={`overview-box ${overviewExpanded ? "open" : "closed"}`}>
          <p className="hero-desc">{movie.overview}</p>
        </div>

        <div className="hero-buttons">
          <button
            className="hero-btn play"
            onClick={() => {
              if (movie.media_type === "movie") {
                navigate(`/movie/${movie.id}`);
              } else if (movie.media_type === "tv") {
                navigate(`/tv/${movie.id}`);
              }
            }}
          >
            <FaPlay className="mr-2" />
            Play
          </button>

          {/* Hide More Info on small screens */}
          <button
            className="hero-btn info hide-mobile"
            onClick={() => setOverviewExpanded(!overviewExpanded)}
          >
            <FaInfoCircle className="mr-2" /> More Info
          </button>

          <button className="hero-btn sound" onClick={toggleMute}>
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
