import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AudioAnalysisDashboard() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [callSid, setCallSid] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [emotion, setEmotion] = useState([]);
  const [error, setError] = useState("");
  const [ws, setWs] = useState(null);
  const [isCallRinging, setIsCallRinging] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const localStreamRef = useRef(null);
  const outgoingAudioContextRef = useRef(null);
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket("wss://kiwi-worthy-lightly.ngrok-free.app/media-stream");

    websocket.onopen = () => {
      console.log("WebSocket connected");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "media") {
        // Play incoming audio in real-time
        const audioBlob = new Blob([data.payload], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch(err => console.error("Error playing audio:", err));
        }
      } else if (data.event === "call-received") {
        // Call received by the client
        setCallStatus("Call connected. You can speak now.");
        setIsCallRinging(false);
        setCallConnected(true);
        setIsCallActive(true);
        
        // Start capturing and sending local audio once call is connected
        startSendingLocalAudio();
        
        // Start recording for automatic analysis
        startRecording();
      } else if (data.event === "call-ended") {
        // Call ended
        setCallStatus("Call ended.");
        setIsCallActive(false);
        setCallConnected(false);
        setIsCallRinging(false);
        
        // Stop sending local audio
        stopSendingLocalAudio();
        
        // Stop recording and process the audio
        if (recording) {
          stopRecording();
        }
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsCallActive(false);
      setCallConnected(false);
      setIsCallRinging(false);
      
      // Stop sending local audio when connection closed
      stopSendingLocalAudio();
      
      // Stop recording if still recording
      if (recording) {
        stopRecording();
      }
    };

    return () => {
      websocket.close();
      stopSendingLocalAudio();
      
      // Stop recording if component unmounts while recording
      if (recording) {
        stopRecording();
      }
    };
  }, [recording]);

  // Function to start capturing and sending local audio
  const startSendingLocalAudio = async () => {
    try {
      // Stop any existing stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      
      // Create audio context
      outgoingAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = outgoingAudioContextRef.current.createMediaStreamSource(stream);
      const processor = outgoingAudioContextRef.current.createScriptProcessor(1024, 1, 1);
      
      // Connect the audio nodes
      source.connect(processor);
      processor.connect(outgoingAudioContextRef.current.destination);
      
      // Process audio data and send to server
      processor.onaudioprocess = (e) => {
        if (ws && ws.readyState === WebSocket.OPEN && callConnected) {
          // Convert audio data to format suitable for transmission
          const inputData = e.inputBuffer.getChannelData(0);
          const outputData = new Float32Array(inputData.length);
          
          for (let i = 0; i < inputData.length; i++) {
            outputData[i] = inputData[i];
          }
          
          // Send audio data to server
          ws.send(JSON.stringify({
            event: "client-media",
            media: {
              payload: Array.from(outputData),
              // Include call SID if available
              callSid: callSid
            }
          }));
        }
      };
      
      console.log("Started sending local audio");
    } catch (err) {
      console.error("Error accessing microphone for call:", err);
      setError("Could not access the microphone for the call.");
    }
  };

  // Function to stop sending local audio
  const stopSendingLocalAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (outgoingAudioContextRef.current) {
      outgoingAudioContextRef.current.close().catch(err => console.error("Error closing audio context:", err));
      outgoingAudioContextRef.current = null;
    }
    
    console.log("Stopped sending local audio");
  };

  // Function to initiate outgoing call
  const initiateCall = async () => {
    setError("");
    
    if (!phoneNumber || phoneNumber.trim() === "") {
      setError("Please enter a valid phone number.");
      return;
    }
    
    try {
      setCallStatus("Initiating call...");
      setIsCallRinging(true);
      
      const response = await fetch("http://localhost:80/initiate-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: phoneNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate call");
      }

      const data = await response.json();
      setCallStatus(`Call ringing... SID: ${data.callSid}`);
      setCallSid(data.callSid);
      setIsCallActive(true);
      
      // We don't start sending audio until the call is connected (we receive call-received event)
    } catch (error) {
      console.error("Error initiating call:", error);
      setCallStatus("Failed to initiate call");
      setIsCallRinging(false);
      setIsCallActive(false);
    }
  };

  // Function to end the call
  const endCall = async () => {
    try {
      setCallStatus("Ending call...");
      
      const response = await fetch("http://localhost:80/end-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ callSid }),
      });

      if (!response.ok) {
        throw new Error("Failed to end call");
      }

      setCallStatus("Call ended.");
      setIsCallActive(false);
      setCallConnected(false);
      setIsCallRinging(false);
      
      // Stop sending local audio
      stopSendingLocalAudio();
      
      // Stop recording if still recording
      if (recording) {
        stopRecording();
      }
    } catch (error) {
      console.error("Error ending call:", error);
      setCallStatus("Failed to end call");
    }
  };

  // Function to process audio for analysis
  const processAudio = async (audioBlob) => {
    setError("");
    setTranscript("");
    setSentiment(null);
    setEmotion([]);

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/audio/analyze-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTranscript(data.transcription);
      setSentiment(data.sentiment);
      setEmotion(data.emotions || []);
    } catch (err) {
      console.error("Error processing audio:", err);
      setError("Failed to process audio.");
    }
  };

  // Function to start recording
  const startRecording = async () => {
    setError("");
    try {
      // Stop any existing recording
      if (mediaRecorderRef.current && recording) {
        stopRecording();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        // Only process audio if we have data
        if (audioChunksRef.current.length > 0) {
          await processAudio(audioBlob);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access the microphone.");
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      // Clean up the tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
      console.log("Recording stopped");
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await processAudio(file);
    }
  };

  // Function to check call status from server periodically
  useEffect(() => {
    let intervalId;
    
    if (isCallRinging && callSid) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:80/call-status-check?callSid=${callSid}`, {
            method: "GET",
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Update UI based on actual call status from server
            if (data.status === "in-progress" && isCallRinging) {
              setCallStatus("Call connected. You can speak now.");
              setIsCallRinging(false);
              setCallConnected(true);
              
              // Start recording when call connects
              if (!recording) {
                startRecording();
              }
            } else if (["completed", "failed", "busy", "no-answer"].includes(data.status)) {
              setCallStatus(`Call ${data.status}.`);
              setIsCallActive(false);
              setCallConnected(false);
              setIsCallRinging(false);
              
              // Stop recording if call ended and we're still recording
              if (recording) {
                stopRecording();
              }
              
              // Clear the interval as call is no longer active
              clearInterval(intervalId);
            }
          }
        } catch (err) {
          console.error("Error checking call status:", err);
        }
      }, 3000); // Check every 3 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isCallRinging, callSid, recording]);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 md:px-20 py-6 fixed w-full top-0 z-50 backdrop-blur-lg bg-white/90 shadow-lg border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">OptiClaim</h1>
        <div className="hidden md:flex gap-10 items-center text-gray-800 text-lg">
          <button onClick={() => navigate("/knowledge-base")} className="hover:text-yellow-500 transition-colors">Knowledge Base</button>
          <button onClick={() => navigate("/agenttraining")} className="hover:text-yellow-500 transition-colors">AI Agent Trainer</button>
          <button onClick={() => navigate("/feedbackanalysis")} className="hover:text-yellow-500 transition-colors">Analyzer</button>
          <button onClick={() => navigate("/form-processing")} className="hover:text-yellow-500 transition-colors">Form Filling</button>
          <button  onClick={() => navigate("/login")}className="px-8 py-3 rounded-full text-white bg-red-500 hover:bg-red-400 transition-all font-semibold shadow-lg">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6 md:px-20">
        {/* Outgoing Call Section */}
        <motion.div
          className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-4xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8">📞 Outgoing Call</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isCallActive}
            />
            
            {error && <p className="text-red-600">{error}</p>}
            {callStatus && <p className="text-gray-800">{callStatus}</p>}
            
            {/* Conditional rendering for call buttons */}
            {!isCallActive ? (
              <button
                onClick={initiateCall}
                className="px-6 py-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-md"
              >
                Call
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Call status indicator */}
                {isCallRinging && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                    <p>Ringing...</p>
                  </div>
                )}
                
                {callConnected && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <p>Connected</p>
                  </div>
                )}
                
                {/* End call button */}
                <button
                  onClick={endCall}
                  className="px-6 py-3 rounded-full text-white bg-red-600 hover:bg-red-500 transition-all font-semibold shadow-md"
                >
                  End Call
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Audio Analysis Card */}
        <motion.div
          className="bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl shadow-2xl p-8 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8">🎙 Audio Analysis</h2>

          {/* Button Group - Hidden during active call since recording is automatic */}
          {!isCallActive && (
            <center>
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                {!recording ? (
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 rounded-full text-white bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-md"
                  >
                    🎤 Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-full text-white bg-red-600 hover:bg-red-500 transition-all font-semibold shadow-md"
                  >
                    ⏹ Stop Recording
                  </button>
                )}

                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-6 py-3 rounded-full text-white bg-green-600 hover:bg-green-500 transition-all font-semibold shadow-md"
                >
                  📂 Upload Audio File
                </button>
              </div>
            </center>
          )}
          
          {/* Recording indicator during active call */}
          {isCallActive && recording && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <p className="text-gray-800">Recording in progress... Analysis will be performed when call ends.</p>
            </div>
          )}

          {/* Transcription */}
          {transcript && (
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">📝 Transcription:</h3>
              <p className="text-gray-800">{transcript}</p>
            </motion.div>
          )}

          {/* Sentiment Analysis */}
          {sentiment && (
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Sentiment Analysis:</h3>
              <p className="text-gray-800">
                <strong>Label:</strong> {sentiment.label} <br />
                <strong>Confidence:</strong> {(sentiment.score * 100).toFixed(2)}%
              </p>
            </motion.div>
          )}

          {/* Emotion Analysis */}
          {emotion.length > 0 && (
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🎭 Emotion Analysis:</h3>
              <ul className="text-gray-800">
                {emotion[0].map((emo, index) => (
                  <li key={index}>
                    <strong>{emo.label}:</strong> {(emo.score * 100).toFixed(2)}%
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>

        {/* Submit Feedback Button */}
        <br />
        <br />
        <center>
          <button
            onClick={() => navigate("/clientdashboard")}
            className="px-6 py-3 rounded-full text-white bg-purple-600 hover:bg-purple-500 transition-all font-semibold shadow-md"
          >
            📚 Submit Feedback
          </button>
        </center>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center bg-black text-gray-300">
        <p>© 2025 OptiClaim by Roast and Toast</p>
      </footer>

      {/* Audio element for real-time playback - not hidden anymore to allow user to control volume */}
      <div className="fixed bottom-4 right-4 z-50">
        {isCallActive && (
          <audio 
            ref={audioRef} 
            controls 
            autoPlay 
            className={isCallActive ? "w-64 shadow-lg rounded" : "hidden"}
          />
        )}
      </div>
    </div>
  );
}

export default AudioAnalysisDashboard;