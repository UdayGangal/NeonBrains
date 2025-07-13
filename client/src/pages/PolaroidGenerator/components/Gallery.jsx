import React, { useState, useEffect } from "react";
import { Trash2, Download, Eye, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import "./Gallery.css"; // Assuming you have a CSS file for styling
import "./shared.css"; // Assuming you have a CSS file for pixel font
const Gallery = () => {
  const [savedPolaroids, setSavedPolaroids] = useState([]);
  const [selectedPolaroid, setSelectedPolaroid] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("retrosnap-gallery");
    if (stored) {
      setSavedPolaroids(JSON.parse(stored));
    }
  }, []);

  const deletePolaroid = (id) => {
    const updated = savedPolaroids.filter((p) => p.id !== id);
    setSavedPolaroids(updated);
    localStorage.setItem("retrosnap-gallery", JSON.stringify(updated));
    setSelectedPolaroid(null);
    toast.success("🗑️ Polaroid deleted!", {
      style: {
        background: "#1a1a2e",
        color: "#00f5ff",
        border: "2px solid #ff00ff",
      },
    });
  };

  const downloadPolaroid = (polaroid) => {
    const link = document.createElement("a");
    link.download = `retrosnap-${polaroid.id}.png`;
    link.href = polaroid.imageSrc;
    link.click();
    toast.success("📱 Polaroid downloaded!", {
      style: {
        background: "#1a1a2e",
        color: "#00f5ff",
        border: "2px solid #ff00ff",
      },
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (savedPolaroids.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 p-6 rounded-lg border-2 border-gray-600 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-400 mb-4 pixel-font text-center">
          GALLERY EMPTY
        </h2>
        <p className="text-gray-500 text-center pixel-font">
          Create some Polaroids to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 p-6 rounded-lg border-2 border-purple-400 shadow-lg retro-glow">
      <h2 className="text-2xl font-bold text-purple-300 mb-4 pixel-font">
        RETRO GALLERY
      </h2>

      {!selectedPolaroid ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedPolaroids.map((polaroid) => (
            <div
              key={polaroid.id}
              className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedPolaroid(polaroid)}
            >
              <div className="bg-white p-2 rounded-lg shadow-lg transform rotate-1 group-hover:rotate-0 transition-transform duration-300">
                <img
                  src={polaroid.imageSrc}
                  alt="Gallery item"
                  className="w-full h-32 object-cover rounded-sm"
                />
                <div className="mt-1 text-center">
                  <p className="text-xs text-gray-800 pixel-font truncate">
                    {polaroid.caption || "No caption"}
                  </p>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => setSelectedPolaroid(null)}
            className="retro-button bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg pixel-font"
          >
            ← BACK TO GALLERY
          </button>

          {/* Selected polaroid */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-2xl transform rotate-1">
                <img
                  src={selectedPolaroid.imageSrc}
                  alt="Selected polaroid"
                  className="w-full max-w-md h-auto object-cover rounded-sm"
                />
                <div className="mt-3 text-center">
                  <p className="text-gray-800 pixel-font">
                    {selectedPolaroid.caption || "No caption"}
                  </p>
                </div>
              </div>
            </div>

            {/* Details and actions */}
            <div className="lg:w-80 space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-purple-400">
                <h3 className="text-lg font-bold text-purple-300 mb-3 pixel-font">
                  DETAILS
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="pixel-font">
                      {formatDate(selectedPolaroid.timestamp)}
                    </span>
                  </div>
                  <div className="text-gray-300 text-sm">
                    <span className="pixel-font">
                      Frame: {selectedPolaroid.frameStyle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => downloadPolaroid(selectedPolaroid)}
                  className="w-full retro-button bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="pixel-font">DOWNLOAD</span>
                </button>

                <button
                  onClick={() => deletePolaroid(selectedPolaroid.id)}
                  className="w-full retro-button bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="pixel-font">DELETE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
