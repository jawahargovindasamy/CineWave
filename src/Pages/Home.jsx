import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import MovieCarousel from "../Components/MovieCarousel";
import Hero from "../Components/Hero";
import Navbar from "../Components/Navbar";

const Home = () => {
  const { loadMovies, trending, topRated, tv } = useAuth();

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <>
      <Navbar />
      <Hero trendingMovies={trending} />
      <div style={{ background: "black", paddingBottom: "60px" }}>
        <MovieCarousel title="Trending Now" movies={trending} />
        <MovieCarousel title="Top Rated" movies={topRated} />
        <MovieCarousel title="TV Originals" movies={tv} />
      </div>
    </>
  );
};

export default Home;
