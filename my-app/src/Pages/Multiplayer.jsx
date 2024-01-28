import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const MultiplayerPage = () => {
  const [start, setStart] = useState(false);
  const [frame, setFrame] = useState("");

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