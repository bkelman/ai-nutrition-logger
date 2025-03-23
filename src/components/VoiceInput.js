// src/components/VoiceInput.js
import React, { useState, useEffect } from 'react';

function VoiceInput({ onTranscriptChange }) {
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [showTip, setShowTip] = useState(false);
  
  // Setup Speech Recognition
  useEffect(() => {
    // Browser compatibility check
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser!");
      return;
    }
    
    const recognition = new SpeechRecognition();
    // Settings optimized for food logging
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3; // Get multiple alternatives
    
    recognition.onstart = () => {
      setIsListening(true);
      setShowTip(true);
      // Vibrate device briefly to indicate start (mobile only)
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    };
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = 0; i < event.results.length; i++) {
        // Get the most confident result
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
      setTimeout(() => setShowTip(false), 3000); // Hide tip after 3 seconds
      
      // Vibrate device briefly to indicate end (mobile only)
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
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
        // Reset recognition before starting for clean slate
        speechRecognition.abort();
        speechRecognition.start();
      }
    }
  };
  
  // If speech recognition is not supported
  if (!speechRecognition) {
    return null;
  }
  
  return (
    <div className="relative">
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
      
      {showTip && (
        <div className="absolute left-0 -top-16 w-64 p-2 bg-blue-50 border border-blue-200 rounded shadow-sm text-xs">
          <p className="font-medium">Tips for best results:</p>
          <ul className="list-disc pl-4 mt-1">
            <li>Speak clearly and directly into your device</li>
            <li>Mention specific foods and portions</li>
            <li>Try to minimize background noise</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default VoiceInput;