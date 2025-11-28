import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

const Overview = ({ id, mediaType }) => {
  const { apiCall } = useAuth();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || !mediaType) return;
      const data = await apiCall(`/${mediaType}/${id}`);
      setDetails(data);
    };
    fetchDetails();
  }, [id, mediaType, apiCall]);

  if (!details) return null;

  const {
    overview,
    release_date,
    first_air_date,
    runtime,
    episode_run_time,
    number_of_seasons,
    number_of_episodes,
    genres,
    spoken_languages,
  } = details;

  const displayRuntime =
    mediaType === "movie"
      ? runtime
        ? `${runtime} min`
        : "N/A"
      : episode_run_time?.length
      ? `${episode_run_time[0]} min`
      : "N/A";

  return (
    <div 
      className="p-3 p-md-4 p-lg-5 mx-2 mx-md-4 rounded-4 shadow-lg mb-4 mb-md-5"
      style={{
        background: "linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 193, 7, 0.1)",
      }}
    >
      {/* HEADER */}
      <div className="d-flex align-items-center gap-3 mb-3 mb-md-4">
        <div 
          className="bg-warning rounded-3" 
          style={{ width: "5px", height: "40px" }}
        ></div>
        <h3 className="fw-bold text-warning mb-0">Overview</h3>
      </div>

      {/* OVERVIEW TEXT */}
      <p 
        className="text-white-50 fs-6 mb-4 mb-md-5" 
        style={{ 
          lineHeight: "1.8",
          textAlign: "justify" 
        }}
      >
        {overview || "No overview available."}
      </p>

      {/* INFO SECTION */}
      <div className="row g-3 g-md-4 mb-4 mb-md-5">
        {mediaType === "movie" && (
          <>
            <div className="col-12 col-sm-6 col-lg-4">
              <div 
                className="p-3 p-md-4 rounded-3 h-100 info-card"
                style={{
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-4">📅</span>
                  <h6 className="text-warning mb-0 fw-semibold">Release Date</h6>
                </div>
                <p className="text-white mb-0 fs-5 fw-bold">{release_date || "N/A"}</p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div 
                className="p-3 p-md-4 rounded-3 h-100 info-card"
                style={{
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-4">⏱️</span>
                  <h6 className="text-warning mb-0 fw-semibold">Runtime</h6>
                </div>
                <p className="text-white mb-0 fs-5 fw-bold">{displayRuntime}</p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div 
                className="p-3 p-md-4 rounded-3 h-100 info-card"
                style={{
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-4">🌐</span>
                  <h6 className="text-warning mb-0 fw-semibold">Language</h6>
                </div>
                <p className="text-white mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>
                  {spoken_languages?.length
                    ? spoken_languages
                        .map((lang) => lang.english_name)
                        .join(", ")
                    : "N/A"}
                </p>
              </div>
            </div>
          </>
        )}

        {mediaType === "tv" && (
          <>
            <div className="col-12 col-sm-6 col-lg-4">
              <div 
                className="p-3 p-md-4 rounded-3 h-100 info-card"
                style={{
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-4">📺</span>
                  <h6 className="text-warning mb-0 fw-semibold">First Air Date</h6>
                </div>
                <p className="text-white mb-0 fs-5 fw-bold">{first_air_date || "N/A"}</p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div 
                className="p-3 p-md-4 rounded-3 h-100 info-card"
                style={{
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-4">📊</span>
                  <h6 className="text-warning mb-0 fw-semibold">TV Info</h6>
                </div>
                <p className="text-white mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>
                  {number_of_seasons} Season{number_of_seasons !== 1 ? 's' : ''} • {number_of_episodes} Episode{number_of_episodes !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div 
                className="p-3 p-md-4 rounded-3 h-100 info-card"
                style={{
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-4">🌐</span>
                  <h6 className="text-warning mb-0 fw-semibold">Language</h6>
                </div>
                <p className="text-white mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>
                  {spoken_languages?.length
                    ? spoken_languages
                        .map((lang) => lang.english_name)
                        .join(", ")
                    : "N/A"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* GENRES */}
      {genres && genres.length > 0 && (
        <div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="fs-5">🎭</span>
            <h6 className="text-warning fw-semibold mb-0">Genres</h6>
          </div>
          <div className="d-flex flex-wrap gap-2 gap-md-3">
            {genres.map((g) => (
              <Link
                key={g.id}
                to={`/genre/${mediaType}/${g.id}`}
                state={{ genreName: g.name }}
                onClick={() => window.scrollTo(0, 0)}
                className="badge px-3 px-md-4 py-2 rounded-pill genre-badge"
                style={{
                  background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                  color: "#000",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  border: "2px solid rgba(255, 193, 7, 0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>
        {`
          .info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(255, 193, 7, 0.2);
            background: rgba(255, 193, 7, 0.15) !important;
          }

          .genre-badge:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
            background: linear-gradient(135deg, #ffb300 0%, #ff8c00 100%) !important;
          }

          @media (max-width: 576px) {
            .info-card {
              padding: 1rem !important;
            }
            
            .info-card h6 {
              font-size: 0.9rem;
            }
            
            .genre-badge {
              font-size: 0.8rem !important;
              padding: 0.4rem 0.8rem !important;
            }
          }

          @media (min-width: 768px) and (max-width: 991px) {
            .info-card {
              padding: 1.25rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Overview;