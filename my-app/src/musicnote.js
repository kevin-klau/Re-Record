import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';

const MusicScore = () => {
  const outputRef = useRef(null); // Create a ref for the DOM element

  useEffect(() => {
    // Make sure the element is available
    if (outputRef.current) {
      // Destructure Factory, EasyScore, and System from Vex.Flow
      const { Factory, EasyScore, System } = Vex.Flow;

      // Create a new VexFlow Factory with the output element
      // and set the renderer's width and height
      const vf = new Factory({
        renderer: { elementId: outputRef.current.id, width: 500, height: 200 },
      });

      // Create an EasyScore instance
      const score = vf.EasyScore();

      // Create a system to hold the staves
      const system = vf.System();

      // Add a stave to the system and add notes to the stave
      system.addStave({
        voices: [
          score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
          score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
        ],
      })
      .addClef('treble')
      .addTimeSignature('4/4');

      // Draw the VexFlow music notation
      vf.draw();
    }
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <div ref={outputRef} id="output"></div> {/* Attach the ref here */}
    </div>
  );
};

export default MusicScore;
