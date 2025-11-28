import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

const Cast = ({ id, mediaType }) => {
  const { apiCall } = useAuth();
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchCast = async () => {
      if (!id) return;

      const data = await apiCall(`/${mediaType}/${id}/credits`);
      setCast(data.cast || []);
    };

    fetchCast();
  }, [id, mediaType, apiCall]);

  if (!cast.length) return null;

  return (
    <div className="px-4 py-4 mx-4 mt-4 card bg-dark text-white shadow-sm rounded-3 border-0">
      <div className="card-body">
        <h2 className="fs-4 fw-bold mb-4 border-start border-4 ps-3">
          Cast
        </h2>

        <div className="row gy-4">
          {cast.slice(0, 15).map((actor) => (
            <div key={actor.id} className="col-12 col-md-6 col-lg-4">
              <div className="d-flex align-items-center bg-secondary bg-opacity-25 p-3 rounded shadow-sm">

                {/* Actor Image */}
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                  }
                  alt={actor.name}
                  className="rounded shadow-sm me-3"
                  style={{
                    width: "70px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />

                {/* Actor Info */}
                <div>
                  <p className="fw-semibold text-white mb-1">{actor.name}</p>
                  <p className="text-white-50 mb-0 small">{actor.character}</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cast;
