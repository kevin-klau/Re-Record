import React from "react";
// Importing Link from react-router-dom to 
// navigate to different end points.
import { Link } from "react-router-dom";
 
import treble from './Assets/treble.png';
const Home = () => {
    return (    
      <div className="App">
      
      <div id="titleContainer">
        <div id="titleTreble"> 
          <img id="treble" src={treble}/>
        </div>
        <div id="titleOptions">
          <h1 id="title">re-corder</h1>
          <div><button className="playOptions"> > start </button></div>
          <div><button className="playOptions"> > multiplayer </button></div>
        </div>
      </div>
    </div>
    );
};
 
export default Home;