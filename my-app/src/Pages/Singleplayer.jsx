import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const SingleplayerPage = () => {
  const [start, setStart] = useState(false);
  const [frame, setFrame] = useState("");

  useEffect(() => {
    const socket = io("ws://localhost:5001");
    console.log("Attempting to connect...");
    socket.emit("singlePlayer", { data: "Initiating stream..." });

    const handleConnect = () => {
      console.log("Connected successfully.");
      setStart(true);
    };
    const handleFrame = (data) => {setFrame(data.data);};

    socket.on("connect", handleConnect);
    socket.on("frameSinglePlayer", handleFrame);

    // Cleanup on component unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("frameSinglePlayer", handleFrame);
      socket.disconnect();
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

export default SingleplayerPage;