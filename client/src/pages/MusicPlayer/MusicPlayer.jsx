// import React from "react";

// function MusicPlayer() {
//   return (
//     <div>
//       <h1>Music Player</h1>
//     </div>
//   );
// }

// export default MusicPlayer;

import React, { useState, useRef, useEffect } from "react";
import cassette from "./cassette2.png"; // Ensure you have the correct path to your cassette image
const RetroWalkman = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playlistVisible, setPlaylistVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState("🎵 Now Playing: None");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("retro");
  const [volume, setVolume] = useState(1);

  const audioRef = useRef(null);
  const soundEffectRef = useRef(null);

  const themeStyles = {
    retro: {
      "--color-text": "#fef200",
      "--color-bg": "#000",
    },
    dark: {
      "--color-text": "#ffffff",
      "--color-bg": "#1a1a1a",
    },
    light: {
      "--color-text": "#000000",
      "--color-bg": "#ffffff",
    },
  };

  const playSoundEffect = () => {
    if (soundEffectRef.current) {
      soundEffectRef.current.currentTime = 0;
      soundEffectRef.current
        .play()
        .catch((e) => console.log("Sound effect failed:", e));
    }
  };

  const handleCassetteClick = async () => {
    if (!playlistVisible) {
      const query = searchQuery || prompt("Search for music:");
      if (!query) return;

      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            query
          )}&media=music&entity=song&limit=10`
        );
        const data = await response.json();
        setTracks(data.results);
        setCurrentTrackIndex(0);
        setPlaylistVisible(true);
      } catch (e) {
        console.error("Error fetching songs:", e);
        alert("Failed to fetch songs.");
      }
    } else {
      setPlaylistVisible(false);
    }
    playSoundEffect();
  };

  const playTrack = (track, index) => {
    if (audioRef.current) {
      audioRef.current.src = track.previewUrl;
      audioRef.current.play();
      setNowPlaying(`🎵 Now Playing: ${track.trackName} — ${track.artistName}`);
      setIsPlaying(true);
      setCurrentTrackIndex(index);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    playSoundEffect();
  };

  const handleBack = () => {
    if (tracks.length === 0) return;
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[newIndex], newIndex);
    playSoundEffect();
  };

  const handleForward = () => {
    if (tracks.length === 0) return;
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(tracks[newIndex], newIndex);
    playSoundEffect();
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleAudioEnded = () => {
    handleForward();
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnded);
      audioRef.current.addEventListener("pause", handleAudioPause);
      audioRef.current.addEventListener("play", handleAudioPlay);

      return () => {
        audioRef.current?.removeEventListener("ended", handleAudioEnded);
        audioRef.current?.removeEventListener("pause", handleAudioPause);
        audioRef.current?.removeEventListener("play", handleAudioPlay);
      };
    }
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-600 flex flex-col items-center p-8 font-mono text-sm`}
      style={{
        ...themeStyles[theme],
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
        backgroundImage:
          "linear-gradient(135deg, #000 25%, #111 25%, #111 50%, #000 50%, #000 75%, #111 75%, #111 100%)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Theme Selector */}
      <div className="absolute top-4 right-4 z-10">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="text-xs p-2 rounded border-2 border-yellow-400 bg-gray-800 text-yellow-400 font-mono"
        >
          <option value="retro">🎮 Retro 80s</option>
          <option value="dark">🌙 Dark</option>
          <option value="light">🌞 Light</option>
        </select>
      </div>

      {/* Title */}
      <h1 className="text-center text-2xl text-pink-500 mb-8">
        📼 Retro Walkman Music Player
      </h1>

      {/* Search Box */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for songs..."
        className="block mx-auto mb-6 p-2 w-4/5 max-w-md text-sm border-2 border-yellow-400 rounded bg-gray-800 text-cyan-400 font-mono"
      />

      {/* Main Section */}
      <div className="flex justify-center items-start w-full max-w-6xl relative">
        {/* Volume Control */}
        <div className="flex flex-col items-center mr-4 text-cyan-400 text-xs">
          <label htmlFor="volumeSlider" className="mb-2">
            🔊
          </label>
          <input
            type="range"
            id="volumeSlider"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider h-32 w-2"
            style={{
              writingMode: "bt-lr",
              WebkitAppearance: "slider-vertical",
            }}
          />
        </div>

        {/* Main Container */}
        <div className="flex flex-col items-center gap-4 flex-1">
          {/* Cassette */}
          <div className="w-full max-w-2xl">
            <div
              onClick={handleCassetteClick}
              className="cassette-img w-full border-4 border-yellow-400 rounded-xl cursor-pointer shadow-lg"
              style={{ boxShadow: "0 0 20px #00ffc3" }}
            >
              <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-6xl">
                  <img src={cassette} alt="Cassette image" />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5">
            <button
              onClick={handlePlayPause}
              className="retro-button bg-pink-600 border-2 border-yellow-400 text-white text-sm px-6 py-3 mx-2 cursor-pointer rounded-lg font-mono"
              style={{ boxShadow: "0 0 10px #ff0054" }}
            >
              ▶ / ⏸
            </button>
            <button
              onClick={handleBack}
              className="retro-button bg-pink-600 border-2 border-yellow-400 text-white text-sm px-6 py-3 mx-2 cursor-pointer rounded-lg font-mono"
              style={{ boxShadow: "0 0 10px #ff0054" }}
            >
              ⏮
            </button>
            <button
              onClick={handleForward}
              className="retro-button bg-pink-600 border-2 border-yellow-400 text-white text-sm px-6 py-3 mx-2 cursor-pointer rounded-lg font-mono"
              style={{ boxShadow: "0 0 10px #ff0054" }}
            >
              ⏭
            </button>
          </div>

          {/* Equalizer */}
          {isPlaying && (
            <div className="flex gap-1 justify-center mt-4">
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
            </div>
          )}

          {/* Now Playing */}
          <p className="mt-4 text-xs text-cyan-400">{nowPlaying}</p>
        </div>

        {/* Playlist */}
        {playlistVisible && (
          <div className="flex-none w-80 ml-4 p-4 bg-gray-800 border-2 border-dashed border-yellow-400 rounded-lg text-cyan-400 text-xs">
            <strong>Playlist:</strong>
            <br />
            {tracks.map((track, index) => (
              <div
                key={index}
                onClick={() => {
                  playTrack(track, index);
                  playSoundEffect();
                }}
                className={`py-1 border-b border-gray-600 cursor-pointer hover:text-yellow-400 ${
                  index === currentTrackIndex ? "text-yellow-400 font-bold" : ""
                }`}
              >
                {track.trackName} — {track.artistName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audio Elements */}
      <audio ref={audioRef} />
      <audio
        ref={soundEffectRef}
        src="https://www.soundjay.com/buttons/sounds/button-16.mp3"
      />
    </div>
  );
};

export default RetroWalkman;
