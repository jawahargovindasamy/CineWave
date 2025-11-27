import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import MediaCard from "./MediaCard";
import { useNavigate } from "react-router-dom";

const MovieCarousel = ({ title, movies = [] }) => {
  const [cardsPerSlide, setCardsPerSlide] = useState(5);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 425) setCardsPerSlide(2);
      else if (window.innerWidth <= 768) setCardsPerSlide(3);
      else if (window.innerWidth <= 992) setCardsPerSlide(4);
      else setCardsPerSlide(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(movies.length === 0);
  }, [movies]);

  const slides = [];
  for (let i = 0; i < movies.length; i += cardsPerSlide) {
    slides.push(movies.slice(i, i + cardsPerSlide));
  }

  const handleCardClick = (movie) => {
    const type = movie.media_type || (movie.title ? "movie" : "tv");
    navigate(`/${type}/${movie.id}`);
  };

  const LoadingSlide = () => (
    <div className="d-flex gap-2 gap-md-3 px-2 px-md-3 py-2">
      {Array.from({ length: cardsPerSlide }).map((_, idx) => (
        <div key={idx} className="flex-fill movie-card-wrapper">
          <div className="skeleton-card" />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="movie-slider-container mb-4 mb-md-5">
        <h3 className="slider-title text-white fw-bold mb-3 mb-md-4 px-3 px-md-4">
          {title}
        </h3>
        <LoadingSlide />
        <style>{`
          .skeleton-card {
            width: 100%;
            height: 300px;
            border-radius: 12px;
            background: #1a1a1a;
            position: relative;
            overflow: hidden;
          }

          .skeleton-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: -150px;
            width: 150px;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: shimmer 1.2s infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(0); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="movie-slider-container mb-4 mb-md-5">
      <h3 className="slider-title text-white fw-bold mb-3 mb-md-4 px-3 px-md-4">
        {title}
      </h3>
      <Carousel
        indicators={false}
        controls
        interval={null}
        className="movie-carousel"
      >
        {slides.map((group, i) => (
          <Carousel.Item key={i}>
            <div className="d-flex gap-2 gap-md-3 px-2 px-md-3 py-2">
              {group.map((movie) => (
                <div key={movie.id} className="flex-fill movie-card-wrapper">
                  <MediaCard
                    image={movie.poster_path}
                    title={movie.title || movie.name}
                    rating={movie.vote_average}
                    onClick={() => handleCardClick(movie)}
                  />
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <style>{`
        .movie-slider-container {
          position: relative;
        }

        .slider-title {
          font-size: 1.5rem;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .movie-carousel .carousel-control-prev,
        .movie-carousel .carousel-control-next {
          width: 50px;
          height: 100%;
          background: linear-gradient(to right, rgba(0,0,0,0.7), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .movie-carousel .carousel-control-next {
          background: linear-gradient(to left, rgba(0,0,0,0.7), transparent);
        }

        .movie-slider-container:hover .carousel-control-prev,
        .movie-slider-container:hover .carousel-control-next {
          opacity: 1;
        }

        .movie-carousel .carousel-control-prev-icon,
        .movie-carousel .carousel-control-next-icon {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
          width: 30px;
          height: 30px;
        }

        .movie-card-wrapper {
          min-width: 0;
          transition: transform 0.3s ease;
        }

        /* Responsive font sizes */
        @media (max-width: 768px) {
          .slider-title {
            font-size: 1.3rem;
          }

          .movie-carousel .carousel-control-prev,
          .movie-carousel .carousel-control-next {
            width: 40px;
          }

          .movie-carousel .carousel-control-prev-icon,
          .movie-carousel .carousel-control-next-icon {
            width: 25px;
            height: 25px;
          }
        }

        @media (max-width: 480px) {
          .slider-title {
            font-size: 1.1rem;
          }

          .movie-carousel .carousel-control-prev,
          .movie-carousel .carousel-control-next {
            width: 35px;
          }

          .movie-carousel .carousel-control-prev-icon,
          .movie-carousel .carousel-control-next-icon {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default MovieCarousel;
