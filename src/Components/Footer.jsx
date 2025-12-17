import React from "react";

const Footer = () => {
  return (
    <footer
      className="text-secondary py-4 px-4"
      style={{
        fontSize: "14px",
        background: "#000",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <p className="mb-2">
        Cinewave does not store any files on our server, we only link to the
        media hosted on third-party services.
      </p>

      <p className="mb-0">
        © {new Date().getFullYear()} Cinewave. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
