import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Navbar";
import SearchBar from "../Components/SearchBar";
import SearchResult from "../Components/SearchResult";
import Pagination from "../Components/Pagination";
import CardSkeleton from "../Components/CardSkeleton";

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
    setLoading(false); // trending movies load completed
  }, []);

  const loadResult = async (page = 1) => {
    setLoading(true); // <-- Start showing skeletons

    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchPage(1);
      setLoading(false); // <-- Stop skeletons
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

    setLoading(false); // <-- Stop skeletons after fetching
  };

  // Run search on searchTerm OR filter change
  useEffect(() => {
    loadResult(1);
  }, [searchTerm, searchFilter]);

  return (
    <div className="bg-black min-vh-100">
      <div className="pb-5">
        <Navbar />
      </div>

      {/* SEARCH INPUT */}
      <SearchBar />

      {/* Trending section when search is empty */}
      {searchTerm.length === 0 && (
        <SearchResult Result={trending} searchTerm="Trending Now" />
      )}

      {/* SEARCH RESULTS */}
      {loading ? (
        <div className="container mt-5">
          {/* Heading */}
          <h3 className="text-white fs-4 fw-bold mb-4">{searchTerm}</h3>

          {/* Skeleton Grid */}
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
        </div>
      ) : (
        searchTerm.length > 0 && (
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
                onPrev={() => {
                  loadResult(searchPage - 1);
                  window.scrollTo(0, 0);
                }}
                onNext={() => {
                  loadResult(searchPage + 1);
                  window.scrollTo(0, 0);
                }}
              />
            )}
          </>
        )
      )}
    </div>
  );
};

export default Search;
