// src/components/Layout.js
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrap">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
