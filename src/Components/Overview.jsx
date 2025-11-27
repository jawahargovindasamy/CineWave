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
  } = details;

  const displayRuntime =
    mediaType === "movie"
      ? runtime
        ? `${runtime} minutes`
        : "N/A"
      : episode_run_time?.length
      ? `${episode_run_time[0]} minutes`
      : "N/A";

  return (
    <div className="mx-4 card bg-dark text-white shadow-lg border-secondary">
      <div className="card-body">

        {/* Title */}
        <h3 className="fw-bold border-start border-4 ps-3 mb-4">Overview</h3>

        {/* Overview Text */}
        <p className="text-light opacity-75 fs-6 mb-4">{overview}</p>

        {/* Grid Section */}
        <div className="row mb-3">

          {/* --- MOVIE LAYOUT --- */}
          {mediaType === "movie" && (
            <>
              {/* Release Date */}
              <div className="col-md-6 mb-3">
                <div className="p-3 bg-secondary bg-opacity-25 rounded">
                  <strong className="text-primary">Release Date:</strong>
                  <p className="m-0">{release_date}</p>
                </div>
              </div>

              {/* Runtime */}
              <div className="col-md-6 mb-3">
                <div className="p-3 bg-secondary bg-opacity-25 rounded">
                  <strong className="text-primary">Runtime:</strong>
                  <p className="m-0">{displayRuntime}</p>
                </div>
              </div>
            </>
          )}

          {/* --- TV LAYOUT LIKE MOVIE (2 COLUMNS) --- */}
          {mediaType === "tv" && (
            <>
              {/* Release Date */}
              <div className="col-md-6 mb-3">
                <div className="p-3 bg-secondary bg-opacity-25 rounded">
                  <strong className="text-primary">Release Date:</strong>
                  <p className="m-0">{first_air_date}</p>
                </div>
              </div>

              {/* TV Info */}
              <div className="col-md-6 mb-3">
                <div className="p-3 bg-secondary bg-opacity-25 rounded">
                  <strong className="text-primary">TV Info:</strong>
                  <p className="m-0">
                    Seasons: <strong>{number_of_seasons}</strong> |
                    Episodes: <strong>{number_of_episodes}</strong>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Genres */}
        <div className="mt-4">
          <strong className="text-primary">Genres:</strong>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {genres?.map((g) => (
              <Link
                key={g.id}
                to={`/genre/${mediaType}/${g.id}`} state={{ genreName: g.name }}
                onClick={()=>window.scrollTo(0,0)}
                className="badge bg-primary bg-gradient px-3 py-2 fs-6 rounded-pill"
                style={{ cursor: "pointer", textDecoration: "none" }}
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;
