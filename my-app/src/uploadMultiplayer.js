import React from "react";
import './upload.css';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import uploadImage from './Assets/upload.png'
import loading from './Assets/loading.gif'


function About(){
    const [selectedFile, setSelectedFile] = useState(null);
    const [bpm, setbpm] = useState(60);
    const [fileTrue, setFileTrue] = useState(0);
 
    let Navigate = useNavigate();
    // HANDLE FILE EVENT FOR YOU ETHAN -------------------------------------------------
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        if(event.target.files[0]) setFileTrue(1);
    };

    // HANDLE SENDING UPLOAD DATA  FOR YOU ETHAN ---------------------------------------
    const uploadData = (event) => {
        var element = document.getElementById("loadingContainer");
        var rect = element.getBoundingClientRect();
        window.scrollTo({
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
            behavior: 'smooth'
        });
        console.log("data uploaded!")


        /*Navigate('../learn')             
        enable above when done loading*/


    }

    const bpmChange = (event) => {
        setbpm(event.target.value);
    };
    

    return (
        <div id="learnContainer">
            <div id="uploadContainer">
                <label id="uploadGroup" htmlFor="doc">
                    <img id="uploadImage" src={uploadImage} alt=""/> 
                        <div>
                            <h1 className="uploadText">Upload Files</h1>
                            <span>.CSV Only</span>
                        </div>
                    <input type="file" id="doc" name="doc" accept="csv" style={{display: "none"}} onChange={handleFileChange}/>
                
                </label>
                <div style={{marginBottom:"5vh"}}>
                    <h1 id="bpmText">BPM: </h1>
                    <input id="bpmInput" type="text" onChange={bpmChange}/>
                </div>
                <button id="uploadButton" className="btn" disabled={!fileTrue} onClick={uploadData}>Send Data</button>
            </div>
            <div id="loadingContainer">
                <img src={loading} id="loadingImage" alt="urmom"/>
                <h1 style={{marginLeft:"5vw"}}>Please wait while we load!</h1>
            </div>
        </div>
    );
};
 
export default About;