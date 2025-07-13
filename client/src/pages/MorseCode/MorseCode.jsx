// import React from "react";

// function MorseCode() {
//   return (
//     <div>
//       <h1>Morse Code</h1>
//     </div>
//   );
// }

// export default MorseCode;

import { useEffect, useRef, useState } from "react";
import "./MorseCode.css";
import dotSound from "./sounds/dot.mp3";
import dashSound from "./sounds/dash.mp3";

export default function MorseCode() {
  const [isRedTheme, setIsRedTheme] = useState(false);
  const [isMorseMode, setIsMorseMode] = useState(true);
  const [result, setResult] = useState("");
  const [currentMorse, setCurrentMorse] = useState("");
  const [textInputValue, setTextInputValue] = useState("");
  const [heading, setHeading] = useState("");
  const canvasRef = useRef(null);
  const pressStartRef = useRef(null);
  const pressTimeoutRef = useRef(null);
  const wordTimeoutRef = useRef(null);

  const morseMap = {
    ".-": "A",
    "-...": "B",
    "-.-.": "C",
    "-..": "D",
    ".": "E",
    "..-.": "F",
    "--.": "G",
    "....": "H",
    "..": "I",
    ".---": "J",
    "-.-": "K",
    ".-..": "L",
    "--": "M",
    "-.": "N",
    "---": "O",
    ".--.": "P",
    "--.-": "Q",
    ".-.": "R",
    "...": "S",
    "-": "T",
    "..-": "U",
    "...-": "V",
    ".--": "W",
    "-..-": "X",
    "-.--": "Y",
    "--..": "Z",
    "-----": "0",
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
  };

  const textToMorseMap = Object.fromEntries(
    Object.entries(morseMap).map(([k, v]) => [v, k])
  );

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const fontSize = 14;
    let width = (canvasRef.current.width = window.innerWidth);
    let height = (canvasRef.current.height = window.innerHeight);
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    const letters =
      "アァイィウエカキクケコサシスセタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = isRedTheme ? "#F00" : "#0F0";
      ctx.font = `${fontSize}px VT323`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    window.addEventListener("resize", () => {
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    });

    return () => clearInterval(interval);
  }, [isRedTheme]);

  useEffect(() => {
    const text = "Morse Code Terminal";
    let index = 0;
    let animationFrameId;
    let resetTimeoutId;

    const type = () => {
      setHeading(text.slice(0, index + 1));
      index++;

      if (index < text.length) {
        animationFrameId = setTimeout(type, 100); // typing delay
      } else {
        resetTimeoutId = setTimeout(() => {
          index = 0;
          setHeading("");
          type();
        }, 2000); // pause after full string
      }
    };

    type();

    return () => {
      clearTimeout(animationFrameId);
      clearTimeout(resetTimeoutId);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !pressStartRef.current && isMorseMode) {
        e.preventDefault();
        pressStartRef.current = Date.now();
        clearTimeout(pressTimeoutRef.current);
        clearTimeout(wordTimeoutRef.current);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" && isMorseMode) {
        e.preventDefault();
        const duration = Date.now() - pressStartRef.current;
        pressStartRef.current = null;

        const signal = duration < 300 ? "." : "-";
        const audio = new Audio(signal === "." ? dotSound : dashSound);
        audio.play();

        const updatedMorse = currentMorse + signal;
        setCurrentMorse(updatedMorse);

        pressTimeoutRef.current = setTimeout(() => {
          const letter = morseMap[updatedMorse] || "?";
          setResult((prev) => prev + letter);
          setCurrentMorse("");
        }, 500);

        wordTimeoutRef.current = setTimeout(() => {
          setResult((prev) => prev + " ");
        }, 1000);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentMorse, isMorseMode]);

  const handleTextInput = (e) => {
    const input = e.target.value.toUpperCase();
    setTextInputValue(input);
  };

  const handleTextSubmit = (e) => {
    if (e.key === "Enter") {
      const morse = textInputValue
        .split("")
        .map((char) => (char === " " ? "/" : textToMorseMap[char] || "?"))
        .join(" ");
      setResult(morse);
      setTextInputValue("");
    }
  };

  const toggleTheme = () => setIsRedTheme((prev) => !prev);
  const toggleMode = () => {
    setIsMorseMode((prev) => !prev);
    clearAll();
  };
  const clearAll = () => {
    setCurrentMorse("");
    setResult("");
    setTextInputValue("");
  };

  return (
    <div
      className={`w-full h-full p-10 font-mono text-[20px] ${
        isRedTheme ? "red-theme" : "green-theme"
      }`}
    >
      <canvas
        ref={canvasRef}
        id="matrixCanvas"
        className="fixed top-0 left-0 w-full h-full z-[-1] opacity-50 pointer-events-none"
      />

      <button
        onClick={toggleTheme}
        className="fixed top-2 left-5 border-2 px-3 py-1 font-mono z-10"
      >
        Theme
      </button>
      <button
        onClick={clearAll}
        className="fixed top-2 right-5 border-2 px-3 py-1 font-mono z-10"
      >
        Clear
      </button>
      <button
        onClick={toggleMode}
        className="fixed top-14 left-5 border-2 px-3 py-1 font-mono z-10"
      >
        {isMorseMode ? "Text Mode" : "Morse Mode"}
      </button>

      <h1 className="text-center text-2xl border-r-2 overflow-hidden whitespace-nowrap animate-typing blink-caret w-fit mx-auto">
        {heading}
      </h1>
      <p className="text-sm text-secondary">
        Press and hold <strong>SPACEBAR</strong> to input Morse Code
      </p>
      <p className="text-sm text-secondary">
        Short = · , Long = − , Pause = new letter
      </p>

      {!isMorseMode && (
        <>
          <div className="fixed bottom-[150px] left-8 text-sm text-secondary">
            Type text and press Enter to convert to Morse:
          </div>
          <input
            type="text"
            value={textInputValue}
            onChange={handleTextInput}
            onKeyDown={handleTextSubmit}
            className="fixed bottom-[100px] left-8 w-[300px] border-2 p-2 bg-transparent font-mono"
            placeholder="Enter text here..."
            autoFocus
          />
        </>
      )}

      {isMorseMode && (
        <div className="mt-[100px] px-6">Morse: {currentMorse}</div>
      )}
      {!isMorseMode && (
        <div className="mt-[100px] px-6">Text: {textInputValue}</div>
      )}

      <div className="fixed bottom-8 left-8 text-2xl flex items-end">
        <div className="whitespace-pre-wrap max-w-[90%]">{result}</div>
        <span className="inline-block w-2 h-[26px] bg-current ml-1 animate-blink">
          █
        </span>
      </div>
    </div>
  );
}
