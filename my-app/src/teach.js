import React from "react";
import './learn.css';
import { ChangeEvent, useState } from 'react';
import uploadImage from './Assets/upload.png'


function About(){
    const [selectedFile, setSelectedFile] = useState(null);

    // HANDLE FILE EVENT
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };

    return (
        <div id="learnContainer">
            <div id="uploadContainer">
                <h1 id="uploadText">Upload Here</h1>
                <label id="uploadGroup" htmlFor="doc">
                    <img id="uploadImage" src={uploadImage} alt=""/> 
                        <div>
                            <h4 className="uploadText" style={{fontSize:"40px",fontWeight: "bold"}}>Upload Here</h4>
                            <span>.CSV Only</span>
                        </div>
                    <input type="file" id="doc" name="doc" accept="csv" style={{display: "none"}} onChange={handleFileChange}/>
                
                </label>
            </div>
        </div>
    );
};
 
export default About;