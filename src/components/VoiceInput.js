// src/components/VoiceInput.js
import React, { useState, useEffect } from 'react';

function VoiceInput({ onTranscriptChange }) {
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  
  // Setup Speech Recognition
  useEffect(() => {
    // Browser compatibility check
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser!");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
      
      if (finalTranscript) {
        onTranscriptChange(finalTranscript.trim());
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    setSpeechRecognition(recognition);
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onTranscriptChange]);
  
  const toggleListening = () => {
    if (isListening) {
      if (speechRecognition) {
        speechRecognition.stop();
      }
    } else {
      if (speechRecognition) {
        speechRecognition.start();
      }
    }
  };
  
  // If speech recognition is not supported
  if (!speechRecognition) {
    return null; // Don't show anything if not supported
  }
  
  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`flex items-center justify-center px-4 py-2 rounded ${
        isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600'
      } text-white`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      {isListening ? 'Stop' : 'Speak'}
    </button>
  );
}

export default VoiceInput;