import { FC } from "react";

import { Navbar } from "../../components";

import "./styles.scss";

const Home: FC = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="main-hero">
        <div className="header-container">
          <h1>
            <span>Where the world</span>
            <br />
            <span>builds robots</span>
          </h1>
        </div>

        {/* Image should go beind text for Responsive? */}
        <div className="image-wrapper">Cool Image</div>
      </div>
    </div>
  );
};

export default Home;
