import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import Movie from "./Pages/Movie";
import Series from "./Pages/Series";
import VideoPlayer from "./Components/VideoPlayer";
import Genres from "./Pages/Genres";
import MovieGenrePage from "./Pages/MovieGenrePage";
import TVGenrePage from "./Pages/TVGenrePage";
import Person from "./Pages/Person";
import Footer from "./Components/Footer";

const AppWrapper = () => {
  const location = useLocation();

  const hide =
    location.pathname.includes("/play");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/movie/:id/play" element={<VideoPlayer />} />
        <Route
          path="/tv/:id/season/:season/episode/:episode/play"
          element={<VideoPlayer />}
        />
        <Route path="/tv/:id" element={<Series />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/genre/movie/:id" element={<MovieGenrePage />} />
        <Route path="/genre/tv/:id" element={<TVGenrePage />} />
        <Route path="/person/:id" element={<Person />} />
      </Routes>

      {!hide && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
};

export default App;
