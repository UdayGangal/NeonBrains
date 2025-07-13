import React, { useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import {
  Crop as CropIcon,
  Palette,
  Sun,
  Contrast,
  Droplets,
  RotateCw,
  Undo2,
  Sparkles,
} from "lucide-react";
import "react-image-crop/dist/ReactCrop.css";
import "./ImageEditor.css"; // Ensure you have this CSS file for styles
import "./shared.css"; // Assuming you have a CSS file for pixel font

// interface ImageEditorProps {
//   imageSrc: string;
//   onImageEdit: (editedImageSrc: string, filters: ImageFilters) => void;
// }

// interface ImageFilters {
//   brightness: number;
//   contrast: number;
//   saturation: number;
//   hue: number;
//   sepia: number;
//   blur: number;
//   grayscale: number;
// }

const ImageEditor = ({ imageSrc, onImageEdit }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    sepia: 0,
    blur: 0,
    grayscale: 0,
  });
  const [activeTab, setActiveTab] = useState("filters");
  const [presetFilter, setPresetFilter] = useState("none");

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const presetFilters = {
    none: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      sepia: 0,
      blur: 0,
      grayscale: 0,
    },
    vintage: {
      brightness: 110,
      contrast: 120,
      saturation: 80,
      hue: 15,
      sepia: 30,
      blur: 0,
      grayscale: 0,
    },
    cyberpunk: {
      brightness: 120,
      contrast: 150,
      saturation: 200,
      hue: 280,
      sepia: 0,
      blur: 0,
      grayscale: 0,
    },
    noir: {
      brightness: 90,
      contrast: 140,
      saturation: 0,
      hue: 0,
      sepia: 0,
      blur: 0,
      grayscale: 100,
    },
    neon: {
      brightness: 130,
      contrast: 110,
      saturation: 180,
      hue: 320,
      sepia: 0,
      blur: 0,
      grayscale: 0,
    },
    sepia: {
      brightness: 110,
      contrast: 105,
      saturation: 90,
      hue: 30,
      sepia: 100,
      blur: 0,
      grayscale: 0,
    },
    dream: {
      brightness: 115,
      contrast: 95,
      saturation: 120,
      hue: 350,
      sepia: 10,
      blur: 1,
      grayscale: 0,
    },
  };

  const applyPresetFilter = (preset) => {
    setPresetFilter(preset);
    setFilters(presetFilters[preset]);
  };

  const resetFilters = () => {
    setPresetFilter("none");
    setFilters(presetFilters.none);
  };

  const generateFilterString = () => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hue}deg) sepia(${filters.sepia}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%)`;
  };

  useEffect(() => {
    onImageEdit(imageSrc, filters);
  }, [filters, imageSrc, onImageEdit]);

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
    if (imgRef.current && canvasRef.current && crop.width && crop.height) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const image = imgRef.current;

      if (!ctx) return;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              onImageEdit(reader.result, filters);
            }
          };
          reader.readAsDataURL(blob);
        }
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-lg border-2 border-pink-400 shadow-lg retro-glow">
      <h2 className="text-2xl font-bold text-pink-300 mb-4 pixel-font">
        IMAGE EDITOR
      </h2>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab("filters")}
          className={`retro-button px-4 py-2 rounded-lg font-bold pixel-font transition-all duration-300 ${
            activeTab === "filters"
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          FILTERS
        </button>
        <button
          onClick={() => setActiveTab("crop")}
          className={`retro-button px-4 py-2 rounded-lg font-bold pixel-font transition-all duration-300 ${
            activeTab === "crop"
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <CropIcon className="w-4 h-4 inline mr-2" />
          CROP
        </button>
      </div>

      {/* Filters Tab */}
      {activeTab === "filters" && (
        <div className="space-y-6">
          {/* Preset Filters */}
          <div>
            <h3 className="text-lg font-bold text-cyan-300 mb-3 pixel-font">
              PRESET FILTERS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(presetFilters).map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyPresetFilter(preset)}
                  className={`retro-button px-3 py-2 rounded text-xs font-bold pixel-font transition-all duration-300 ${
                    presetFilter === preset
                      ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600"
                  }`}
                >
                  {preset.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Filters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-cyan-300 pixel-font">
                MANUAL ADJUSTMENTS
              </h3>
              <button
                onClick={resetFilters}
                className="retro-button bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-3 py-1 rounded text-xs font-bold pixel-font flex items-center space-x-1"
              >
                <Undo2 className="w-3 h-3" />
                <span>RESET</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brightness */}
              <div className="space-y-2">
                <label className="flex items-center text-yellow-300 text-sm font-bold pixel-font">
                  <Sun className="w-4 h-4 mr-2" />
                  BRIGHTNESS: {filters.brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.brightness}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      brightness: Number(e.target.value),
                    }))
                  }
                  className="w-full retro-slider"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <label className="flex items-center text-orange-300 text-sm font-bold pixel-font">
                  <Contrast className="w-4 h-4 mr-2" />
                  CONTRAST: {filters.contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.contrast}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      contrast: Number(e.target.value),
                    }))
                  }
                  className="w-full retro-slider"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <label className="flex items-center text-pink-300 text-sm font-bold pixel-font">
                  <Droplets className="w-4 h-4 mr-2" />
                  SATURATION: {filters.saturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={filters.saturation}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      saturation: Number(e.target.value),
                    }))
                  }
                  className="w-full retro-slider"
                />
              </div>

              {/* Hue */}
              <div className="space-y-2">
                <label className="flex items-center text-green-300 text-sm font-bold pixel-font">
                  <RotateCw className="w-4 h-4 mr-2" />
                  HUE: {filters.hue}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={filters.hue}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      hue: Number(e.target.value),
                    }))
                  }
                  className="w-full retro-slider"
                />
              </div>

              {/* Sepia */}
              <div className="space-y-2">
                <label className="flex items-center text-amber-300 text-sm font-bold pixel-font">
                  <Sparkles className="w-4 h-4 mr-2" />
                  SEPIA: {filters.sepia}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.sepia}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sepia: Number(e.target.value),
                    }))
                  }
                  className="w-full retro-slider"
                />
              </div>

              {/* Grayscale */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-300 text-sm font-bold pixel-font">
                  GRAYSCALE: {filters.grayscale}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.grayscale}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      grayscale: Number(e.target.value),
                    }))
                  }
                  className="w-full retro-slider"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crop Tab */}
      {activeTab === "crop" && (
        <div className="space-y-4">
          <div className="text-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => handleCropComplete(c)}
              aspect={1}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                style={{ filter: generateFilterString() }}
                className="max-w-full h-auto rounded-lg"
                alt="Crop preview"
              />
            </ReactCrop>
          </div>
          <p className="text-cyan-300 text-sm text-center pixel-font">
            Drag to select crop area. Aspect ratio is locked to 1:1 for Polaroid
            format.
          </p>
        </div>
      )}

      {/* Preview */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-cyan-300 mb-3 pixel-font">
          PREVIEW
        </h3>
        <div className="flex justify-center">
          <img
            src={imageSrc}
            style={{ filter: generateFilterString() }}
            className="max-w-full h-48 object-cover rounded-lg border-2 border-cyan-400"
            alt="Filtered preview"
          />
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageEditor;
