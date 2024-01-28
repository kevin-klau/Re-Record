
import './App.css';
import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './home'; // Import your HomePage component
import Upload from './upload'; // 
import Multiplayer from './multiplayer';
import Learn from './learn'
import treble from './Assets/treble.png';
import MultiplayerPage from './Pages/Multiplayer';
import SingleplayerPage from './Pages/Singleplayer';


function App() {
  const [currMusic, setCurrMusic] = useState([
      {'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8},
      {'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8},
      {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
      {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
      {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
      {'note': 'E', 'magnitude': 'e', 'time': 1500, 'value': 2},
      {'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8},
      {'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8},
      {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
      {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
      {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
      {'note': 'F', 'magnitude': 'f', 'time': 1500, 'value': 2},
      {'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8},
      {'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8},
      {'note': 'C2', 'magnitude': 'c', 'time': 750, 'value': 4},
      {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
      {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
      {'note': 'D', 'magnitude': 'd', 'time': 1500, 'value': 2},
      {'note': 'B', 'magnitude': 'b', 'time': 375, 'value': 8},
      {'note': 'B', 'magnitude': 'b', 'time': 375, 'value': 8},
      {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
      {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
      {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
      {'note': 'F', 'magnitude': 'f', 'time': 1500, 'value': 2}
  ]);

  return (
    <div className="App">
      <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/upload" element={<Upload setCurrMusic={setCurrMusic} redirect={"/learn"}/>}/>
        <Route path="/uploadMultiplayer" element={<Upload setCurrMusic={setCurrMusic} redirect={"/multiplayer"}/>}/>

        <Route path="/multiplayer" element={<Multiplayer testdata={currMusic}/>}/>
        <Route path="/learn" element={<Learn testdata={currMusic}/>}/>


        {/* TESTING ONLY */}
        <Route path="/testSingle" element={<SingleplayerPage/>}/>
        <Route path="/testMulti" element={<MultiplayerPage/>}/>
      </Routes> 
      </>
      
  </div>
  );
}

export default App;