
import './App.css';
import treble from './Assets/treble.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
