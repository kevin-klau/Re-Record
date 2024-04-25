import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// Custom hook for managing socket.io
const useSocket = (mode) => {

    const SOCKET_URL = "http://0.0.0.0:5002";
    const [frame, setFrame] = useState("");
    const [note, setNote] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize the socket connection
        socketRef.current = io(SOCKET_URL);
        console.log("Attempting to connect...");
        socketRef.current.emit(
            mode === "noteP1" || mode === "noteP2" ? "multiPlayer" : "singlePlayer",
            { data: "Initiating stream..." }
        );

        socketRef.current.on("connect", () => console.log("Connected successfully."));
        socketRef.current.on("frame", (data) => setFrame(data.data));
        socketRef.current.on(mode, (data) => { note === undefined ? setNote("") : setNote(data.data); });

        // Cleanup function to disconnect socket when the component unmounts
        return () => {
            socketRef.current.disconnect();
            console.log("Socket disconnected on component unmount");
        };
    }, []);

    return [frame, note];
};

export default useSocket;
