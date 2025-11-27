import React, { useState } from "react";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";

const SearchBar = () => {
  const { searchTerm, setSearchTerm, searchFilter, setSearchFilter } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (value) => {
    setSearchFilter(value);
    setShowDropdown(false);
  };

  return (
    <div className="mt-5 w-100 d-flex justify-content-center position-relative">
      <div className="position-relative" style={{ width: "80%" }}>

        {/* INPUT BAR */}
        <input
          type="text"
          value={searchTerm}
          className="bg-transparent text-white py-2 px-5 w-100"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Movies, TV Series and more"
          style={{
            border: "2px solid white",
            borderRadius: "40px",
            outline: "none",
            fontSize: "1rem",
            transition: "0.3s ease",
          }}
        />

        {/* SEARCH ICON */}
        <FaSearch
          className="position-absolute text-white"
          style={{
            top: "50%",
            left: "20px",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* CLEAR ICON */}
        {searchTerm && (
          <FaTimes
            className="position-absolute text-white"
            style={{
              top: "50%",
              right: "60px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={() => setSearchTerm("")}
          />
        )}

        {/* FILTER ICON */}
        <FaFilter
          className="position-absolute text-white"
          style={{
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
          onClick={() => setShowDropdown(!showDropdown)}
        />

        {/* DROPDOWN MENU */}
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              right: "10px",
              background: "rgba(0, 0, 0, 0.9)",
              border: "1px solid white",
              borderRadius: "10px",
              padding: "10px",
              minWidth: "150px",
              zIndex: 100,
            }}
          >
            <div
              style={{
                padding: "8px",
                color: searchFilter === "all" ? "yellow" : "white",
                cursor: "pointer",
              }}
              onClick={() => handleSelect("all")}
            >
              All
            </div>
            <div
              style={{
                padding: "8px",
                color: searchFilter === "movie" ? "yellow" : "white",
                cursor: "pointer",
              }}
              onClick={() => handleSelect("movie")}
            >
              Movies
            </div>
            <div
              style={{
                padding: "8px",
                color: searchFilter === "tv" ? "yellow" : "white",
                cursor: "pointer",
              }}
              onClick={() => handleSelect("tv")}
            >
              TV Series
            </div>
            <div
              style={{
                padding: "8px",
                color: searchFilter === "person" ? "yellow" : "white",
                cursor: "pointer",
              }}
              onClick={() => handleSelect("person")}
            >
              Person
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
