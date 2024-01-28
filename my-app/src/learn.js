import React, { useEffect, useRef, useState } from 'react';
import Vex from 'vexflow';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Blink from 'react-blink-text';

const Learn = () => {

    const outputRef = useRef(null); // Create a ref for the DOM element
    const [showTimer, setShowTimer] = useState(true);
    const [showBackground, setShowBackground] = useState(true);

    const handleTimerComplete = () => {
        setShowTimer(false); // Hide the timer

        return [false, 0]; // Stop the timer
    }

    useEffect(() => {

        let testdata = [
            { 'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8 },
            { 'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8 },
            { 'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4 },
            { 'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4 },
            { 'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4 },
            { 'note': 'E', 'magnitude': 'e', 'time': 1500, 'value': 2 },
            { 'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8 },
            { 'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8 },
            { 'note': 'D', 'magnitude': 'd', 'time': 750, 'value': 4 },
            { 'note': 'C1', 'magnitude': 'c', 'time': 750, 'value': 4 },
            { 'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4 },
            { 'note': 'F', 'magnitude': 'f', 'time': 1500, 'value': 2 },
            { 'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8 },
            { 'note': 'C1', 'magnitude': 'c', 'time': 375, 'value': 8 },
            { 'note': 'C2', 'magnitude': 'c', 'time': 750, 'value': 4 },
            { 'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4 },
            { 'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4 },
            { 'note': 'D', 'magnitude': 'd', 'time': 1500, 'value': 2 },
            { 'note': 'B', 'magnitude': 'b', 'time': 375, 'value': 8 },
            { 'note': 'B', 'magnitude': 'b', 'time': 375, 'value': 8 },
            { 'note': 'A', 'magnitude': 'a', 'time': 750, 'value': 4 },
            { 'note': 'F', 'magnitude': 'f', 'time': 750, 'value': 4 },
            { 'note': 'G', 'magnitude': 'g', 'time': 750, 'value': 4 },
            { 'note': 'F', 'magnitude': 'f', 'time': 1500, 'value': 2 }
        ]


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

    return (
        <div id="multi">

            <div id="sheet-music-container">
                {/* Attach the ref to the div which will contain the sheet music */}
                <div id="learn-carousel">
                    <div id="learn-slide1">
                        <div id="learn-slide">
                            <div id="output" ref={outputRef}></div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div id="multi-titlecontainer">
                <div id="rectangle">
                    <div id="timer">
                        {showTimer && ( // Render the timer only if showTimer is true
                            <CountdownCircleTimer
                                isPlaying
                                duration={3}
                                colors={[
                                    ['#red', 0.33],
                                    ['#red', 0.33],
                                    ['#red', 0.33],
                                ]}
                                onComplete={handleTimerComplete}
                            >
                                {({ remainingTime }) => (
                                    <span style={{ color: 'black', fontSize: '30px' }}>
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