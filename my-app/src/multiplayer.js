import React, { useEffect, useRef } from 'react';
import Vex from 'vexflow';

const Multiplayer = () => {
  const outputRef = useRef(null); // Create a ref for the DOM element
  useEffect(() => {
    let testdata = [
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
    ]
    

    const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element named "boo".
    const div = document.getElementById("output");
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 500);
    const context = renderer.getContext();

    let length = testdata.length
    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Stave(10, 80, 200 * length);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    let notes = [];
    testdata.forEach(data => {
      let denom = '4';
      if (data.note === 'C2') denom = '5'
      notes.push(new StaveNote({ keys: [`${data.magnitude}/${denom}`], duration: `${data.value}`}))
    });
  
      // Create a voice in 4/4 and add above notes
      const voice = new Voice({ num_beats: 4, beat_value: 4 });
      voice.setStrict(false)
      voice.addTickables(notes);
      
      // Format and justify the notes to 400 pixels.
      new Formatter().joinVoices([voice]).format([voice], 350);
      
      // Render voice
      voice.draw(context, stave);

  }, []);

  return (
    <div>
      <div id="multi-titlecontainer">
        <div id="multi-title">Multiplayer</div>
      </div>
      <div id="sheet-music-container">
        {/* Attach the ref to the div which will contain the sheet music */}
        <div id="output"></div>
      </div>
    </div>
  );
};

export default Multiplayer;
