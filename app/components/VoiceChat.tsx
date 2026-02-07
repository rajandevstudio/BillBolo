"use client";

import { useState, useRef } from "react";
import { Mic, StopCircle, Loader2 } from "lucide-react";

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, audio_file?: Blob}[]>([
    { role: 'bot', text: 'Hello! Record your voice invoice and I will send the PDF to your WhatsApp.' }
  ]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendAudio(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setMessages(prev => [...prev, { role: 'user', text: '🎤 Audio sent...' }]);

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessages(prev => [...prev, { role: 'bot', text: '✅ Received! Processing your invoice. Check your WhatsApp shortly.', audio_file: audioBlob}]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: '❌ Error uploading audio.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: '❌ Error uploading audio.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border rounded-lg shadow-lg bg-[#e5ddd5]">
      {/* Header */}
      <div className="bg-[#075e54] p-4 text-white font-bold rounded-t-lg flex items-center shadow-md">
        <span>BillBolo Assistant</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
              msg.role === 'user' ? 'bg-[#dcf8c6] text-black rounded-tr-none' : 'bg-white text-black rounded-tl-none'
            }`}>
              {msg.audio_file ? (
                <audio controls>
                  <source src={URL.createObjectURL(msg.audio_file)} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="flex justify-start">
             <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2 text-sm text-gray-600">
               <Loader2 className="w-4 h-4 animate-spin" /> Processing...
             </div>
           </div>
        )}
      </div>

      {/* Footer / Controls */}
      <div className="p-4 bg-[#f0f0f0] flex justify-center items-center rounded-b-lg border-t">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="p-4 bg-[#075e54] rounded-full text-white hover:bg-[#128c7e] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all shadow-lg animate-pulse"
          >
            <StopCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}