// HeroSkeleton.jsx
import React from "react";

const HeroSkeleton = () => {
  return (
    <section className="hero position-relative">
      {/* VIDEO PLACEHOLDER */}
      <div
        className="hero-video placeholder-wave w-100"
        style={{
          height: "100vh",
          backgroundColor: "#333",
        }}
      >
        <span className="placeholder w-100 h-100 d-block"></span>
      </div>

      {/* CONTENT */}
      <div className="hero-content container position-absolute top-50 start-50 translate-middle text-white">
        <h1 className="placeholder-glow mb-3">
          <span className="placeholder col-6"></span>
        </h1>

        <p className="placeholder-glow">
          <span className="placeholder col-8"></span>
          <span className="placeholder col-7"></span>
          <span className="placeholder col-5"></span>
        </p>

        <div className="d-flex gap-3 mt-3 placeholder-glow">
          <button className="btn btn-primary disabled placeholder col-2"></button>
          <button className="btn btn-outline-light disabled placeholder col-3"></button>
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
