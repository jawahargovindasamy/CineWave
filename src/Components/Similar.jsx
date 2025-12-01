import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import MediaCard from "../Components/MediaCard"; // import our new card
import CardSkeleton from "./CardSkeleton";

const Similar = ({ id, mediaType }) => {
  const { getSimilar } = useAuth();
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchSimilar = async () => {
      if (!id || !mediaType) return;

      const items = await getSimilar(mediaType, id);
      setSimilarItems(items);
      setLoading(false);
    };

    fetchSimilar();
  }, [id, mediaType]);

  if (similarItems.length === 0) return null;

  return (
    <div className="pb-4 px-3 mt-4">
      <h3 className="text-white mb-3">
        Similar {mediaType === "movie" ? "Movies" : "TV Shows"}
      </h3>

      <div className="container-fluid">
        {loading ? (
          <div
            className="d-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
            {similarItems.map((item) => {
              const isPerson = item.media_type === "person";
              const image = isPerson ? item.profile_path : item.poster_path;
              const title = isPerson ? item.name : item.title || item.name;

              return (
                <div key={item.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  {isPerson ? (
                    // person card - unchanged
                    <div
                      style={{
                        width: "100%",
                        height: "250px",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={
                          image
                            ? `https://image.tmdb.org/t/p/w500${image}`
                            : "/no-image.png"
                        }
                        alt={title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <MediaCard
                      image={image}
                      title={title}
                      rating={item.vote_average}
                      onClick={() => {
                        navigate(`/${item.media_type || mediaType}/${item.id}`);
                        window.scrollTo(0, 0);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Similar;
