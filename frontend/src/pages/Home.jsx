import React from "react";
import { useNavigate } from "react-router-dom";

import treble from "../assets/treble.png";
import musicsheet from "../assets/musicsheet.svg";
import musicsheet1 from "../assets/musicsheet1.svg";
/*
TESTING IMAGES
import airpods from "../assets/airpods.png";
import doublenote from "../assets/doublenote.png";
import flute from "../assets/flute.png";
import quarterrest from "../assets/quarterrest.png";
*/

const Home = () => {
  let Navigate = useNavigate();

  return (
    <div className="App">
      {/* Title Card with Treble Clef Logo and Buttons */}
      <div id="titleContainer">
        <div id="titleTreble">
          <img id="treble" src={treble} />
        </div>
        <div id="titleOptions">
          <h1 id="title">re-corder</h1>
          <div>
            <button className="playOptions" onClick={() => Navigate("./upload")}>
              {" "}
              > learn{" "}
            </button>
          </div>
          <div>
            <button className="playOptions" onClick={() => Navigate("./uploadMultiplayer")}>
              {" "}
              > multiplayer{" "}
            </button>
          </div>
        </div>
      </div>

      {/* Carousel of Musical Notes */}
      <div id="carousel">
        <div id="logos">
          <div id="logos-slide">
            <img id="musicsheet" src={musicsheet} />
            <img id="musicsheet1" src={musicsheet1} />
            <img id="musicsheet" src={musicsheet} />
            <img id="musicsheet1" src={musicsheet1} />
            <img id="musicsheet" src={musicsheet} />
            <img id="musicsheet1" src={musicsheet1} />
            <img id="musicsheet" src={musicsheet} />
            <img id="musicsheet1" src={musicsheet1} />
          </div>
          <div id="logos-slide">
            <img id="musicsheet" src={musicsheet} />
            <img id="musicsheet1" src={musicsheet1} />
            <img id="musicsheet" src={musicsheet} />
            <img id="musicsheet1" src={musicsheet1} />
            <img id="musicsheet" src={musicsheet} />
            <img id="musicsheet1" src={musicsheet1} />
            <img id="musicsheet" src={musicsheet} />
            <img id="musicsheet1" src={musicsheet1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
