import React from "react";
import { Camera, Image, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="relative bg-gradient-to-r from-purple-900 via-pink-800 to-cyan-800 p-6 overflow-hidden">
      {/* Scanlines effect */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-0.5 bg-white animate-pulse"
            style={{ top: `${i * 5}%`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Camera className="w-8 h-8 text-cyan-300" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent pixel-font">
              RETROSNAP
            </h1>
            <p className="text-purple-200 text-sm pixel-font">
              Get your retro vibes on!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
          <div
            className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-green-400 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
