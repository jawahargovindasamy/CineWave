import React from "react";
import Navbar from "../Components/Navbar";
import MovieHero from "../Components/MovieHero";
import Cast from "../Components/Cast";
import { useParams } from "react-router-dom";
import Similar from "../Components/Similar";
import Overview from "../Components/Overview";

const Movie = () => {
    const { id } = useParams();

  return (
    <div className="min-vh-100">
      <Navbar />

      <MovieHero id={id} mediaType="movie" />

      <div className="bg-black">
        <Overview id={id} mediaType="movie" />
        <Cast id={id} mediaType="movie" />
        <Similar id={id} mediaType="movie" />
      </div>
    </div>
  );
};

export default Movie;
