import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import "./Hero.css";
import { useNavigate } from "react-router-dom";

const MovieHero = ({ id, mediaType }) => {
  const { apiCall } = useAuth();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [muted, setMuted] = useState(true);

  const [season, setSeason] = useState(1); // Default season
  const [episode, setEpisode] = useState(1); // Default episode

  const playerRef = useRef(null);

  const navigate = useNavigate();

  // Fetch movie/tv details + trailer
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      const m = await apiCall(`/${mediaType}/${id}`);
      setMovie(m);

      const videoData = await apiCall(`/${mediaType}/${id}/videos`);
      const trailer = videoData.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailerKey(trailer?.key || null);

      // For TV shows, set default season and episode
      if (mediaType === "tv" && m?.seasons?.length > 0) {
        setSeason(m.seasons[0].season_number);
        setEpisode(m.seasons[0]?.episodes?.[0]?.episode_number || 1);
      }
    };

    fetchMovie();
  }, [id, mediaType, apiCall]);

  // Auto-mute
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

  const handlePlay = () => {
    let url;
    if (mediaType === "movie") {
      url = `https://vidsrc.icu/embed/movie/${id}`;
    } else if (mediaType === "tv") {
      url = `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
    }

    navigate(mediaType === "movie" ? `/movie/${id}/play` : `/tv/${id}/season/${season}/episode/${episode}/play`, 
      { state: { url, title: movie.title || `${movie.name} - S${season}E${episode}` } });
  };

  return (
    <div className="hero-container">
      {/* Trailer or fallback */}
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

        <div className="hero-buttons">
          {/* Play Button */}
          <button className="hero-btn play" onClick={handlePlay}>
            <FaPlay className="mr-2" />
            Play
          </button>

          {/* Sound Toggle */}
          <button className="hero-btn sound" onClick={toggleMute}>
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
