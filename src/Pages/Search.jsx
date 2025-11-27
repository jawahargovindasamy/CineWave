import React, { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Navbar";
import SearchBar from "../Components/SearchBar";
import SearchResult from "../Components/SearchResult";
import Pagination from "../Components/Pagination";   // <-- added

const Search = () => {
  const {
    loadMovies,
    trending,
    searchTerm,
    apiCall,
    searchResults,
    setSearchResults,
    searchPage,
    setSearchPage,
    searchTotalPages,
    setSearchTotalPages,
    searchFilter,
    totalCount,
    setTotalCount,
  } = useAuth();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadResult = async (page = 1) => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchPage(1);
      return;
    }

    let endpoint = "/search/multi";
    if (searchFilter === "movie") endpoint = "/search/movie";
    if (searchFilter === "tv") endpoint = "/search/tv";
    if (searchFilter === "person") endpoint = "/search/person";

    const res = await apiCall(endpoint, {
      query: searchTerm,
      page,
    });

    setSearchResults(res.results || []);
    setSearchPage(page);
    setSearchTotalPages(res.total_pages || 1);
    setTotalCount(res.total_results || 0);
  };

  // Debounce Search
  useEffect(() => {
    const delay = setTimeout(() => {
      loadResult(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm, searchFilter]);

  return (
    <div className="bg-black min-vh-100">
      <div className="pb-5">
        <Navbar />
      </div>

      {/* SEARCH INPUT */}
      <SearchBar />

      {/* Trending when search empty */}
      {searchTerm.length === 0 && (
        <SearchResult Result={trending} searchTerm="Trending Now" />
      )}

      {/* SEARCH RESULTS */}
      {searchTerm.length > 0 && (
        <>
          <SearchResult
            Result={searchResults}
            searchTerm={searchTerm}
            totalCount={totalCount}
          />

          {/* Pagination */}
          {searchResults.length > 0 && (
            <Pagination
              currentPage={searchPage}
              totalPages={searchTotalPages}
              onPrev={() => loadResult(searchPage - 1)}
              onNext={() => loadResult(searchPage + 1)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Search;
