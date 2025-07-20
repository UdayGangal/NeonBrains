import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Download, RefreshCw, Sparkles, Heart, Star } from "lucide-react";
import toast from "react-hot-toast";
import "./PolaroidGenerator.css";
import "./shared.css";
// interface PolaroidGeneratorProps {
//   imageSrc: string;
//   filters: {
//     brightness: number,
//     contrast: number,
//     saturation: number,
//     hue: number,
//     sepia: number,
//     blur: number,
//     grayscale: number,
//   };
// }

const PolaroidGenerator = ({ imageSrc, filters }) => {
  const polaroidRef = useRef(null);
  const [caption, setCaption] = useState("");
  const [frameStyle, setFrameStyle] = useState("classic");
  const [isGenerating, setIsGenerating] = useState(false);

  const frameStyles = {
    classic: {
      name: "Classic",
      bgColor: "bg-white",
      textColor: "text-gray-800",
      borderColor: "border-gray-200",
    },
    neon: {
      name: "Neon",
      bgColor: "bg-gradient-to-br from-purple-900 to-pink-900",
      textColor: "text-cyan-300",
      borderColor: "border-cyan-400",
    },
    cyberpunk: {
      name: "Cyberpunk",
      bgColor: "bg-gradient-to-br from-gray-900 to-black",
      textColor: "text-green-400",
      borderColor: "border-green-400",
    },
    vintage: {
      name: "Vintage",
      bgColor: "bg-gradient-to-br from-amber-100 to-yellow-200",
      textColor: "text-amber-800",
      borderColor: "border-amber-300",
    },
  };

  const retroCaptions = [
    "Living my best 90s life ✨",
    "Totally rad moment captured!",
    "This vibe is everything 📸",
    "90s kids remember this feeling",
    "Retro vibes only 🌈",
    "Captured in pixelated perfection",
    "Neon dreams and digital schemes",
    "Vintage soul, modern goal",
    "Polaroid memories, digital stories",
    "Time travel through pixels",
    "Cyberpunk aesthetic activated",
    "Nostalgia.exe has stopped working",
    "Glitch in the matrix captured",
    "Y2K energy detected",
    "Loading happiness... 100% complete",
  ];

  const generateRandomCaption = () => {
    const randomCaption =
      retroCaptions[Math.floor(Math.random() * retroCaptions.length)];
    setCaption(randomCaption);
    toast.success("🎲 Random caption generated!", {
      style: {
        background: "#1a1a2e",
        color: "#00f5ff",
        border: "2px solid #ff00ff",
      },
    });
  };

  const generateFilterString = () => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hue}deg) sepia(${filters.sepia}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%)`;
  };

  const downloadPolaroid = async () => {
    if (!polaroidRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(polaroidRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `retrosnap-polaroid-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success("📱 Polaroid downloaded!", {
        style: {
          background: "#1a1a2e",
          color: "#00f5ff",
          border: "2px solid #ff00ff",
        },
      });
    } catch (error) {
      toast.error("Failed to download polaroid");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-6 rounded-lg border-2 border-cyan-400 shadow-lg retro-glow">
      <h2 className="text-2xl font-bold text-cyan-300 mb-4 pixel-font">
        POLAROID GENERATOR
      </h2>

      {/* Frame Style Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-pink-300 mb-3 pixel-font">
          FRAME STYLE
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(frameStyles).map(([key, style]) => (
            <button
              key={key}
              onClick={() => setFrameStyle(key)}
              className={`retro-button px-3 py-2 rounded text-xs font-bold pixel-font transition-all duration-300 ${
                frameStyle === key
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black"
                  : "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600"
              }`}
            >
              {style.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Caption Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-pink-300 pixel-font">
            CAPTION
          </h3>
          <button
            onClick={generateRandomCaption}
            className="retro-button bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white px-3 py-1 rounded text-xs font-bold pixel-font flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>RANDOM</span>
          </button>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add your retro caption here..."
          className="w-full p-3 bg-gray-800 border-2 border-purple-400 rounded-lg text-white placeholder-gray-400 pixel-font resize-none focus:border-cyan-400 focus:outline-none"
          rows={3}
        />
      </div>

      {/* Polaroid Preview */}
      <div className="flex justify-center mb-6">
        <div
          ref={polaroidRef}
          className={`p-4 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300 ${frameStyles[frameStyle].bgColor} ${frameStyles[frameStyle].borderColor} border-4`}
          style={{ width: "300px" }}
        >
          {/* Photo Area */}
          <div className="relative mb-4 overflow-hidden rounded-sm">
            <img
              src={imageSrc}
              alt="Polaroid"
              style={{ filter: generateFilterString() }}
              className="w-full h-64 object-cover"
            />

            {/* Retro overlay effects */}
            {frameStyle === "neon" && (
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 pointer-events-none" />
            )}
            {frameStyle === "cyberpunk" && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 pointer-events-none" />
            )}

            {/* Scanlines for retro effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-0.5 bg-current"
                  style={{ top: `${i * 10}%` }}
                />
              ))}
            </div>
          </div>

          {/* Caption Area */}
          <div className={`${frameStyles[frameStyle].textColor} text-center`}>
            {caption ? (
              <p className="pixel-font text-sm leading-relaxed">{caption}</p>
            ) : (
              <p className="pixel-font text-sm opacity-50">
                Add a caption above...
              </p>
            )}
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center mt-2 space-x-2">
            <Heart className="w-3 h-3 opacity-30" />
            <Star className="w-3 h-3 opacity-30" />
            <Sparkles className="w-3 h-3 opacity-30" />
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={downloadPolaroid}
          disabled={isGenerating}
          className="retro-button bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="pixel-font">GENERATING...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span className="pixel-font">DOWNLOAD POLAROID</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PolaroidGenerator;
