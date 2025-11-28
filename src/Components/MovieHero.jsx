import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { FaPlay } from "react-icons/fa";
import "./Hero.css";
import { useNavigate } from "react-router-dom";
import TrailerPlayer from "./TrailerPlayer"; // Import the new component
import HeroSkeleton from "./HeroSkeleton";

const MovieHero = ({ id, mediaType }) => {
  const { apiCall } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [season, setSeason] = useState(1); // Default season
  const [episode, setEpisode] = useState(1); // Default episode

  const navigate = useNavigate();

  // Fetch movie/tv details
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      const m = await apiCall(`/${mediaType}/${id}`);
      setMovie(m);

      // For TV shows, set default season and episode
      if (mediaType === "tv" && m?.seasons?.length > 0) {
        setSeason(m.seasons[0].season_number);
        setEpisode(m.seasons[0]?.episodes?.[0]?.episode_number || 1);
      }

      setLoading(false);
    };

    fetchMovie();
  }, [id, mediaType, apiCall]);

  if (loading || !movie) {
    return <HeroSkeleton />;
  }

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
      {/* Use the reusable trailer component */}
      <TrailerPlayer
        mediaId={id}
        mediaType={mediaType}
        fallbackImage={movie.backdrop_path}
      />

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1 className="hero-title">{movie.title || movie.name}</h1>

        <div className="hero-buttons">
          {/* Play Button */}
          <button className="hero-btn play" onClick={handlePlay}>
            <FaPlay className="mr-2" />
            Play
          </button>
          
          {/* Sound button now comes from TrailerPlayer */}
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
