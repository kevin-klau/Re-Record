
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './home'; // Import your HomePage component
import Upload from './upload'; // 
import Multiplayer from './multiplayer';
import Learn from './learn'
import treble from './Assets/treble.png';
import MultiplayerPage from './Pages/Multiplayer';
import SingleplayerPage from './Pages/Singleplayer';

function App() {
  return (
    <div className="App">
      <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/upload" element={<Upload/>}/>
        <Route path="/multiplayer" element={<Multiplayer/>}/>
        <Route path="/learn" element={<Learn/>}/>
        <Route path="/testSingle" element={<SingleplayerPage/>}/>
        <Route path="/testMulti" element={<MultiplayerPage/>}/>
      </Routes> 
      </>
      
  </div>
  );
}

export default App;