import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

// interface ImageUploadProps {
//   onImageCapture: (imageSrc: string) => void;
// }

const ImageUpload = ({ onImageCapture }) => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [facingMode, setFacingMode] = useState("user");

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onImageCapture(imageSrc);
      setShowCamera(false);
      toast.success("📸 Image captured!", {
        style: {
          background: "#1a1a2e",
          color: "#00f5ff",
          border: "2px solid #ff00ff",
        },
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageCapture(e.target.result);
          toast.success("🖼️ Image uploaded!", {
            style: {
              background: "#1a1a2e",
              color: "#00f5ff",
              border: "2px solid #ff00ff",
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const switchCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-6 rounded-lg border-2 border-cyan-400 shadow-lg retro-glow">
      <h2 className="text-2xl font-bold text-cyan-300 mb-4 pixel-font">
        CAPTURE OR UPLOAD
      </h2>

      {!showCamera ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowCamera(true)}
              className="retro-button bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Camera className="w-6 h-6" />
              <span className="pixel-font">TAKE PHOTO</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="retro-button bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Upload className="w-6 h-6" />
              <span className="pixel-font">UPLOAD IMAGE</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative camera-body crt-monitor">
            {/* Camera body details */}
            <div className="absolute -top-2 left-4 w-8 h-4 bg-gray-700 rounded-t-lg border-2 border-gray-600"></div>
            <div className="absolute -top-1 right-6 w-4 h-2 bg-red-600 rounded-sm"></div>

            <div className="relative rounded-lg overflow-hidden border-2 border-green-400 viewfinder-glow">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode }}
                className="w-full h-164 object-cover filter contrast-110 brightness-95"
              />

              {/* Vintage Camera Viewfinder Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Main viewfinder frame */}
                <div className="absolute inset-2 border-2 border-green-400 rounded-sm opacity-80">
                  {/* Corner brackets */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-green-400"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-green-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-green-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-green-400"></div>

                  {/* Center crosshair */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-green-400 opacity-60"></div>
                    <div className="w-0.5 h-8 bg-green-400 opacity-60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-2 h-2 border border-green-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>

                  {/* Focus zones */}
                  <div className="absolute top-1/4 left-1/4 w-8 h-8 border border-green-400 opacity-40"></div>
                  <div className="absolute top-1/4 right-1/4 w-8 h-8 border border-green-400 opacity-40"></div>
                  <div className="absolute bottom-1/4 left-1/4 w-8 h-8 border border-green-400 opacity-40"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border border-green-400 opacity-40"></div>
                </div>

                {/* Top HUD elements */}
                <div className="absolute top-2 left-2 flex items-center space-x-2 text-green-400 text-xs pixel-font">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>REC</span>
                  <span className="bg-black bg-opacity-50 px-1 rounded">
                    AUTO
                  </span>
                </div>

                <div className="absolute top-2 right-2 text-green-400 text-xs pixel-font">
                  <div className="bg-black bg-opacity-50 px-1 rounded">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Bottom HUD elements */}
                <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-green-400 text-xs pixel-font">
                  <div className="bg-black bg-opacity-50 px-1 rounded">
                    F2.8
                  </div>
                  <div className="bg-black bg-opacity-50 px-1 rounded">
                    1/60
                  </div>
                  <div className="bg-black bg-opacity-50 px-1 rounded">
                    ISO 200
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 text-green-400 text-xs pixel-font">
                  <div className="bg-black bg-opacity-50 px-1 rounded flex items-center space-x-1">
                    <div className="w-4 h-1 bg-green-400 rounded-full"></div>
                    <div className="w-4 h-1 bg-green-400 rounded-full"></div>
                    <div className="w-4 h-1 bg-gray-600 rounded-full"></div>
                    <span>67%</span>
                  </div>
                </div>

                {/* Vintage film grain effect */}
                <div className="absolute inset-0 opacity-20 bg-noise"></div>

                {/* Scanlines */}
                <div className="absolute inset-0 opacity-30">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-0.5 bg-green-400"
                      style={{
                        top: `${i * 6.67}%`,
                        animation: `scanline 2s linear infinite`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Vignette effect */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background:
                      "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 80%)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={capture}
              className="flex-1 retro-button bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span className="pixel-font">CAPTURE</span>
            </button>

            <button
              onClick={switchCamera}
              className="retro-button bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowCamera(false)}
              className="retro-button bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 pixel-font"
            >
              BACK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
