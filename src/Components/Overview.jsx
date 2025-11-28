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
    <div className="px-4 pt-4 mx-4 card bg-dark text-white shadow-sm rounded-3 border-0">
      <div className="container-fluid px-4">
        <div className="p-4">
          {/* HEADER */}
          <div className="d-flex align-items-center mb-4">
            <div
              className="me-3"
              style={{
                width: "5px",
                height: "30px",
                backgroundColor: "#0dcaf0",
                borderRadius: "2px",
              }}
            ></div>
            <h3 className="fw-bold m-0 text-light">Overview</h3>
          </div>

          {/* OVERVIEW TEXT */}
          <p className="text-white-50 fs-6 lh-lg mb-4">{overview}</p>

          {/* INFO SECTION */}
          <div className="row g-3">
            {mediaType === "movie" && (
              <>
                <div className="col-md-4">
                  <div className="p-3 bg-dark bg-opacity-50 rounded border border-secondary border-opacity-25 h-100">
                    <h6 className="text-info mb-1 fw-semibold">Release Date</h6>
                    <p className="m-0">{release_date || "N/A"}</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-dark bg-opacity-50 rounded border border-secondary border-opacity-25 h-100">
                    <h6 className="text-info mb-1 fw-semibold">Runtime</h6>
                    <p className="m-0">{displayRuntime}</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-dark bg-opacity-50 rounded border border-secondary border-opacity-25 h-100">
                    <h6 className="text-info mb-1 fw-semibold">Language</h6>
                    <p className="m-0">
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
                <div className="col-md-4">
                  <div className="p-3 bg-dark bg-opacity-50 rounded border border-secondary border-opacity-25 h-100">
                    <h6 className="text-info mb-1 fw-semibold">
                      First Air Date
                    </h6>
                    <p className="m-0">{first_air_date || "N/A"}</p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-dark bg-opacity-50 rounded border border-secondary border-opacity-25 h-100">
                    <h6 className="text-info mb-1 fw-semibold">TV Info</h6>
                    <p className="m-0">
                      Seasons: <strong>{number_of_seasons}</strong> | Episodes:{" "}
                      <strong>{number_of_episodes}</strong>
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-dark bg-opacity-50 rounded border border-secondary border-opacity-25 h-100">
                    <h6 className="text-info mb-1 fw-semibold">Language</h6>
                    <p className="m-0">
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
          <div className="mt-5">
            <h6 className="text-info fw-semibold mb-3">Genres</h6>
            <div className="d-flex flex-wrap gap-2">
              {genres?.map((g) => (
                <Link
                  key={g.id}
                  to={`/genre/${mediaType}/${g.id}`}
                  state={{ genreName: g.name }}
                  onClick={() => window.scrollTo(0, 0)}
                  className="badge bg-gradient text-white px-3 py-2 rounded-pill"
                  style={{
                    background:
                      "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
