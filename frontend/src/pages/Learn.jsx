import React, { useEffect, useRef, useState } from "react";
import useSocket from "../utils/useSocket";
import Vex from "vexflow";
import { CountdownCircleTimer } from "react-countdown-circle-timer";


const Learn = (props) => {
  const testdata = props.testdata;
  const [frame, note] = useSocket("note");
  const [currIndex, setCurrIndex] = useState(0);
  const outputRef = useRef(null);
  const [showTimer, setShowTimer] = useState(true);

  /* Create The Actual Musical Notes + Sheet Music */
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.innerHTML = "";
      const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;
      const renderer = new Renderer(outputRef.current, Renderer.Backends.SVG);

      renderer.resize(window.innerWidth, 120);
      const context = renderer.getContext();
      const stave = new Stave(10, 0, window.innerWidth);
      stave.addClef("treble").addTimeSignature("4/4");
      stave.setContext(context).draw();

      const notes = testdata.map((data) => {
        const noteKey = data.magnitude + (data.note === "C2" ? "/5" : "/4");
        return new StaveNote({
          keys: [noteKey],
          duration: String(data.value),
        });
      });

      const voice = new Voice({ num_beats: 4, beat_value: 4 });
      voice.setStrict(false);
      voice.addTickables(notes);
      new Formatter().joinVoices([voice]).format([voice], 1500);
      voice.draw(context, stave);
    }
  }, []);

  /* Update the Index Whenever A User Plays The Correct Note */
  useEffect(() => {
    if (
      note != undefined &&
      note.toLowerCase() === testdata[currIndex].note.toLowerCase()
    ) {
      console.log("CORRECT");
      setCurrIndex(currIndex + 1);
    }
    setTimeout(() => {}, 50); // Update to properly handle async timing
  }, [note]);

  return (
    <div id="multi">
      {/* Musical Sheet w/ Notes */}
      <div id="sheet-music-container">
        <div id="learn-carousel">
          <div id="learn-slide1">
            <div
              id="learn-slide"
              style={{
                animation: "20s sheetmusic linear",
                animationPlayState: "paused",
              }}
            >
              <div id="output" ref={outputRef}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Moving Bar */}
      <div id="redBar"></div>

      {/* Camera Frame */}
      <div id="multi-titlecontainer">
        <div id="rectangle">
          <img
            src={`data:image/jpeg;base64,${frame}`}
            alt="Stream Fail"
            style={{ height: "100%" }}
          />
          <div id="timer">
            {showTimer && (
              <CountdownCircleTimer
                duration={10}
                colors={[
                  ["#red", 0.33],
                  ["#red", 0.33],
                  ["#red", 0.33],
                ]}
                onComplete={() => {
                  setShowTimer(false);
                  return [false, 0];
                }}
              >
                {({ remainingTime }) => (
                  <span id="timeCount">{remainingTime}</span>
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
