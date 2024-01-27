
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './home'; // Import your HomePage component
import Teach from './teach'; // 
import Multiplayer from './multiplayer';

import treble from './Assets/treble.png';

function App() {
  return (
    <div className="App">
      <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/learn" element={<Teach/>}/>
        <Route path="/multiplayer" element={<Multiplayer/>}/>
      </Routes> 
      </>
      
  </div>
  );
}

export default App;