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

  const MorseCode = {
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
    Object.entries(MorseCode).map(([k, v]) => [v, k])
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    const letters =
      "アァイィウエカキクケコサシスセタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = isRedTheme ? "#ff0000" : "#00ff00";
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

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
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
        animationFrameId = setTimeout(type, 100);
      } else {
        resetTimeoutId = setTimeout(() => {
          index = 0;
          setHeading("");
          type();
        }, 2000);
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
        if (pressTimeoutRef.current) clearTimeout(pressTimeoutRef.current);
        if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" && isMorseMode && pressStartRef.current) {
        e.preventDefault();
        const duration = Date.now() - pressStartRef.current;
        pressStartRef.current = null;

        const signal = duration < 300 ? "." : "-";

        const audio = new Audio(signal === "." ? dotSound : dashSound);
        audio.play();

        const updatedMorse = currentMorse + signal;
        setCurrentMorse(updatedMorse);

        pressTimeoutRef.current = setTimeout(() => {
          const letter = MorseCode[updatedMorse] || "?";
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
    if (pressTimeoutRef.current) clearTimeout(pressTimeoutRef.current);
    if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current);
  };

  return (
    <div
      className={`terminal-container ${
        isRedTheme ? "red-theme" : "green-theme"
      }`}
    >
      <canvas
        ref={canvasRef}
        className="matrix-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      <div className="content-overlay">
        <button
          onClick={toggleTheme}
          className="terminal-button"
          style={{ position: "absolute", top: "20px", left: "20px" }}
        >
          Theme
        </button>

        <button
          onClick={clearAll}
          className="terminal-button"
          style={{ position: "absolute", top: "20px", right: "20px" }}
        >
          Clear
        </button>

        <button
          onClick={toggleMode}
          className="terminal-button"
          style={{ position: "absolute", top: "70px", left: "20px" }}
        >
          {isMorseMode ? "Text Mode" : "Morse Mode"}
        </button>

        <div className="header-section">
          <h1 className="title">{heading}</h1>
          <div className="instructions">
            Press and hold SPACEBAR to input Morse Code
          </div>
          <div className="instructions">
            Short = ·, Long = -, Pause = new letter
          </div>
        </div>

        <div className="current-input-display">
          {isMorseMode
            ? currentMorse && <div>Morse: {currentMorse}</div>
            : textInputValue && <div>Text: {textInputValue}</div>}
        </div>

        {!isMorseMode && (
          <div className="text-input-section">
            <div style={{ marginBottom: "10px", fontSize: "16px" }}>
              Type text and press Enter to convert to Morse:
            </div>
            <input
              type="text"
              value={textInputValue}
              onChange={handleTextInput}
              onKeyDown={handleTextSubmit}
              className="text-input"
              placeholder="Enter text here..."
              autoFocus
            />
          </div>
        )}

        <div className="morse-display">
          <div style={{ whiteSpace: "pre-wrap", maxWidth: "90%" }}>
            {result}
          </div>
          <span className="cursor">█</span>
        </div>
      </div>
    </div>
  );
}
