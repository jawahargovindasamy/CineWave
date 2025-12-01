import React from "react";
import { FaHome, FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import Logo from "../assests/Logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const navbarIconsStyle = {
    width: "100%",
    gap: "1rem",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "0.5rem",
  };

  return (
    <nav
      className="navbar navbar-expand-sm fixed-top px-3 w-100 z-100"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Brand */}
      <span
        className="navbar-brand text-white fw-bold fs-3 d-flex align-items-center"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/");
          window.scrollTo(0, 0);
        }}
      >
        <img
          src={Logo}
          alt="CineWave Logo"
          style={{ height: "40px", width: "40px", marginRight: "10px" }}
        />
        CineWave
      </span>

      {/* Hamburger toggle button */}
      <button
        className="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarIcons"
        aria-controls="navbarIcons"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <FaBars className="text-white fs-3" />
      </button>

      {/* Collapsible content */}
      <div className="collapse navbar-collapse" id="navbarIcons">
        <div
          className="d-flex w-100 gap-3 mt-2 mt-lg-0 navbar-icons"
          style={navbarIconsStyle}
        >
          <button
            type="button"
            className="btn"
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
          >
            <FaHome className="text-white fs-5" title="Home" />
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              navigate("/search");
              window.scrollTo(0, 0);
            }}
          >
            <FaSearch className="text-white fs-5" title="Search" />
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              navigate("/genres");
              window.scrollTo(0, 0);
            }}
          >
            <BiCategory className="text-white fs-5" title="Genres" />
          </button>
          <button type="button" className="btn">
            <FaUserCircle className="text-white fs-5" title="Profile" />
          </button>
        </div>
      </div>

      {/* Small-screen centering */}
      <style>
        {`
          @media (max-width: 576px) {
            .navbar-icons {
              justify-content: center !important;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
