import axios from "axios";
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const TMDB_KEY = "71c08a91c58d917b27e9bff6913900de";
  const TMDB_URL = "https://api.themoviedb.org/3";

  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [tv, setTV] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchFilter, setSearchFilter] = useState("all");
  const [muted, setMuted] = useState(true);

  const axiosTMDB = axios.create({
    baseURL: TMDB_URL,
    params: {
      api_key: TMDB_KEY,
    },
  });

  const apiCall = async (endpoint, extraParams = {}) => {
    const res = await axiosTMDB.get(endpoint, { params: extraParams });
    return res.data;
  };

  const loadMovies = async () => {
    setTrending((await apiCall("/trending/all/week")).results);
    setTopRated((await apiCall("/movie/top_rated")).results);
    setTV((await apiCall("/discover/tv")).results);
    setUpcoming((await apiCall("/movie/upcoming")).results);
  };

  const getSimilar = async (mediaType, id) => {
    const data = await apiCall(`/${mediaType}/${id}/similar`);
    return data.results || [];
  };

  return (
    <AuthContext.Provider
      value={{
        apiCall,
        loadMovies,
        trending,
        topRated,
        tv,
        upcoming,
        searchTerm,
        setSearchTerm,
        searchResults,
        setSearchResults,
        searchPage,
        setSearchPage,
        searchTotalPages,
        setSearchTotalPages,
        totalCount,
        setTotalCount,
        searchFilter,
        setSearchFilter,
        getSimilar,
        muted,
        setMuted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
