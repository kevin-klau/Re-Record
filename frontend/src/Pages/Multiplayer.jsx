import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const MultiplayerPage = () => {
  const [start, setStart] = useState(false);
  const [frame, setFrame] = useState("");
  const [noteP1, setNoteP1] = useState("");
  const [noteP2, setNoteP2] = useState("");

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
      socket.off("connect", handleConnect);
      socket.off("frameMultiPlayer", handleFrame);
      socket.disconnect();  // Ensure socket is disconnected
      console.log("Socket disconnected on component unmount");
    };
  }, []);

  return (
    <div className="stream-container">
      <p>Note P1: {noteP1}</p>
      <p>Note P2: {noteP2}</p>
      {start ? (
        <div>
          <p>Connected to stream</p>
          <img src={`data:image/jpeg;base64,${frame}`} alt="Stream Fail" />
        </div>
      ) : (
        <div className="bg-gray-800">
          <p>Waiting for connection...</p>
        </div>
      )}
    </div>
  );
};

export default MultiplayerPage;