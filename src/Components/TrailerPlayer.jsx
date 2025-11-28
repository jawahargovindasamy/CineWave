import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const TrailerPlayer = ({ 
  mediaId, 
  mediaType, 
  onTrailerLoaded = () => {},
  fallbackImage = null
}) => {
  const { apiCall } = useAuth();
  const [trailerKey, setTrailerKey] = useState(null);
  const [muted, setMuted] = useState(true);
  const playerRef = useRef(null);

  // Fetch trailer
  useEffect(() => {
    const fetchTrailer = async () => {
      if (!mediaId || !mediaType) return;
      
      try {
        const endpoint = `/${mediaType}/${mediaId}/videos`;
        const videoData = await apiCall(endpoint);
        
        // Find YouTube trailer
        const trailer = videoData.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        
        const key = trailer?.key || null;
        setTrailerKey(key);
        onTrailerLoaded(key);
      } catch (error) {
        console.error("Error fetching trailer:", error);
        setTrailerKey(null);
        onTrailerLoaded(null);
      }
    };

    fetchTrailer();
  }, [mediaId, mediaType, apiCall, onTrailerLoaded]);

  // Force mute on load
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

  // Toggle mute function
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

  // Render either trailer or fallback image
  return (
    <>
      {trailerKey ? (
        <iframe
          ref={playerRef}
          className="hero-video"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          title="Trailer"
        ></iframe>
      ) : fallbackImage ? (
        <div
          className="hero-fallback"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${fallbackImage})`,
          }}
        ></div>
      ) : null}
      
      {/* Sound toggle button */}
      {trailerKey && (
        <button className="hero-btn sound" onClick={toggleMute}>
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      )}
    </>
  );
};

export default TrailerPlayer;
