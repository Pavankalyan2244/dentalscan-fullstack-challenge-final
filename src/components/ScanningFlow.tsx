"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Camera, CheckCircle2 } from "lucide-react";

export default function ScanningFlow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"far" | "ok" | "perfect">("far");
  const [message, setMessage] = useState("");

  const VIEWS = [
    { label: "Front View", instruction: "Smile and look straight at the camera." },
    { label: "Left View", instruction: "Turn your head to the left." },
    { label: "Right View", instruction: "Turn your head to the right." },
    { label: "Upper Teeth", instruction: "Tilt your head back and open wide." },
    { label: "Lower Teeth", instruction: "Tilt your head down and open wide." },
  ];

  // ✅ Camera
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }

    startCamera();
  }, []);

  // ✅ Status simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const states = ["far", "ok", "perfect"];
      const random = states[Math.floor(Math.random() * states.length)] as any;
      setStatus(random);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Capture + Notification trigger
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg");

      setCapturedImages((prev) => [...prev, dataUrl]);

      setCurrentStep((prev) => {
        const next = prev + 1;

        // 🔥 Trigger notification
        if (next === 5) {
          fetch("/api/notifications", {
            method: "POST",
          });
        }

        return next;
      });
    }
  }, []);

  // ✅ Send message
  const sendMessage = async () => {
    if (!message) return;

    await fetch("/api/messaging", {
      method: "POST",
      body: JSON.stringify({
        threadId: "demo-thread",
        content: message,
      }),
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white">
      
      {/* Header */}
      <div className="p-4 w-full bg-zinc-900 border-b border-zinc-800 flex justify-between">
        <h1 className="font-bold text-blue-400">DentalScan AI</h1>
        <span className="text-xs text-zinc-500">Step {currentStep + 1}/5</span>
      </div>

      {/* Camera */}
      <div className="relative w-full max-w-md aspect-[3/4] bg-zinc-950 overflow-hidden flex items-center justify-center">
        {currentStep < 5 ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* Guidance Circle */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div
                className={`w-64 h-64 rounded-full border-4 transition-all duration-300 ${
                  status === "far"
                    ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]"
                    : status === "ok"
                    ? "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]"
                    : "border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.6)]"
                }`}
              />

              <p className="mt-4 text-sm font-medium">
                {status === "far" && <span className="text-red-400">Move Closer ❌</span>}
                {status === "ok" && <span className="text-yellow-300">Hold Steady ⚠️</span>}
                {status === "perfect" && <span className="text-green-300">Perfect Position ✅</span>}
              </p>
            </div>

            {/* Instruction */}
            <div className="absolute bottom-10 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-center">
              <p className="text-sm font-medium">
                {VIEWS[currentStep].instruction}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center p-10">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold">Scan Complete</h2>
            <p className="text-zinc-400 mt-2">Uploading results...</p>
          </div>
        )}
      </div>

      {/* Capture Button */}
      <div className="p-10 w-full flex justify-center">
        {currentStep < 5 && (
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <Camera className="text-black" />
            </div>
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 p-4 overflow-x-auto w-full">
        {VIEWS.map((_, i) => (
          <div
            key={i}
            className={`w-16 h-20 rounded border-2 shrink-0 ${
              i === currentStep
                ? "border-blue-500 bg-blue-500/10"
                : "border-zinc-800"
            }`}
          >
            {capturedImages[i] ? (
              <img src={capturedImages[i]} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-700">
                {i + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 🔥 Messaging UI */}
      <div className="w-full max-w-md p-4 border-t border-zinc-800">
        <h3 className="text-sm mb-2 text-zinc-400">Message Dentist</h3>

        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 rounded bg-zinc-900 text-white text-sm"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 rounded text-white text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}