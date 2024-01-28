import React, { useEffect, useRef, useState } from 'react';
import Vex from 'vexflow';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import io from "socket.io-client";


const Learn = (props) => {    
    //const [testdata, setTestData] = useState(props.testdata);
    console.log(props.testdata)
    let testdata = props.testdata;
  
    const [start, setStart] = useState(false);
    const [frame, setFrame] = useState("");
    const [loading, setLoading] = useState(false);
  
    const [isPlaying, setIsPlaying] = useState(false);
    const [note, setNote] = useState("");
    const [currIndex, setCurrIndex] = useState(0);
    const [playSpeed, setPlaySpeed] = useState(60)
    const [correct, setCorrect] = useState(false);

    let songLength=60;
    let pausems=375;

    const changeCorrect = () => {
        setCorrect(false);
        setCorrect(true);

        console.log("CHANGED")
    }

    const x2 = () => {
        setPlaySpeed(songLength/2)
    }
    

    const x4 = () => {
        setPlaySpeed(songLength/4)
    }
    
    const x1 = () => {
        setPlaySpeed(songLength/1)
    }

    const pause = () => {
        setIsPlaying(true);
    }
    const stop = () => {
        setIsPlaying(false);
    }

    useEffect(() => {
      // Define the socket here so it's available in the entire scope of useEffect
      const socket = io("ws://127.0.0.1:5001");
      console.log("Attempting to connect...");
      socket.emit("singlePlayer", { data: "Initiating stream..." });
  
      const handleConnect = () => {
        console.log("Connected successfully.");
        setStart(true);
      };
      const handleFrame = (data) => {setFrame(data.data);};
  
      socket.on("connect", handleConnect);
      socket.on("frameSinglePlayer", handleFrame);
      socket.on("note", note => setNote(note));
  
      // Cleanup on component unmount
      return () => {
        socket.off("note", note);
        socket.off("connect", handleConnect);
        socket.off("frameSinglePlayer", handleFrame);
        socket.disconnect();  // Ensure socket is disconnected
        console.log("Socket disconnected on component unmount");
      };
    }, []);
    
    const outputRef = useRef(null); // Create a ref for the DOM element
    const [showTimer, setShowTimer] = useState(true);
    const [showBackground, setShowBackground] = useState(true);

    const handleTimerComplete = () => {
        setShowTimer(false); // Hide the timer

        return [false, 0]; // Stop the timer
    }

    const [toggle, setToggle] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
          if (correct) {
            pause();
            setCorrect(false);
            setToggle(false); // Toggle the state
          } else {
            stop();
            setToggle(true); // Toggle the state
          }
        }, 730); // Interval set for 3 seconds
    
        return () => clearInterval(interval);
      }, [correct]); // Dependency on toggle state
    

    useEffect(() => {
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
        


        if (outputRef.current) {
            outputRef.current.innerHTML = '';
            const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

            // Create an SVG renderer and attach it to the DOM element.
            const renderer = new Renderer(outputRef.current, Renderer.Backends.SVG);

            const length = testdata.length
            // Configure the rendering context.
            renderer.resize(window.innerWidth, 120); // Adjust the size accordingly
            const context = renderer.getContext();

            // Create a stave at position 10 on the canvas.
            const stave = new Stave(10, 0, window.innerWidth); // Width to match the renderer width
            stave.addClef("treble").addTimeSignature("4/4");
            stave.setContext(context).draw();

            // Map your testdata to VexFlow StaveNotes
            const notes = testdata.map(data => {
                const noteKey = data.magnitude + (data.note === 'C2' ? '/5' : '/4');
                return new StaveNote({
                    keys: [noteKey],
                    duration: String(data.value),
                });
            });

            // Create a voice in 4/4 and add the notes
            const voice = new Voice({ num_beats: 4, beat_value: 4 });
            voice.setStrict(false); // Disable the total duration check of the voice
            voice.addTickables(notes);

            // Format and justify the notes to the width of the stave
            new Formatter().joinVoices([voice]).format([voice], 1500);

            // Draw the voice
            voice.draw(context, stave);
        }
    }, []);

    useEffect(()=>{
        if(note.toLowerCase() == testdata[currIndex].note.toLowerCase()) {
            console.log("CORRECT");
            setCorrect(true);
            setCurrIndex(currIndex+1);
            console.log(testdata[currIndex].note.toLowerCase());
        }
        setTimeout(50);
    }, [note])


    return (
        <div id="multi">

            <div id="sheet-music-container">
                {/* Attach the ref to the div which will contain the sheet music */}
                <div id="learn-carousel">
                    <div id="learn-slide1">
                        <div id="learn-slide" style={{ animation: "20s sheetmusic linear", animationPlayState: isPlaying ? 'running' : 'paused' }}>
                            <div id="output" ref={outputRef}></div>
                        </div>
                    </div>
                    
                </div>
               
            </div>
            <div id="blackBar"></div>
            <div id="multi-titlecontainer">
                <button onClick={changeCorrect}>meow</button>
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