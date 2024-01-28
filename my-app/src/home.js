import React, { useEffect } from "react";
// Importing Link from react-router-dom to 
// navigate to different end points.
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import treble from './Assets/treble.png';

import musicsheet from './Assets/musicsheet.svg';
import musicsheet1 from './Assets/musicsheet1.svg';
import airpods from './Assets/airpods.png';
import doublenote from './Assets/doublenote.png';
import flute from './Assets/flute.png';
import quarterrest from './Assets/quarterrest.png';

const Home = () => {
  let Navigate = useNavigate();
  function clickLearn(){
    Navigate('./upload')
  }

  function clickMultiplayer(){
    Navigate('./uploadMultiplayer')
  }

    return (    
    <div className="App">
      
      
      
      <div id="titleContainer">
        
        <div id="titleTreble"> 
          
          <img id="treble" src={treble}/>
        </div>
        <div id="titleOptions">
          <h1 id="title">re-corder</h1>
          <div><button className="playOptions" onClick={clickLearn}> > learn </button></div>
          <div><button className="playOptions" onClick={clickMultiplayer}> > multiplayer </button></div>
        </div>
      </div>
      <div id="carousel">
        <div id="logos">
          <div id="logos-slide">
            <img id="musicsheet" src={musicsheet}/>
            <img id="musicsheet1" src={musicsheet1}/>
            <img id="musicsheet" src={musicsheet}/>
            <img id="musicsheet1" src={musicsheet1}/>
            <img id="musicsheet" src={musicsheet}/>
            <img id="musicsheet1" src={musicsheet1}/>
            <img id="musicsheet" src={musicsheet}/>
            <img id="musicsheet1" src={musicsheet1}/>
          </div>
          <div id="logos-slide">
            <img id="musicsheet" src={musicsheet}/>
            <img id="musicsheet1" src={musicsheet1}/>
            <img id="musicsheet" src={musicsheet}/>
            <img id="musicsheet1" src={musicsheet1}/>
            <img id="musicsheet" src={musicsheet}/>
            <img id="musicsheet1" src={musicsheet1}/>
            <img id="musicsheet" src={musicsheet}/>
            <img id="musicsheet1" src={musicsheet1}/>
          </div>
        </div>
      </div>
    </div>
    );
};
 
export default Home;