import React, { useState, useEffect, useRef } from "react";
import "./HomePage.css";
import finalImg from "./final.png";
import flameGif from "./flame-lit.gif";
import fireMp3 from "./fire.mp3";
import windMp3 from "./fireflie.mp3";
import jugnuMp3 from "./fireflie.mp3";
import woodImg from "./wood.png"; // make sure this file exists

const MemorixApp = () => {
  const [soundOn, setSoundOn] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const fireAudioRef = useRef(null);
  const windAudioRef = useRef(null);
  const jugnuAudioRef = useRef(null);

  // Generate stars on mount
  useEffect(() => {
    const starContainer = document.getElementById("stars-container");
    if (starContainer) {
      const totalStars = 400;
      starContainer.innerHTML = "";
      for (let i = 0; i < totalStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${2 + Math.random() * 3}s, ${
          15 + Math.random() * 10
        }s`;
        star.style.animationDelay = `${Math.random() * 5}s, ${
          Math.random() * 10
        }s`;
        starContainer.appendChild(star);
      }
    }
  }, []);

  useEffect(() => {
    if (fireAudioRef.current) fireAudioRef.current.volume = 0.2;
    if (windAudioRef.current) windAudioRef.current.volume = 0.6;
    if (jugnuAudioRef.current) jugnuAudioRef.current.volume = 0.6;
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setAboutModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const playAllSounds = async () => {
    try {
      const promises = [];
      if (fireAudioRef.current) promises.push(fireAudioRef.current.play());
      if (windAudioRef.current) promises.push(windAudioRef.current.play());
      if (jugnuAudioRef.current) promises.push(jugnuAudioRef.current.play());
      await Promise.all(promises);
    } catch (error) {
      console.error("Error playing sounds:", error);
    }
  };

  const pauseAllSounds = () => {
    [fireAudioRef, windAudioRef, jugnuAudioRef].forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  };

  const toggleSound = async () => {
    if (!soundOn) {
      await playAllSounds();
      setSoundOn(true);
    } else {
      pauseAllSounds();
      setSoundOn(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="main-content">
        {/* Audio */}
        <audio ref={fireAudioRef} src={fireMp3} loop preload="auto" />
        <audio ref={windAudioRef} src={windMp3} loop preload="auto" />
        <audio ref={jugnuAudioRef} src={jugnuMp3} loop preload="auto" />

        <button className="sound-toggle" onClick={toggleSound}>
          {soundOn ? "🔇 Sound Off" : "🔈 Sound On"}
        </button>

        {/* Navbar */}
        <nav className="navbar">
          <ul>
            <li>
              <a onClick={scrollToTop}>Home</a>
            </li>
            <li>
              <a onClick={() => setAboutModalOpen(true)}>About Us</a>
            </li>
            <li>
              <a href="/morse">Morse</a>
            </li>
            <li>
              <a href="/music">Music</a>
            </li>
            <li>
              <a href="/polaroid">Meme</a>
            </li>
          </ul>
        </nav>

        {/* Stars */}
        <div className="stars" id="stars-container"></div>

        {/* Clouds */}
        {[1, 2, 3, 4, 5].map((num) => (
          <img
            key={num}
            src={finalImg}
            className={`cloud cloud${num}`}
            alt="Cloud"
          />
        ))}

        {/* Logs */}
        {[1, 2, 3, 4].map((num) => (
          <img
            key={num}
            src={woodImg}
            className={`wood-log log${num}`}
            alt="Log"
          />
        ))}

        {/* Fire */}
        <img src={flameGif} className="fire-gif" alt="Fire" />

        {/* Smoke */}
        <div className="smoke">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Boxes */}
        <div className="glass-boxes">
          <a href="/morse" className="glass-box-link">
            <div className="glass-box">
              <h2>Morse</h2>
              <p>
                Convert text to morse code
                <br />
                and decode secret messages
              </p>
            </div>
          </a>
          <a href="/music" className="glass-box-link">
            <div className="glass-box">
              <h2>Music</h2>
              <p>
                Relaxing ambient sounds
                <br />
                for focus and meditation
              </p>
            </div>
          </a>
          <a href="/polaroid" className="glass-box-link">
            <div className="glass-box">
              <h2>Meme</h2>
              <p>
                Generate funny memes
                <br />
                and share with friends
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Modal */}
      {aboutModalOpen && (
        <div
          className="about-modal active"
          onClick={(e) =>
            e.target.classList.contains("about-modal") &&
            setAboutModalOpen(false)
          }
        >
          <div className="about-modal-content">
            <button
              className="close-btn"
              onClick={() => setAboutModalOpen(false)}
            >
              &times;
            </button>
            <div className="about-header">
              <h1>About Us</h1>
              <p>
                Memorix was crafted during the "Blast from the Past" hackathon —
                a cozy retro-campfire themed platform featuring Morse-based
                communication, ambient night music, and a nostalgic meme
                generator.
              </p>
            </div>
            <div className="about-content">
              <div className="about-card">
                <h3>Key Features</h3>
                <ul>
                  <li>Morse Code Messenger</li>
                  <li>Ambient Music Player</li>
                  <li>Polaroid Meme Generator</li>
                  <li>
                    Campfire scene with fire, logs, clouds, smoke, and stars
                  </li>
                </ul>
              </div>
              <div className="about-card">
                <h3>Tech Stack</h3>
                <ul>
                  <li>React.js, Node.js, Tailwind, JWT</li>
                  <li>Web Audio API & Canvas</li>
                  <li>CSS Grid & Flexbox</li>
                </ul>
              </div>
            </div>
            <div className="team-section">
              <h3>Team Memorix</h3>
              <div className="team-grid">
                {/* Team members listed */}
                {/* Add all your team members here as shown earlier */}
              </div>
            </div>
            <div className="contact-info">
              <h3>Get In Touch</h3>
              <p>Email: memorix.team@gmail.com</p>
              <p>
                GitHub:{" "}
                <a
                  href="https://github.com/UdayGangal/NeonBrains"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Memorix-Team
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemorixApp;
