import React from "react";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import uploadImage from "../assets/upload.png";
import loading from "../assets/loading.gif";

function Upload(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [bpm, setbpm] = useState(60);
    const [fileTrue, setFileTrue] = useState(0);
    let Navigate = useNavigate();

    // Handler for file selection event
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        if (event.target.files[0]) setFileTrue(1);

        // Handler for uploading data
        const uploadData = (event) => {
            var element = document.getElementById("loadingContainer");
            var rect = element.getBoundingClientRect();

            // Scroll smoothly to the loading section
            window.scrollTo({
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                behavior: "smooth",
            });

            // Async function to post data using axios
            const postMusic = async (file) => {
                const data = new FormData();
                data.append("csv", file);

                try {
                    const response = await axios({
                        method: "post",
                        url: "http://127.0.0.1:49152/sheetmusic",
                        data: data,
                        headers: { "Content-Type": "multipart/form-data" },
                    });

                    const music = response.data;
                    console.log(music.content);
                    props.setCurrMusic(music.content);
                } catch (error) {
                    console.error("Error uploading music:", error);
                }
            };

            postMusic(selectedFile);
            console.log("data uploaded!");

            // Navigate based on the 'redirect' prop
            if (props.redirect === "/learn") {
                Navigate("../learn");
            } else {
                Navigate("../multiplayer");
            }
        };

        // Handler for BPM change
        const bpmChange = (event) => {
            setbpm(event.target.value);
        };

        return (
            <div id="learnContainer">
                {/* Main Upload Screen */}
                <div id="uploadContainer">
                    {/* Upload Files Title Elements */}
                    <label id="uploadGroup" htmlFor="doc">
                        <img id="uploadImage" src={uploadImage} alt="Upload Icon" />
                        <div>
                            <h1 className="uploadText">Upload Files</h1>
                            <span>.CSV Only</span>
                        </div>
                        <input
                            type="file"
                            id="doc"
                            name="doc"
                            accept="csv"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </label>

                    {/* UI Elements (BPM, Send Data Button) */}
                    <div style={{ marginBottom: "5vh" }}>
                        <h1 id="bpmText">BPM: </h1>
                        <input id="bpmInput" type="text" onChange={bpmChange} />
                    </div>
                    <button
                        id="uploadButton"
                        className="btn"
                        disabled={!fileTrue}
                        onClick={uploadData}
                    >
                        Send Data
                    </button>
                </div>

                {/* Loading Data (When Waiting For Response */}
                <div id="loadingContainer">
                    <img src={loading} id="loadingImage" alt="Loading" />
                    <h1 style={{ marginLeft: "5vw" }}>Please wait while we load!</h1>
                </div>
            </div>
        );
    };
}

export default Upload;
