import React from "react";
import Navbar from "../Components/Navbar";
import MovieHero from "../Components/MovieHero";
import Cast from "../Components/Cast";
import { useParams } from "react-router-dom";
import Similar from "../Components/Similar";
import Overview from "../Components/Overview";
import TVEpisodesSection from "../Components/TVEpisodesSection";

const Series = () => {
    const { id } = useParams();
  return (
    <div className="min-vh-100">
      <Navbar />

      <MovieHero id={id} mediaType="tv" />

      <div className="bg-black">
        <Overview id={id} mediaType="tv" />
        <TVEpisodesSection tvId={id} />
        <Cast id={id} mediaType="tv" />
        <Similar id={id} mediaType="tv" />
      </div>
    </div>
  );
};

export default Series;
