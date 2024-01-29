import React, { useEffect, useRef, useState } from 'react';
import Vex from 'vexflow';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import io from "socket.io-client";
let testdata = [
  {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
  {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
  {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
  {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
  {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
  {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
  {'note': 'G', 'magnitude': 'g', 'time': 1500, 'value': 2},
  {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
  {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
  {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
  {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
  {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
  {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
  {'note': 'C1', 'magnitude': 'c', 'time': 1500, 'value': 2},
  {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
  {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
  {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
  {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
  {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
  {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
  {'note': 'D', 'magnitude': 'd', 'time': 1500, 'value': 2},
  {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
  {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
  {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
  {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
  {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
  {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
  {'note': 'D', 'magnitude': 'd', 'time': 1500, 'value': 2},
  {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
  {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
  {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
  {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
  {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
  {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
  {'note': 'G', 'magnitude': 'g', 'time': 1500, 'value': 2},
  {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
  {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
  {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
  {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
  {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
  {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
  {'note': 'C1', 'magnitude': 'c', 'time': 1500, 'value': 4}
]


const Learn = () => {
    const [start, setStart] = useState(false);
    const [frame, setFrame] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlaying1, setIsPlaying1] = useState(false)
    const [noteP1, setNoteP1] = useState("");
    const [noteP2, setNoteP2] = useState("");
    const [playSpeed, setPlaySpeed] = useState(60)
    const [correct, setCorrect] = useState(false);
    const [correct1, setCorrect1] = useState(false)

    let songLength=60;
    let pausems=375;

    const changeCorrect1 = () => {
      setCorrect1(false);
      setCorrect1(true);

      console.log("changed");
    }
    const changeCorrect = () => {
      changeCorrect1();
      setCorrect(false);  
      setCorrect(true);

        console.log("CHANGED")
    }
    const pause1 = () =>{
      setIsPlaying1(true)
    }
    const stop1 = () =>{
      setIsPlaying1(false);
    }
    const pause = () => {
        setIsPlaying(true);
    }
    const stop = () => {
        setIsPlaying(false);
    }

    useEffect(() => {
      // Define the socket here so it's available in the entire scope of useEffect
      const socket = io("ws://localhost:5001");
      console.log("Attempting to connect...");
      socket.emit("multiPlayer", { data: "Initiating stream..." });
  
      const handleConnect = () => {
        console.log("Connected successfully.");
        setStart(true);
      };
      const handleFrame = (data) => {setFrame(data.data);};
  
      socket.on("connect", handleConnect);
      socket.on("frameMultiPlayer", handleFrame);
      socket.on("noteP1", note => setNoteP1(note));
      socket.on("noteP2", note => setNoteP2(note));

  
      // Cleanup on component unmount
      return () => {
        socket.off("noteP1", noteP1);
        socket.off("noteP2", noteP2);

        socket.off("connect", handleConnect);
        socket.off("frameMultiPlayer", handleFrame);
        socket.disconnect();  // Ensure socket is disconnected
        console.log("Socket disconnected on component unmount");
      };
    }, []);
    
    const outputRef = useRef(null); // Create a ref for the DOM element
    const outputRef1 = useRef(null);
    const [showTimer, setShowTimer] = useState(true);
    const [showBackground, setShowBackground] = useState(true);

    const handleTimerComplete = () => {
        setShowTimer(false); // Hide the timer

        return [false, 0]; // Stop the timer
    }

    const [toggle, setToggle] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
          if (toggle && correct) {
            pause();
            setCorrect(false);
            setToggle(false); // Toggle the state
          } else {
            stop();
            setToggle(true); // Toggle the state
          }
          if(toggle && correct1){
            pause1();
            setCorrect1(false);
            setToggle(false)
          } else {
            stop1();
            setToggle(true)
          }
        }, 950); // Interval set for 3 seconds
    
        return () => clearInterval(interval);
      }, [correct, correct1]); // Dependency on toggle state
      
      const[currIndex, setCurrIndex] = useState(0);
      const[currIndex1, setCurrIndex1] = useState(0);

      useEffect(()=>{
        if(noteP1 == testdata[currIndex].note.toLowerCase()) {
            console.log("CORRECT");
            setCorrect(true);
            setCurrIndex(currIndex+1);
        }
        setTimeout(50);
    }, [noteP1])

    useEffect(()=>{
      if(noteP2 == testdata[currIndex1].note.toLowerCase()) {
          console.log("CORRECT");
          setCorrect1(true);
          setCurrIndex1(currIndex1+1);
      }
      setTimeout(50);
  }, [noteP2])
    useEffect(() => {

        let testdata = [
          {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
          {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
          {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
          {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
          {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
          {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
          {'note': 'G', 'magnitude': 'g', 'time': 1500, 'value': 2},
          {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
          {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
          {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
          {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
          {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
          {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
          {'note': 'C1', 'magnitude': 'c', 'time': 1500, 'value': 2},
          {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
          {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
          {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
          {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
          {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
          {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
          {'note': 'D', 'magnitude': 'd', 'time': 1500, 'value': 2},
          {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
          {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
          {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
          {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
          {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
          {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
          {'note': 'D', 'magnitude': 'd', 'time': 1500, 'value': 2},
          {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
          {'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4},
          {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
          {'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4},
          {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
          {'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4},
          {'note': 'G', 'magnitude': 'g', 'time': 1500, 'value': 2},
          {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
          {'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4},
          {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
          {'note': 'E', 'magnitude': 'e', 'time': 750, 'value': 4},
          {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
          {'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4},
          {'note': 'C1', 'magnitude': 'c', 'time': 1500, 'value': 4}
        ]
        
        console.log('HIHI')
        let sum = 0;
        for (let i = 0; i < testdata.length; i++){
            sum += testdata[i].time;
        }
        console.log(sum)
        songLength=sum/1000;

        for (let i = 0; i < testdata.length; i++){
            if(testdata[i].value === 8) {
                pausems=testdata[i].time;
                break;
            }
        }
        
        if(outputRef.current){
          outputRef.current.innerHTML = '';
          const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;
          const renderer = new Renderer(outputRef.current, Renderer.Backends.SVG);

          const length = testdata.length
          renderer.resize((window.innerWidth/2), 120); // Adjust the size accordingly
          const context = renderer.getContext();

          const stave = new Stave(50, 0, (window.innerWidth/2)); // Width to match the renderer width
          stave.addClef("treble").addTimeSignature("4/4");
          stave.setContext(context).draw();

          const notes = testdata.map(data => {
            const noteKey = data.magnitude + (data.note === 'C2' ? '/5' : '/4');
            return new StaveNote({
                keys: [noteKey],
                duration: String(data.value),
            });
          });

          const voice = new Voice({ num_beats: 4, beat_value: 4 });
          voice.setStrict(false); // Disable the total duration check of the voice
          voice.addTickables(notes);

          new Formatter().joinVoices([voice]).format([voice], 1500);
          voice.draw(context, stave);

        }

        if (outputRef1.current) {
            outputRef1.current.innerHTML = '';
            const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

            // Create an SVG renderer and attach it to the DOM element.
            const renderer1 = new Renderer(outputRef1.current, Renderer.Backends.SVG);
      
            const length = testdata.length

            renderer1.resize((window.innerWidth/2), 120); // Adjust the size accordingly
            const context1 = renderer1.getContext();

            // Create a stave at position 10 on the canvas.
            const stave1 = new Stave(50, 0, (window.innerWidth/2)); // Width to match the renderer width
            stave1.addClef("treble").addTimeSignature("4/4");
            stave1.setContext(context1).draw();
          
            // Map your testdata to VexFlow StaveNotes
        

            const notes1 = testdata.map(data => {
                const noteKey1 = data.magnitude + (data.note === 'C2' ? '/5' : '/4');
                return new StaveNote({
                    keys: [noteKey1],
                    duration: String(data.value),
                });
            });

            // Create a voice in 4/4 and add the notes
            

            const voice1 = new Voice({ num_beats: 4, beat_value: 4 });
            voice1.setStrict(false); // Disable the total duration check of the voice
            voice1.addTickables(notes1);

            // Format and justify the notes to the width of the stave
            new Formatter().joinVoices([voice1]).format([voice1], 1500);

            // Draw the voice
            voice1.draw(context1, stave1);

        }

        

    }, []);

    return (
        <div id="multi">

            <div id="sheet-music-container">
                {/* Attach the ref to the div which will contain the sheet music */}
                <div id="learn-carousel">
                  
                    <div id="learn-slide1">
                        <div id="learn-slide" style={{ width:'50vw', animation: "15s sheetmusic linear", animationPlayState: isPlaying ? 'running' : 'paused' }}>
                            <div id="output" ref={outputRef}></div>
                            
                        </div>
                        <div id="learn-slide" style={{ overflowX:'none', width:'50vw', animation: "14s sheetmusic linear", animationPlayState: isPlaying1 ? 'running' : 'paused' }}>
                            <div id="outputP1" ref={outputRef1}></div>
                        </div>
                        
                    </div>
                </div>
            </div>

            <div id="blackBarL"></div>
            <div id="blackBarR"></div>
            <div id="multi-titlecontainer">
            <button onClick={changeCorrect} style={{backgroundColor:'#EFEFE8', borderColor:'#EFEFE8'}}>      </button>
                <div id="rectangle">
                <img src={`data:image/jpeg;base64,${frame}`} alt="Stream Fail" style={{height:'100%'}}/>
                    <div id="timer">
                    

                        {showTimer && ( // Render the timer only if showTimer is true
                            <CountdownCircleTimer
                                isPlaying
                                duration={10}
                                colors={[
                                    ['#red', 0.33],
                                    ['#red', 0.33],
                                    ['#red', 0.33],
                                ]}
                                onComplete={handleTimerComplete}
                            >
                                {({ remainingTime }) => (
                                    <span id="timeCount">
                                        {remainingTime}
                                    </span>
                                )}
                            </CountdownCircleTimer>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Learn;