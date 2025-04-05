import React from "react";

const Footer = () => {
  return (
    <footer className="footer"
      style={{
        backgroundColor: "#1f2937",
        color: "white",
        textAlign: "center",
        padding: "1rem",
        marginTop: "2rem",
      }}
    >
      <p>© {new Date().getFullYear()} Investments App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
