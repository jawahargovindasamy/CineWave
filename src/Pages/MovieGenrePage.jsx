import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Navbar";
import MediaCard from "../Components/MediaCard";
import Pagination from "../Components/Pagination";
import CardSkeleton from "../Components/CardSkeleton";

const MovieGenrePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { apiCall } = useAuth();

  const navigate = useNavigate();

  const [genreName] = useState(location.state?.genreName || "");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (pageNumber = 1) => {
    setLoading(true);
    const data = await apiCall(
      `/discover/movie?with_genres=${id}&page=${pageNumber}`
    );
    setMovies(data.results || []);
    setTotalPages(data.total_pages || 1);
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
  }, [id]);

  useEffect(() => {
    fetchMovies(page);
  }, [id, page]);

  const handlePrev = () => {
    if (page > 1) {
      setPage((p) => p - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="bg-black min-vh-100">
      <div className="pb-4">
        <Navbar />
      </div>

      <div className="px-4 py-4 mt-5 mt-md-4">
        <h3 className="text-white fw-bold mb-4">
          {genreName ? `${genreName} Movies` : "Movies"}
        </h3>

        <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 mb-4">
          {loading
            ? Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="col">
                  <CardSkeleton/>
                </div>
              ))
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  className="col"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <MediaCard
                    image={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/no-image.png"
                    }
                    title={movie.title}
                    rating={movie.vote_average}
                    onClick={() => {
                      navigate(`/movie/${movie.id}`);
                      window.scrollTo(0, 0);
                    }}
                  />
                </div>
              ))}
        </div>
        {/* PAGINATION */}
        {!loading && movies.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
};

export default MovieGenrePage;
