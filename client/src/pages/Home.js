import React from "react";
import { Link } from "react-router-dom";
import Banner from "../images/banner.jpg";

import "./styles/Home.css";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <div className="home" style={{ backgroundImage: `url(${Banner})` }}>
      <div className="headerContainer">
        <p>
          {" "}
          Indulge in the Ultimate Food Experience: Grab the Tastiest and
          Yummiest Delights!
        </p>

        <Link to="/menu">
          <button>ORDER NOW</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
